import { DrawingAdminType } from "@/services/Drawings";
import { UserType } from "@/services/User";

export type Order = 'asc' | 'desc';

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

/* for Users */
export interface Data {
    _id: string;
    name: string;
    created: number;
    lastUpdated: number;
    admin: boolean;
    drawings: number;
}

export interface SortData {
    _id: string;
    name: string;
    created: number;
    lastUpdated: number;
    drawings: number;
}

export interface HeadCell {
    id: keyof Data;
    label: string;
    numeric: boolean;
}

export const mapUsersToTableData = (users: UserType[]): Data[] => {
    return users.map((user) => ({
        _id: user._id,
        name: `${user.lastName}, ${user.firstName}`,
        created: user.created,
        lastUpdated: user.lastUpdated,
        admin: user.isAdmin,
        drawings: user.drawings ?? 0,
    }))
};

/* for Drawings */
export enum Category {
    TOP_ART = "Top Art",
    TOP_AMATEUR = "Top Amateur",
    GALLERY = "Gallery",
}
export interface DataDrawings {
    _id: string;
    userId: string,
    name: string;
    created: number;
    lastUpdated: number;
    reviews: number;
    rating: number;
    labels: string;
    category: Category;
}

export interface SortDataDrawings {
    _id: string;
    name: string;
    created: number;
    lastUpdated: number;
    reviews: number;
    rating: number;
}
export interface HeadCellDrawing {
    id: keyof DataDrawings;
    label: string;
    numeric: boolean;
    displayed?: boolean;
}

export const mapDrawingsToTableData = (drawings: DrawingAdminType[]): DataDrawings[] => {
    return drawings.map((drawing) => ({
        _id: drawing.id,
        userId: drawing.userId,
        name: drawing.displayTitle,
        created: drawing.created,
        lastUpdated: drawing.lastUpdated,
        reviews: drawing.reviews ?? 0,
        rating: Number(drawing.rating ?? 0),
        labels: drawing.labels?.join() ?? '',
        category: drawing.topArt ? Category.TOP_ART : drawing.topAmateur ? Category.TOP_AMATEUR : Category.GALLERY,
    }))
};