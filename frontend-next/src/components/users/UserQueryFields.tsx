import { ReactNode} from "react";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SxProps, TextField, Theme, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { QueryParams, SortBy, QuerySortToApiSort, sortByOptions, ApiSortToQuerySort } from "@/components/common/constants";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { RestartAlt } from "@mui/icons-material";
import { useQueryParams } from "../category/useQueryParams";

const SearchBarSx: SxProps<Theme> = (theme) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
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

export const UserQueryFields = ({
    children,
    onResetFilters,
}: {
    children?: ReactNode,
    onResetFilters?: () => void,
}) => {
    const router = useRouter();
    const {sortBy, search, startDate, endDate} = useQueryParams();
    const theme = useTheme();
    const isMdScreenUp = useMediaQuery(theme.breakpoints.up('md'));

    const onChangeSearch = (e: any) => {
        const value = e.target.value;

        router.replace({
            query: { ...router.query, [QueryParams.SEARCH_USER]: value},
        });
    };

    const handleReset = () => {
        router.replace({
            query: {[QueryParams.SORT_BY]: "newest"},
        });
    }

    const debouncedOnChange = debounce(onChangeSearch, 500);

    // useEffect(() => {

    // }, [sortBy, endDate, startDate, ]);

    return <Box sx={SearchBarSx}>
        {children}
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
            defaultValue={search ?? ''}
            onChange={debouncedOnChange}
        />
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
}