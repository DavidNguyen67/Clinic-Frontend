import { MedicalInfoFormValues } from "@/components/MedicalInfoForm/config";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { METHOD } from "@/hooks/global";
import { useMutation } from "@/hooks/swr";
import _ from "lodash";

export const usePatientProfile = () => {
  const currentProfile = useCurrentProfile();

  const updateProfileMutation = useMutation<unknown>(
    `/api/v1/patient/patient-profile/${currentProfile?.data?.body?.patient?.id}`,
    {
      url: `/api/v1/patient/patient-profile/${currentProfile?.data?.body?.patient?.id}`,
      method: METHOD.PATCH,
      notification: {
        title: "Patient Profile",
        message: "You have successfully updated your patient profile",
      },
    }
  );

  const createProfileMutation = useMutation<unknown>(`/api/v1/patient/patient-profile`, {
    url: `/api/v1/patient/patient-profile`,
    method: METHOD.POST,
    notification: {
      title: "Patient Profile",
      message: "You have successfully created your patient profile",
    },
  });

  const updatePatientProfile = async (formValues: MedicalInfoFormValues) => {
    await updateProfileMutation.trigger(formValues);
  };

  const createPatientProfile = async (formValues: MedicalInfoFormValues) => {
    const payload: any = _.cloneDeep(formValues);
    payload.userId = currentProfile.data?.body?.id;
    await createProfileMutation.trigger(payload);
  };

  return {
    updatePatientProfile,
    createPatientProfile,
  };
};
