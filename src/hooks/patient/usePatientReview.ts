import { useSession } from "@/hooks/useSession";
import { useMutation, useSWRWrapper } from "@/hooks/swr";
import { ReviewResponse } from "@/interface/response";
import { METHOD } from "@/hooks/global";
import { ReviewFormValues } from "@/components/ReviewDialog/config";

export const usePatientReviewDetailByAptId = (aptId: string | null) => {
  const { accessToken } = useSession();
  return useSWRWrapper<ReviewResponse>(
    `/api/v1/patient/review/appointment/${aptId}?accessToken=${accessToken}`,
    {
      url: `/api/v1/patient/review/appointment/${aptId}`,
      method: METHOD.GET,
      enable: !!aptId,
    }
  );
};

export const usePatientReview = () => {
  const createMutation = useMutation<unknown>("/api/v1/patient/review", {
    url: "/api/v1/patient/review",
    method: METHOD.POST,
    notification: {
      message: "You have created your appointment successfully!",
      title: "Review Appointment",
    },
  });

  const updateMutation = useMutation<unknown>("/api/v1/patient/review", {
    url: "/api/v1/patient/review",
    method: METHOD.PATCH,
    notification: {
      message: "You have created your appointment successfully!",
      title: "Review Appointment",
    },
  });

  const createReview = (formValues: ReviewFormValues) => {
    const payload = formValues;
    return createMutation.trigger(payload);
  };

  const updateReview = (formValues: ReviewFormValues) => {
    const payload = formValues;
    return updateMutation.trigger(payload);
  };

  return {
    createReview,
    updateReview,
  };
};
