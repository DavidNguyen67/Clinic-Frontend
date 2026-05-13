import useSWR, { mutate } from "swr";
import { useMutation } from "./swr";
import { METHOD } from "./global";
import { AuthResponse } from "../types";
import { USER_ROLE } from "../types/auth";
import { useNavigate } from "react-router";
import { RegisterFormValues } from "../components/RegisterForm/config";
import { LoginFormValues } from "../components/LoginForm/config";

// ── Key & initial state ─────────────────────────────────────────
const KEY = "medcare/auth";

const initialState: AuthResponse = {
  accessToken: "",
  refreshToken: "",
  user: null,
};

export const ROLE_DEFAULT_PATHS: Record<USER_ROLE, string> = {
  PATIENT: "/patient",
  DOCTOR: "/doctor",
  ADMIN: "/admin",
  STAFF: "/staff",
};

// ── Typed actions (plain functions — no Context needed) ─────────
function _set(state: AuthResponse) {
  mutate(KEY, state, { revalidate: false });
}

// ── Hook ────────────────────────────────────────────────────────
export function useAuth() {
  const navigate = useNavigate();

  const { data = initialState } = useSWR<AuthResponse>(KEY, null, {
    fallbackData: initialState,
  });

  const loginMutation = useMutation<AuthResponse>("/api/v1/auth/login", {
    url: "/api/v1/auth/login",
    method: METHOD.POST,
    notification: {
      message: "Đăng nhập thành công",
      title: "Xác thực",
    },
    onSuccess: (response) => {
      window.location.href = "/";
    },
  });

  const registerMutation = useMutation<AuthResponse>("/api/v1/auth/register", {
    url: "/api/v1/auth/register",
    method: METHOD.POST,
    notification: {
      message: "Đăng ký thành công",
      title: "Xác thực",
    },
  });

  const refreshMutation = useMutation<AuthResponse>("/api/v1/auth/refresh", {
    url: "/api/v1/auth/refresh",
    method: METHOD.POST,
  });

  const logoutMutation = useMutation("/api/v1/auth/logout", {
    url: "/api/v1/auth/logout",
    method: METHOD.POST,
    notification: {
      message: "Đăng xuất thành công",
      title: "Xác thực",
    },
  });

  const login = async (formValues: LoginFormValues) => {
    const { body } = await loginMutation.trigger(formValues);
    if (body) {
      _set({
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        user: body?.user,
      });

      localStorage.setItem("refreshToken", body.refreshToken);
      localStorage.setItem("accessToken", body.accessToken);
    }
  };

  const register = async (formValues: RegisterFormValues) => {
    const { body } = await registerMutation.trigger(formValues);
    if (body) {
      _set({
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        user: body?.user,
      });
      localStorage.setItem("accessToken", body.accessToken);
      localStorage.setItem("refreshToken", body.refreshToken);
    }
  };

  const refresh = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = data.accessToken;

    if (accessToken) {
      return;
    }
    if (refreshToken) {
      const { body } = await refreshMutation.trigger({ refreshToken });
      if (body) {
        _set({
          accessToken: body.accessToken,
          refreshToken: body.refreshToken,
          user: body?.user,
        });
        localStorage.setItem("accessToken", body.accessToken);
        localStorage.setItem("refreshToken", body.refreshToken);
      }
    }
  };

  const logout = async () => {
    _set(initialState);
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await logoutMutation.trigger({ refreshToken });
    } catch (error) {}
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("auth-redirect");
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const getRedirectPath = (): string | null => {
    const stored = sessionStorage.getItem("auth-redirect");
    sessionStorage.removeItem("auth-redirect");
    return stored;
  };

  return {
    user: data.user,
    login,
    refresh,
    register,
    logout,
    getRedirectPath,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}
