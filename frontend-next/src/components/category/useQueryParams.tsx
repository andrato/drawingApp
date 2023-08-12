import { useSearchParams } from 'next/navigation'
import { QueryParams, SortBy } from '../common/constants';

export const useQueryParams = () => {
    const searchParams = useSearchParams();
    const cursor = searchParams.get(QueryParams.CURSOR);
    const sortBy = searchParams.get(QueryParams.SORT_BY) ?? SortBy.NEWEST;
    const search = searchParams.get(QueryParams.SEARCH);
    const labels = searchParams.getAll(QueryParams.LABELS) ?? [];
    const startDate = searchParams.get(QueryParams.START_DATE);
    const endDate = searchParams.get(QueryParams.END_DATE);
    const category = searchParams.get(QueryParams.CATEGORY);

    return {
        cursor,
        sortBy,
        search,
        labels,
        startDate,
        endDate,
        category,
    }
}