import { Logout, Settings } from "@mui/icons-material";
import { Avatar, Divider, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material"
import { LocalStorageKeys } from "../utils/constants/LocalStorage";
import { useRouter } from "next/router";

export const NavUser = ({
    anchorEl,
    onClose,
}: {
    anchorEl: HTMLElement | null;
    onClose: () => void;
}) => {
    const router = useRouter();

    return <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        onClick={onClose}
        PaperProps={{
            elevation: 0,
            sx: {
                width: 200,
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                },
                '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                },
            },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
        <MenuItem onClick={() => router.push('/profile')}>
            <Avatar /> 
            <Typography component="span" variant="body2"> Profile </Typography>
        </MenuItem>
        <Divider />
        {/* <MenuItem onClick={onClose}>
            <ListItemIcon>
                <Settings fontSize="small" />
            </ListItemIcon>
            <Typography component="span" variant="body2"> Settings </Typography>
        </MenuItem> */}
        <MenuItem onClick={() => {
            localStorage.removeItem(LocalStorageKeys.USER_TOKEN);
            localStorage.removeItem(LocalStorageKeys.USER_INFO); 
            onClose(); 
            window.location.reload();
        }}>
            <ListItemIcon>
                <Logout fontSize="small" />
            </ListItemIcon>
            <Typography component="span" variant="body2"> Logout </Typography>
        </MenuItem>
    </Menu>
}