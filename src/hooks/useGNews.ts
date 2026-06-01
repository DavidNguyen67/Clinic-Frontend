import useSWR from "swr";
import { buildQueryParams } from "@/lib/utils";
import { NewsResponse } from "@/interface/response";
import axios from "axios";
import _ from "lodash";

const fetcher = (url: string) => axios.get<NewsResponse>(url).then((res) => res.data);

export const useGNews = (filters?: {
  category?: string;
  lang?: string;
  country?: string;
  max?: number;
}) => {
  const payload = _.merge({}, filters, { apikey: process.env.NEXT_PUBLIC_GNEWS_API_KEY });
  const query = buildQueryParams(payload);

  return useSWR<NewsResponse>(`https://gnews.io/api/v4/top-headlines?${query}`, fetcher);
};
