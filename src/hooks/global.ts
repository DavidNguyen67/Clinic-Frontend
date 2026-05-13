export enum METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export type ApiResponse<T = Record<string, unknown> | string> = {
  headers: Record<string, string>;
  body: T;
  statusCode: string;
  statusCodeValue: number;
};

export type ApiPagedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
};
