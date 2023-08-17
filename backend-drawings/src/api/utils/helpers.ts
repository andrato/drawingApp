import { DrawingType, SortBy } from "../utils/types";

export const sortDrawings = (drawings: DrawingType[], sortBy: SortBy) => {
    let newDrawings: DrawingType[] = [];

    console.log("in helpers");
    
    switch(sortBy) {
        case SortBy.NEWEST: {
            newDrawings = drawings.sort((a,b) => b.created - a.created);
            break;
        };
        case SortBy.OLDEST: {
            newDrawings = drawings.sort((a,b) => a.created - b.created);
            break;
        };
        case SortBy.MOST_REVIEWED: {
            newDrawings = drawings.sort((a,b) => b.reviews - a.reviews);
            break;
        };
        case SortBy.LEAST_REVIEWED: { 
            newDrawings = drawings.sort((a,b) => a.reviews - b.reviews);
            break;
        };
        case SortBy.RATINGS_HIGH: {
            newDrawings = drawings.sort((a,b) => b.rating - a.rating);
            break;
        };
        case SortBy.RATINGS_LOW: {
            newDrawings = drawings.sort((a,b) => a.rating - b.rating);
            break;
        };
    }

    return newDrawings.length > 0 ? newDrawings : drawings;
}