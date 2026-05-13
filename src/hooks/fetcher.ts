/* eslint-disable @typescript-eslint/no-explicit-any */

import { METHOD } from "./global";

export const replacePlaceholder = (s: string, data: Record<string, unknown>) => {
  const parts = s.split(/{(.*?)}/g).map((v) => {
    const replaced = v.replace(/{/g, "");

    if (data instanceof FormData) {
      return data.get(replaced) || replaced;
    }

    return data[replaced] || replaced;
  });

  return parts.join("");
};

const runsOnServerSide = typeof window === "undefined";

export const fetcher = async <T = any>(
  url: string,
  method: METHOD,
  body?: Record<string, unknown> | FormData,
  headers?: HeadersInit,
  noEndPoint?: boolean
) => {
  let parsedUri = `${noEndPoint ? "" : "http://localhost:8080"}${url}${
    method === METHOD.GET && body
      ? `?${new URLSearchParams(body as unknown as Record<string, string>)}`
      : ""
  }`;

  parsedUri = replacePlaceholder(parsedUri, (body as unknown as Record<string, unknown>) || {});

  const reqHeaders = {
    ...headers,
    ...(!(body instanceof FormData) && {
      "Content-Type": "application/json; charset=UTF-8",
    }),
  };

  if (runsOnServerSide) {
  }
  const res = await fetch(parsedUri, {
    method,
    headers: reqHeaders,
    ...(method !== METHOD.GET && {
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  });

  if (!res.ok) {
    let error: any = {};
    const errorText = await res.text();

    try {
      error = JSON.parse(errorText);
    } catch {
      error.message = errorText;
    }
    error.status = res.status;
    if (runsOnServerSide) {
    }
    throw error;
  }

  return res.json() as Promise<T>;
};
