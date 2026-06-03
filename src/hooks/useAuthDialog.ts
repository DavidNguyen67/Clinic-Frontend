"use client";
import useSWR, { mutate } from "swr";
import { AUTH_ERROR_SWR_KEY } from "@/hooks/index";

export type AuthErrorType = "unauthenticated" | "access-denied" | null;

export interface AuthDialogState {
  type: AuthErrorType;
  open: boolean;
}

const DEFAULT_STATE: AuthDialogState = {
  type: null,
  open: false,
};

export const showUnauthenticatedDialog = () =>
  mutate(
    AUTH_ERROR_SWR_KEY,
    { type: "unauthenticated", open: true } satisfies AuthDialogState,
    false
  );

export const showAccessDeniedDialog = () =>
  mutate(
    AUTH_ERROR_SWR_KEY,
    { type: "access-denied", open: true } satisfies AuthDialogState,
    false
  );

export const closeAuthDialog = () =>
  mutate(
    AUTH_ERROR_SWR_KEY,
    (prev: AuthDialogState | undefined) => ({ ...(prev ?? DEFAULT_STATE), open: false }),
    false
  );

export function useAuthDialog() {
  const { data: state = DEFAULT_STATE } = useSWR<AuthDialogState>(AUTH_ERROR_SWR_KEY, null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  return {
    ...state,
    showUnauthenticated: showUnauthenticatedDialog,
    showAccessDenied: showAccessDeniedDialog,
    close: closeAuthDialog,
  };
}
