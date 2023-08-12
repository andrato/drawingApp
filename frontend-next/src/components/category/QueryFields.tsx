import { useEffect, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, SxProps, TextField, Theme } from "@mui/material";
import { useRouter } from "next/router";
import { QueryParams, SortBy, QuerySortToApiSort, labelsDrawing, sortByOptions, ApiSortToQuerySort } from "@/components/common/constants";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { useQueryParams } from "./useQueryParams";
import { RestartAlt } from "@mui/icons-material";

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

    }, [sortBy, endDate, startDate]);

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
                defaultValue={ApiSortToQuerySort[sortBy]}
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
            value={startDate ? dayjs(startDate)  : null}
            onChange={(newDate) => {   
                newDate && router.replace({
                    query: { ...router.query, [QueryParams.START_DATE]: newDate.toString()},
                });
            }}
        />
        <DatePicker
            label="End Date"
            slotProps={{ textField: { size: 'small'} }}
            value={endDate ? dayjs(endDate) : null}
            onChange={(newDate) => {   
                newDate && router.replace({
                    query: { ...router.query, [QueryParams.END_DATE]: newDate.toString()},
                });
            }}
        />
        <TextField 
            id="outlined-basic" 
            label="Search by name" 
            variant="outlined" 
            size="small"
            color="info"
            defaultValue={search}
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
        <Button 
                variant="contained" 
                size="small" 
                startIcon={<RestartAlt />}
                onClick={() => {
                    router.replace({
                        query: {},
                    });
                }}
                sx={(theme) => ({
                    m: 0,
                    height: "37px",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.backgroundCustom.main,
                    fontWeight: "bold",
                    textTransform: 'none',
                    ':hover': {
                        backgroundColor: theme.palette.primary.light,
                    },
                })}
            >
                Reset
            </Button>
    </Box>
}