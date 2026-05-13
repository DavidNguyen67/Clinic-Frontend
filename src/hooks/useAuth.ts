"use client";
import { LoginFormValues } from "@/components/LoginForm/config";
import { RegisterFormValues } from "@/components/RegisterForm/config";
import { ROLE_NAME } from "@/common";
import { useMutation } from "./swr";
import { METHOD } from "./global";
import { AuthState, clearAuthState, setAuthState } from "./useSession";
import _ from "lodash";
import { formatDateToApi } from "@/lib/utils";
import {
  EmailFormValues,
  OtpFormValues,
  ResetFormValues,
} from "@/components/ForgotPasswordForm/config";

export const ROLE_DEFAULT_PATHS: Record<ROLE_NAME, string> = {
  [ROLE_NAME.PATIENT]: "/patient",
  [ROLE_NAME.DOCTOR]: "/doctor",
  [ROLE_NAME.ADMIN]: "/admin",
  [ROLE_NAME.STAFF]: "/staff",
};

export function useAuth() {
  const loginMutation = useMutation<AuthState>("/api/v1/auth/login", {
    url: "/api/v1/auth/login",
    method: METHOD.POST,
    notification: { title: "Authentication", message: "You have successfully logged in" },
  });

  const registerMutation = useMutation<AuthState>("/api/v1/auth/register", {
    url: "/api/v1/auth/register",
    method: METHOD.POST,
    notification: { title: "Authentication", message: "You have successfully registered" },
  });

  const refreshMutation = useMutation<AuthState>("/api/v1/auth/refresh", {
    url: "/api/v1/auth/refresh",
    method: METHOD.POST,
  });

  const forgotPasswordMutation = useMutation("/api/v1/auth/forgot-password", {
    url: "/api/v1/auth/forgot-password",
    method: METHOD.POST,
    notification: {
      title: "Authentication",
      message: "If the email exists, a reset link has been sent",
    },
  });

  const logoutMutation = useMutation("/api/v1/auth/logout", {
    url: "/api/v1/auth/logout",
    method: METHOD.POST,
  });

  const verifyOtpMutation = useMutation<{ resetToken: string }>("/api/v1/auth/verify-otp", {
    url: "/api/v1/auth/verify-otp",
    method: METHOD.POST,
    notification: {
      title: "Authentication",
      message: "OTP verified successfully",
    },
  });

  const resetMutation = useMutation("/api/v1/auth/reset-password", {
    url: "/api/v1/auth/reset-password",
    method: METHOD.POST,
    notification: {
      title: "Authentication",
      message: "Password reset successfully",
    },
  });

  const login = async (formValues: LoginFormValues) => {
    const response = await loginMutation.trigger(formValues);
    setAuthState(response?.body);
    localStorage.setItem("refreshToken", response?.body.refreshToken);
  };

  const register = async (formValues: RegisterFormValues) => {
    const payload = _.cloneDeep(formValues);
    payload.dateOfBirth = formatDateToApi(payload.dateOfBirth) as any;
    const response = await registerMutation.trigger(payload);
    setAuthState(response?.body);
    localStorage.setItem("refreshToken", response?.body.refreshToken);
  };

  const refresh = async (currentAccessToken?: string) => {
    if (currentAccessToken) return;

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return;

    try {
      const response = await refreshMutation.trigger({ refreshToken });
      setAuthState(response?.body);
      localStorage.setItem("refreshToken", response?.body.refreshToken);
    } catch {
      clearAuthState();
      localStorage.removeItem("refreshToken");
    }
  };

  const forgotPassword = async (formValues: EmailFormValues) => {
    await forgotPasswordMutation.trigger(formValues);
  };

  const verifyOtp = async (formValues: OtpFormValues) => {
    return await verifyOtpMutation.trigger(formValues);
  };

  const resetPassword = async (formValues: ResetFormValues) => {
    await resetMutation.trigger(formValues);
  };

  const logout = async () => {
    clearAuthState();
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await logoutMutation.trigger({ refreshToken });
    } catch {}
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("auth-redirect");
  };

  const saveRedirectPath = (path: string) => {
    sessionStorage.setItem("auth-redirect", path);
  };

  const getRedirectPath = (): string | null => {
    const stored = sessionStorage.getItem("auth-redirect");
    sessionStorage.removeItem("auth-redirect");
    return stored;
  };

  return {
    login,
    register,
    refresh,
    logout,
    verifyOtp,
    forgotPassword,
    resetPassword,
    saveRedirectPath,
    getRedirectPath,
  };
}
