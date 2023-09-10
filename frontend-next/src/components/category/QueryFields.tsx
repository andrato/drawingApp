import { ReactNode, useEffect, useState } from "react";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, SxProps, TextField, Theme, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { QueryParams, SortBy, QuerySortToApiSort, labelsDrawing, sortByOptions, ApiSortToQuerySort, categories } from "@/components/common/constants";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { useQueryParams } from "./useQueryParams";
import { RestartAlt } from "@mui/icons-material";

const SearchBarSx: SxProps<Theme> = (theme) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 2,
    mb: 2,

    [theme.breakpoints.down('sm')]: {
        flexDirection: "column",
    },

    '.MuiSelect-iconOutlined, .MuiFormLabel-root, .MuiOutlinedInput-input': {
        color: `${theme.palette.textCustom.primary} !important`,
    },
    '.MuiSelect-iconOpen': {
        color: `${theme.palette.textCustom.primary} !important`,
    },
    '.MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.textCustom.primary,
    },
});

const SearchSubElemSx: SxProps<Theme> = (theme) => ({
    display:"flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 2,
})

export const QueryFields = ({
    showSortBy = true,
    showCategory=false,
    children,
    onResetFilters,
}: {
    showSortBy?: boolean,
    showCategory?: boolean,
    children?: ReactNode,
    onResetFilters?: () => void,
}) => {
    const router = useRouter();
    // const [labels, setLabelsQuery] = useState<string[]>([]);
    const {sortBy, search, startDate, endDate, labels, category} = useQueryParams();
    const theme = useTheme();
    const isMdScreenUp = useMediaQuery(theme.breakpoints.up('md'));

    const onChangeSearch = (e: any) => {
        const value = e.target.value;

        router.replace({
            query: { ...router.query, [QueryParams.SEARCH]: value},
        });
    };

    const handleReset = () => {
        router.replace({
            query: {[QueryParams.SORT_BY]: "newest"},
        });
    }

    const debouncedOnChange = debounce(onChangeSearch, 500);

    const handleChangeLabels = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;

        const newLabels = typeof value === 'string' ? value.split(',') : value;

        // setLabelsQuery(newLabels);

        router.replace({
            query: { ...router.query, [QueryParams.LABELS]: newLabels},
        });
    };

    useEffect(() => {

    }, [sortBy, endDate, startDate, labels, category]);

    return <Box sx={SearchBarSx}>
        <Box sx={SearchSubElemSx}>
            {children}
            {showSortBy && <FormControl sx={{ 
                width: 150,
                [theme.breakpoints.down('sm')]: {
                    width: "100%",
                },
            }}>
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
            </FormControl>}
            {showCategory && <FormControl sx={{ 
                width: 150,
                [theme.breakpoints.down('sm')]: {
                    width: "100%",
                },
             }}>
                <InputLabel 
                    id="demo-simple-select-standard-label"
                    size="small"
                    sx={(theme) => ({
                        color: `${theme.palette.textCustom.primary} !important`,
                    })}
                >
                    Category
                </InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    size="small"
                    variant="outlined"
                    defaultValue={category}
                    onChange={(event) => {
                        const value = event.target.value as SortBy;
                        
                        router.replace({
                            query: { ...router.query, [QueryParams.CATEGORY]: value},
                        });
                    }}
                    label="Sort by"
                    sx={(theme) => ({
                        bgColor: theme.palette.backgroundCustom.dark,
                        color: `${theme.palette.textCustom.primary} !important`,
                    })}
                >
                    {categories.map((option) => {
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
            </FormControl>}
            <TextField 
                id="outlined-basic" 
                label="Search by name" 
                variant="outlined" 
                size="small"
                color="info"
                defaultValue={search}
                onChange={debouncedOnChange}
                sx={(theme) => ({
                    [theme.breakpoints.down('sm')]: {
                        width: "100%",
                    },
                })}
            />
        </Box>
        <Box sx={SearchSubElemSx}>
            <DatePicker
                label="Start Date"
                slotProps={{ textField: { size: 'small'} }}
                value={startDate ? dayjs(startDate)  : null}
                onChange={(newDate) => {   
                    newDate && router.replace({
                        query: { ...router.query, [QueryParams.START_DATE]: newDate.toString()},
                    });
                }}
                sx={(theme) => ({
                    [theme.breakpoints.down('sm')]: {
                        width: "100%",
                    },
                })}
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
                sx={(theme) => ({
                    [theme.breakpoints.down('sm')]: {
                        width: "100%",
                    },
                })}
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
                    sx={(theme) => ({
                        [theme.breakpoints.down('sm')]: {
                            width: "100%",
                        },
                    })}
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
            {isMdScreenUp ? <Button 
                variant="contained" 
                size="small" 
                startIcon={<RestartAlt />}
                onClick={() => {onResetFilters ? onResetFilters() : handleReset()}}
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
            </Button> : <IconButton
                size="small" 
                onClick={() => {onResetFilters ? onResetFilters() : handleReset()}}
                sx={(theme) => ({
                    m: 0,
                    height: "37px",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.backgroundCustom.main,
                    fontWeight: "bold",
                    textTransform: 'none',
                    borderRadius: "20%",
                    ':hover': {
                        backgroundColor: theme.palette.primary.light,
                    },
                })}
            >
                <RestartAlt />
            </IconButton>}
        </Box>
    </Box>
}