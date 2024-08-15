interface ObjectSearch{
    keyword: string,
    regex?: RegExp
}

const searchHelpers = (query: Record<string,any>):ObjectSearch =>{

    let objectSearch:ObjectSearch = {
        keyword:"",
    }

    if(query.keyword){
        objectSearch.keyword= query.keyword;

        const regex = new RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regex;
    }
    return objectSearch;
}
export default searchHelpers