import { UserResponse } from "@/interface/response";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/navigation";
import { ROLE_NAME } from "@/common";
import { AUTH_SWR_KEY } from ".";
import { LoginFormValues } from "@/components/LoginForm/config";
import { RegisterFormValues } from "@/components/RegisterForm/config";
import { useMutation } from "./swr";
import { METHOD } from "./global";

export type AuthState = {
  accessToken: string;
  refreshToken: string;
  user: UserResponse | null;
};

export const AUTH_INITIAL_STATE: AuthState = {
  accessToken: "",
  refreshToken: "",
  user: null,
};

// Map role → default path sau khi login
export const ROLE_DEFAULT_PATHS: Record<ROLE_NAME, string> = {
  [ROLE_NAME.PATIENT]: "/patient",
  [ROLE_NAME.DOCTOR]: "/doctor",
  [ROLE_NAME.ADMIN]: "/admin",
  [ROLE_NAME.STAFF]: "/staff",
};

function _set(state: AuthState) {
  mutate(AUTH_SWR_KEY, state, { revalidate: false });
}

export const useAuth = () => {
  const router = useRouter();

  const { data = AUTH_INITIAL_STATE } = useSWR<AuthState>(AUTH_SWR_KEY, null, {
    fallbackData: AUTH_INITIAL_STATE,
  });

  const loginMutation = useMutation<AuthState>("/api/v1/auth/login", {
    url: "/api/v1/auth/login",
    method: METHOD.POST,
    notification: {
      message: "You have successfully logged in",
      title: "Authentication",
    },
  });

  const registerMutation = useMutation<AuthState>("/api/v1/auth/register", {
    url: "/api/v1/auth/register",
    method: METHOD.POST,
    notification: {
      message: "You have successfully registered",
      title: "Authentication",
    },
  });

  const refreshMutation = useMutation<AuthState>("/api/v1/auth/refresh", {
    url: "/api/v1/auth/refresh",
    method: METHOD.POST,
  });

  const logoutMutation = useMutation("/api/v1/auth/logout", {
    url: "/api/v1/auth/logout",
    method: METHOD.POST,
  });

  const login = async (formValues: LoginFormValues) => {
    const response = await loginMutation.trigger(formValues);

    _set(response?.body);
    localStorage.setItem("refreshToken", response?.body.refreshToken);

    const redirectPath = getRedirectPath();
    const defaultPath = response?.body.user ? ROLE_DEFAULT_PATHS[response?.body?.user?.role] : "/";
    router.push(redirectPath ?? defaultPath);
  };

  const register = async (formValues: RegisterFormValues) => {
    const response = await registerMutation.trigger(formValues);

    _set(response?.body);
    localStorage.setItem("refreshToken", response?.body.refreshToken);

    router.push("/");
  };

  const refresh = async () => {
    if (data.accessToken) return;

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return;

    try {
      const response = await refreshMutation.trigger({ refreshToken });
      _set(response?.body);
      localStorage.setItem("refreshToken", response?.body.refreshToken);
    } catch {
      _set(AUTH_INITIAL_STATE);
      localStorage.removeItem("refreshToken");
    }
  };

  const logout = async () => {
    _set(AUTH_INITIAL_STATE);
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await logoutMutation.trigger({ refreshToken });
    } catch {}
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("auth-redirect");
    router.push("/auth/login");
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
    user: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    isAuthenticated: !!data.accessToken,
    login,
    register,
    refresh,
    logout,
    saveRedirectPath,
    getRedirectPath,
  };
};
