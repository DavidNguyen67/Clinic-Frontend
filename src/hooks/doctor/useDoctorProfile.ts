import { BioFormValues } from "@/components/DoctorProrfile/BioEducationForm/config";
import { FeeFormValues } from "@/components/DoctorProrfile/FeeForm/config";
import { ProfessionalInfoFormValues } from "@/components/DoctorProrfile/ProfessionalInfoForm/config";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { METHOD } from "@/hooks/global";
import { useMutation } from "@/hooks/swr";
import _ from "lodash";

export const useDoctorProfile = () => {
  const currentProfile = useCurrentProfile();

  const updateProfileMutation = useMutation<unknown>(
    `/api/v1/doctor/doctor-profile/${currentProfile?.data?.body?.doctor?.id}`,
    {
      url: `/api/v1/doctor/doctor-profile/${currentProfile?.data?.body?.doctor?.id}`,
      method: METHOD.PATCH,
      notification: {
        title: "Doctor Profile",
        message: "You have successfully updated your doctor profile",
      },
    }
  );

  const createProfileMutation = useMutation<unknown>(`/api/v1/doctor/doctor-profile`, {
    url: `/api/v1/doctor/doctor-profile`,
    method: METHOD.POST,
    notification: {
      title: "Doctor Profile",
      message: "You have successfully created your doctor profile",
    },
  });

  const updateDoctorProfile = async (
    formValues: ProfessionalInfoFormValues | BioFormValues | FeeFormValues
  ) => {
    await updateProfileMutation.trigger(formValues);
  };

  const createDoctorProfile = async (
    formValues: ProfessionalInfoFormValues | BioFormValues | FeeFormValues
  ) => {
    const payload: any = _.cloneDeep(formValues);
    payload.userId = currentProfile.data?.body?.id;
    await createProfileMutation.trigger(payload);
  };

  return {
    updateDoctorProfile,
    createDoctorProfile,
  };
};
