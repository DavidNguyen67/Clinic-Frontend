import { BasicInfoFormValues } from "@/components/BasicInfoForm/config";
import { METHOD } from "@/hooks/global";
import { useMutation } from "@/hooks/swr";
import { AuthState } from "@/hooks/useSession";
import { formatDateToApi } from "@/lib/utils";
import _ from "lodash";

export const useUpdateUser = () => {
  const updateProfileMutation = useMutation<AuthState>("/api/v1/auth/update-profile", {
    url: "/api/v1/auth/update-profile",
    method: METHOD.PATCH,
    notification: {
      title: "Authentication",
      message: "You have successfully updated your profile",
    },
  });

  const updateProfile = async (formValues: BasicInfoFormValues) => {
    const payload = _.cloneDeep(formValues);
    payload.dateOfBirth = formatDateToApi(payload.dateOfBirth) as any;
    await updateProfileMutation.trigger(payload);
  };

  return {
    updateProfile,
  };
};
