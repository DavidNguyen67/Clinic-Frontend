// lib/axiosInstance.ts
"use client";
import { AUTH_SESSION_SWR_KEY } from "@/hooks";
import { AUTH_INITIAL_STATE } from "@/hooks/useSession";
import axios from "axios";
import { mutate } from "swr";
import { showUnauthenticatedDialog, showAccessDeniedDialog } from "@/hooks/useAuthDialog";

/**
 * Sanitize request body before sending:
 * - Trim strings
 * - Strip null / undefined fields
 * - Recurse into nested objects & arrays
 * - Skip FormData (leave as-is)
 */
const sanitizeBody = (
  body: Record<string, unknown> | FormData | undefined
): Record<string, unknown> | FormData | undefined => {
  if (!body || body instanceof FormData) return body;

  const sanitizeValue = (value: unknown): unknown => {
    if (value === null || value === undefined) return undefined;
    if (typeof value === "string") return value.trim();
    if (Array.isArray(value)) {
      return value.map(sanitizeValue).filter((v) => v !== null && v !== undefined);
    }
    if (typeof value === "object") {
      return sanitizeBody(value as Record<string, unknown>);
    }
    return value;
  };

  return Object.fromEntries(
    Object.entries(body)
      .map(([key, value]) => [key, sanitizeValue(value)])
      .filter(([, value]) => value !== null && value !== undefined)
  );
};

// ─── Axios Instance ───────────────────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use((config) => {
  if (config.data && !(config.data instanceof FormData)) {
    config.data = sanitizeBody(config.data as Record<string, unknown>);
  }
  return config;
});

// ─── Response Interceptor ────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // ── 403 Access Denied ──────────────────────────────────────────────────
    // Show dialog immediately — no retry logic needed.
    if (status === 403) {
      showAccessDeniedDialog();
      return Promise.reject(error);
    }

    // ── Non-401 errors — pass through unchanged ────────────────────────────
    if (status !== 401) {
      return Promise.reject(error);
    }

    // ── 401 already retried → refresh also failed → session is truly gone ──
    // Only show the unauthenticated dialog at this point, not on the first 401
    // (which may just mean the access token expired and can be silently refreshed).
    if (originalRequest._retry) {
      showUnauthenticatedDialog();
      return Promise.reject(error);
    }

    // ── 401 first attempt → try to silently refresh the token ─────────────
    if (isRefreshing) {
      // Another request is already refreshing — queue this one and wait.
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          // Queue was flushed with an error — refresh failed, show dialog.
          showUnauthenticatedDialog();
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
        refreshToken,
      });

      // Persist new tokens & update SWR session cache.
      localStorage.setItem("refreshToken", data.refreshToken);
      mutate(
        AUTH_SESSION_SWR_KEY,
        { accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user },
        { revalidate: false }
      );

      processQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Refresh request itself failed — clear local auth state and show dialog.
      processQueue(refreshError, null);
      localStorage.removeItem("refreshToken");
      mutate(AUTH_SESSION_SWR_KEY, AUTH_INITIAL_STATE, { revalidate: false });
      showUnauthenticatedDialog();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
