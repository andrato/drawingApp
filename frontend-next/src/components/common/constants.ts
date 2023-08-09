
export const categories = ["Top Art", "Top Amateur", "Gallery"];

export enum SortBy {
    RECENT = "Recent" ,
    OLDEST =  "Oldest",
    POPULAR = "Popular",
};

export const sortByOptions = [
    SortBy.RECENT, 
    SortBy.OLDEST, 
    SortBy.POPULAR
]

export const HOST = "http://localhost:8080";