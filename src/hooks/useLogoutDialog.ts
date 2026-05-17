import useSWR from "swr";
import { AUTH_CONFIRM_LOGOUT_SWR_KEY } from "@/hooks/index";

const DEFAULT_STATE = {
  open: false,
};

export function useLogoutDialog() {
  const { data: state = DEFAULT_STATE, mutate } = useSWR(AUTH_CONFIRM_LOGOUT_SWR_KEY, null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  const openDialog = async () => {
    await mutate({ open: true });
  };

  const closeDialog = async () => {
    await mutate({ open: false });
  };

  return {
    ...state,
    openDialog,
    closeDialog,
  };
}
