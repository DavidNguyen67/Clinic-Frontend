import { buildQueryParams } from "@/lib/utils";
import { BaseFilter, ServiceResponse } from "@/interface/response";
import { useSWRWrapper } from "@/hooks/swr";
import { ApiPagedResponse, METHOD } from "@/hooks/global";

export const usePublicServiceList = (
  filter?: BaseFilter & {
    specialtyId?: string;
  }
) => {
  const query = buildQueryParams(filter);

  return useSWRWrapper<ApiPagedResponse<ServiceResponse>>(`/api/v1/public/service?${query}`, {
    url: `/api/v1/public/service?${query}`,
    method: METHOD.GET,
  });
};
