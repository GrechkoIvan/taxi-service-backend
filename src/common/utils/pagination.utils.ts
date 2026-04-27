export interface PaginateOptions {
  offset: number;
  limit: number;
}

export interface PaginateResult<T> {
  data: T[];
  meta: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
}

export function getPaginationOptions(query: {
  offset?: number;
  limit?: number;
}): PaginateOptions {
  return {
    offset: query.offset ?? 0,
    limit: query.limit ?? 10,
  };
}

export function paginate<T>(
  data: T[],
  total: number,
  options: PaginateOptions,
): PaginateResult<T> {
  const { offset, limit } = options;
  const hasMore = offset + data.length < total;
  return {
    data,
    meta: {
      total,
      offset,
      limit,
      hasMore,
    },
  };
}
