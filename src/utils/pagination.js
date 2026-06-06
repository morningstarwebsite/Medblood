export const getPagination = (page = 1, limit = 10) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit
  };
};

export const getPaginationMeta = (count, page, limit) => {
  const totalPages = Math.max(Math.ceil(count / limit), 1);

  return {
    totalItems: count,
    totalPages,
    currentPage: page,
    pageSize: limit
  };
};
