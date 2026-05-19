import { METHOD } from "@/hooks/global";
import { useMutation, useSWRWrapper } from "@/hooks/swr";

export const usePublicPatientCount = () => {
  return useSWRWrapper<number>("/api/v1/public/patient-profile/count", {
    url: "/api/v1/public/patient-profile/count",
    method: METHOD.GET,
  });
};

export const usePublicPatientProfile = (id: string) => {
  const publicPatchPatientProfile = useMutation(`/api/v1/public/patient-profile/${id}`, {
    url: `/api/v1/public/patient-profile/${id}`,
    method: METHOD.PATCH,
    notification: {
      message: "You have successfully updated the patient profile",
      title: "Patient Profile",
    },
  });

  const publicPostPatientProfile = useMutation(`/api/v1/public/patient-profile`, {
    url: `/api/v1/public/patient-profile`,
    method: METHOD.POST,
    notification: {
      message: "You have successfully created a patient profile",
      title: "Patient Profile",
    },
  });

  return {
    publicPatchPatientProfile,
    publicPostPatientProfile,
  };
};
