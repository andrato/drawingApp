import { UserType } from "@/services/User";
import { ReactNode } from "react";

export type Order = 'asc' | 'desc';
export interface Data {
    _id: string;
    user_id: string,
    name: string;
    created: number;
    lastUpdated: number;
    admin: boolean;
    drawings: number;
    reviews: number;
    rating: number;
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
    displayed?: boolean;
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