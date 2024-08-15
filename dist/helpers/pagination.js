"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationHelpers = (objectPagination, query, countRecords) => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }
    if (query.limit) {
        objectPagination.limitIteam = parseInt(query.limit);
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitIteam;
    const totalPage = Math.ceil(countRecords / objectPagination.limitIteam);
    objectPagination.totalPage = totalPage;
    return objectPagination;
};
exports.default = paginationHelpers;
