/**
 * Pagination helpers for list endpoints
 * (BACKEND_PLAN.md sections 21 and 40).
 */

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const getPagination = (query = {}) => {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const requestedLimit = parseInt(query.limit, 10) || DEFAULT_LIMIT;
    const limit = Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

const buildPaginationMeta = ({ page, limit, total }) => ({
    page,
    limit,
    total,
    totalPages: limit > 0 ? Math.ceil(total / limit) : 0
});

/**
 * Applies pagination to a Mongoose query and returns the paginated docs
 * together with the metadata needed by the response helper.
 */
const paginateQuery = async (query, pagination) => {
    const { page, limit, skip } = pagination;

    const [items, total] = await Promise.all([
        query.skip(skip).limit(limit).exec(),
        query.clone().countDocuments().exec()
    ]);

    return {
        items,
        pagination: buildPaginationMeta({ page, limit, total })
    };
};

module.exports = {
    DEFAULT_LIMIT,
    MAX_LIMIT,
    getPagination,
    buildPaginationMeta,
    paginateQuery
};