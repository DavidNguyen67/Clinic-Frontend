import { useMutation } from "@/hooks/swr";
import { ApiPagedResponse, METHOD } from "@/hooks/global";
import { ClinicServiceResponse } from "@/interface";

export const useClinicServices = () => {
  const fetchList = useMutation<ApiPagedResponse<ClinicServiceResponse>>("/api/v1/admin/service", {
    url: "/api/v1/admin/service",
    method: METHOD.GET,
  });

  return { fetchList };
};
