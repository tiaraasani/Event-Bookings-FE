export interface PaginationMeta {
  page: number;
  take: number;
  total: number;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationQueryParams {
  page?: number;
  take?: number;
  sortOrder?: string;
  sortBy?: string;
  search?: string;
}
