import { Box } from "@mui/material"
import { SortBy } from "../common/constants"
import { ProfileDrawingsSorting } from "./ProfileDrawingsSorting"
import { PROFILE_WIDTH } from "./ProfileInfo"

export const sortByOptionsUser = [
    SortBy.NEWEST, 
    SortBy.RATINGS_HIGH,
    SortBy.MOST_REVIEWED,
]

export const UserProfileDrawings = ({userId}: {userId: string}) => {
    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: `calc(100% - ${PROFILE_WIDTH}px - 16px)`,
        justifyContent:"space-between",
    }}>
        {
            sortByOptionsUser.map((sortBy) => {
                return <ProfileDrawingsSorting sortBy={sortBy} userId={userId}/>
            })
        }
    </Box>
}