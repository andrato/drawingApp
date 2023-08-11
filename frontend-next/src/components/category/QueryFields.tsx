import { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, SxProps, TextField, Theme } from "@mui/material";
import { useRouter } from "next/router";
import { QueryParams, SortBy, QuerySortToApiSort, labelsDrawing, sortByOptions, ApiSortToQuerySort } from "@/components/common/constants";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { useQueryParams } from "./useQueryParams";

const SearchBarSx: SxProps<Theme> = (theme) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 2,

    '.MuiSelect-iconOutlined, .MuiFormLabel-root, .MuiOutlinedInput-input': {
        color: `${theme.palette.textCustom.primary} !important`,
    },
    '.MuiSelect-iconOpen': {
        color: `${theme.palette.textCustom.primary} !important`,
    },
    '.MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.textCustom.primary,
    },
})

export const QueryFields = () => {
    const router = useRouter();
    const [labels, setLabelsQuery] = useState<string[]>([]);
    const {sortBy, search, startDate, endDate} = useQueryParams();

    const onChangeSearch = (e: any) => {
        const value = e.target.value;

        router.replace({
            query: { ...router.query, [QueryParams.SEARCH]: value},
        });
    };

    const debouncedOnChange = debounce(onChangeSearch, 500);

    const handleChangeLabels = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;

        const newLabels = typeof value === 'string' ? value.split(',') : value;

        setLabelsQuery(newLabels);

        router.replace({
            query: { ...router.query, [QueryParams.LABELS]: newLabels},
        });
    };

    useEffect(() => {

    }, [sortBy])

    return <Box sx={SearchBarSx}>
        <FormControl sx={{ width: 150 }}>
            <InputLabel 
                id="demo-simple-select-standard-label"
                size="small"
                sx={(theme) => ({
                    color: `${theme.palette.textCustom.primary} !important`,
                })}
            >
                Sort By
            </InputLabel>
            <Select
                labelId="demo-simple-select-standard-label"
                size="small"
                variant="outlined"
                value={ApiSortToQuerySort[sortBy]}
                onChange={(event) => {
                    const value = event.target.value as SortBy;
                    
                    router.replace({
                        query: { ...router.query, [QueryParams.SORT_BY]: QuerySortToApiSort[value]},
                    });
                }}
                label="Sort by"
                sx={(theme) => ({
                    bgColor: theme.palette.backgroundCustom.dark,
                    mb: 3,
                    color: `${theme.palette.textCustom.primary} !important`,
                })}
            >
                {sortByOptions.map((option) => {
                    return <MenuItem 
                        value={option} 
                        sx={(theme) => ({
                            ':hover': {
                                bgcolor: "#bcbcbc",
                            },
                            '&.Mui-selected, &.Mui-selected:hover': {
                                bgcolor: theme.palette.textCustom.disabled,
                            }
                        })}
                    >{option}</MenuItem>
                })}
            </Select>
        </FormControl>
        <DatePicker
            label="Start Date"
            slotProps={{ textField: { size: 'small'} }}
            value={dayjs(startDate)}
            onChange={(newDate) => {   
                router.replace({
                    query: { ...router.query, [QueryParams.START_DATE]: newDate?.millisecond()},
                });
            }}
        />
        <DatePicker
            label="End Date"
            slotProps={{ textField: { size: 'small'} }}
            onChange={(newDate) => {   
                const newDateString = (newDate as number).toString();

                router.replace({
                    query: { ...router.query, [QueryParams.END_DATE]: newDateString},
                });
            }}
        />
        <TextField 
            id="outlined-basic" 
            label="Search by name" 
            variant="outlined" 
            size="small"
            color="info"
            value={search}
            onChange={debouncedOnChange}
        />
        <FormControl sx={{ width: 150 }}>
            <InputLabel 
                size="small"
                id="demo-multiple-name-label"
            >Labels</InputLabel>
            <Select
                size="small"
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={labels}
                onChange={handleChangeLabels}
                input={<OutlinedInput label="Labels" />}
            >
                {labelsDrawing.map((label) => (
                    <MenuItem
                        key={label}
                        value={label}
                        sx={(theme) => ({
                            ':hover': {
                                bgcolor: "#bcbcbc",
                            },
                            '&.Mui-selected, &.Mui-selected:hover': {
                                bgcolor: theme.palette.textCustom.disabled,
                            }
                        })}
                    >
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    </Box>
}