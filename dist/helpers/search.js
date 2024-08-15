"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const searchHelpers = (query) => {
    let objectSearch = {
        keyword: "",
    };
    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        const regex = new RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regex;
    }
    return objectSearch;
};
exports.default = searchHelpers;
