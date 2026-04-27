export interface PaginateOptions {
  offset: number;
  limit: number;
  page: number;
}

export interface PaginateResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export function getPaginationOptions(query: {
  page?: number;
  limit?: number;
}): PaginateOptions {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const offset = (page - 1) * limit;
  return { offset, limit, page };
}

export function paginate<T>(
  data: T[],
  total: number,
  options: PaginateOptions,
): PaginateResult<T> {
  const { offset, limit, page } = options;
  const hasMore = offset + data.length < total;
  return {
    data,
    meta: {
      total,
      page,
      limit,
      offset,
      hasMore,
    },
  };
}
