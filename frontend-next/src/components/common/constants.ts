
export const categories = ["Top Art", "Top Amateur", "All"];
export const labelsDrawing = [
    "Sport",
    "Digital Art",
    "Nature",
    "Portrait",
    "Traditional Art",
]

export enum QueryParams {
    CURSOR = 'c',
    SEARCH = 'q',
    SEARCH_USER = 'q_u',
    START_DATE = 'start_date',
    END_DATE = 'end_date',
    SORT_BY = "sort_by",
    LABELS = "l",
    CATEGORY = "cat"
}

export enum SortBy {
    NEWEST = "Newest" ,
    OLDEST =  "Oldest",
    RATINGS_HIGH = "Higest Ratings",
    RATINGS_LOW = "Lowest Ratings",
    MOST_REVIEWED = "Most Reviewed",
    LEAST_REVIEWED = "Least Reviewed",
};
   
export const sortByOptions = [
    SortBy.NEWEST, 
    SortBy.OLDEST, 
    SortBy.RATINGS_HIGH,
    SortBy.RATINGS_LOW,
    SortBy.MOST_REVIEWED,
    SortBy.LEAST_REVIEWED,
]

export const QuerySortToApiSort: Record<SortBy, string> = {
    [SortBy.NEWEST]: "newest",
    [SortBy.OLDEST]: "oldest",
    [SortBy.RATINGS_HIGH]: "highRatings",
    [SortBy.RATINGS_LOW]: "lowRatings",
    [SortBy.MOST_REVIEWED]: "reviewsUp",
    [SortBy.LEAST_REVIEWED]: "reviewsDown",
};

export const ApiSortToQuerySort: Record<string, SortBy> = {
    newest: SortBy.NEWEST,
    oldest: SortBy.OLDEST,
    highRatings: SortBy.RATINGS_HIGH,
    lowRatings: SortBy.RATINGS_LOW,
    reviewsUp: SortBy.MOST_REVIEWED,
    reviewsDown: SortBy.LEAST_REVIEWED,
};

export const HOST = "http://localhost:8080";