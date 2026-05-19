import { MedicalInfoFormValues } from "@/components/MedicalInfoForm/config";
import { StaffInfoFormValues } from "@/components/StaffProfile/StaffInfoForm/config";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { METHOD } from "@/hooks/global";
import { useMutation } from "@/hooks/swr";
import _ from "lodash";

export const useStaffProfile = () => {
  const currentProfile = useCurrentProfile();

  const updateProfileMutation = useMutation<unknown>(
    `/api/v1/staff/staff-profile/${currentProfile?.data?.body?.staff?.id}`,
    {
      url: `/api/v1/staff/staff-profile/${currentProfile?.data?.body?.staff?.id}`,
      method: METHOD.PATCH,
      notification: {
        title: "Staff Profile",
        message: "You have successfully updated your staff profile",
      },
    }
  );

  const createProfileMutation = useMutation<unknown>(`/api/v1/staff/staff-profile`, {
    url: `/api/v1/staff/staff-profile`,
    method: METHOD.POST,
    notification: {
      title: "Staff Profile",
      message: "You have successfully created your staff profile",
    },
  });

  const updateStaffProfile = async (formValues: StaffInfoFormValues) => {
    await updateProfileMutation.trigger(formValues);
  };

  const createStaffProfile = async (formValues: StaffInfoFormValues) => {
    const payload: any = _.cloneDeep(formValues);
    payload.userId = currentProfile.data?.body?.id;
    await createProfileMutation.trigger(payload);
  };

  return {
    updateStaffProfile,
    createStaffProfile,
  };
};
