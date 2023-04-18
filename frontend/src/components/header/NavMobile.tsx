import { Close, Menu } from "@mui/icons-material";
import { Avatar, Box, BoxProps, Divider, Drawer, IconButton, Typography} from "@mui/material";
import {
    navColors,
    navSizes
} from "./constants";
import { ReactNode, useState } from "react";
import { LocalStorageKeys } from "../../constants/LocalStorage";
import { NavUser } from "./NavUser";
import { NavLink, useMatch, useResolvedPath } from "react-router-dom";
import { ResultType, SignInButton, SignUpButton } from "./Navbar";
import { SignUp } from "../user/SignUp";
import { SignIn } from "../user/SignIn";
import { Result } from "../user/Result";

const NavHeader = ({children}: {children: ReactNode}) => (
    <Box 
        sx={{
            height: "58px",
            display: "flex",
            px: 2,
        }}
    >
        {children}
    </Box>
)
const NavbarAuth = ({children, props} : {children: React.ReactNode, props?: BoxProps}) => (
    <Box 
        {...props}
        sx={{
            display: "flex",
            justifyContent: "flex-start",
            width: "100%",
            alignItems: "center",
            mb: 1,
            height: "100%",
        }}
    >
        {children}
    </Box>
)

const StyledLink = ({
    children, 
    to, 
    color,
    fontWeight = "normal"
}: {
    children: ReactNode;
    to: string;
    color?: string;
    fontWeight?: string;
}) => {
    const resolvePath = useResolvedPath(to);
    const isActive = useMatch({path:resolvePath.pathname, end:true});

    return (
        <NavLink to={to} style={{
            textDecoration: 'none', 
        }}>
            <Box sx={{
                px: 3,
                backgroundColor: isActive ? `${navColors.activeElemBackground}` : "none",
                whiteSpace: "nowrap",
                ':hover': {
                    backgroundColor: isActive ? `${navColors.activeElemBackground}` : `${navColors.textNavColorHover}`,
                },
                py: "4px",
            }}>
                <Typography 
                    variant="body2"
                    sx={{
                        color: (!color || isActive) ? `${navColors.textNav}` : `${color}`,
                        lineHeight: `${navSizes.linkHeight}px`,
                        fontWeight: isActive ? 'bold' : `${fontWeight}`,
                    }}
                >
                    {children}
                </Typography>
            </Box>
        </NavLink>)
}

export const NavMobile = ({
    openSignIn,
    openSignUp,
    onOpenSignIn,
    onCloseSignIn,
    onOpenSignUp,
    onCloseSignUp,
    result,
    onResultClose,
}: {
    openSignIn: boolean;
    openSignUp: boolean;
    onOpenSignIn: () => void;
    onCloseSignIn: () => void;
    onOpenSignUp: () => void;
    onCloseSignUp: () => void;
    result: ResultType;
    onResultClose: () => void;
}) => {
    const [drawer, setDrawer] = useState(false);
    const userToken = localStorage.getItem(LocalStorageKeys.USER_TOKEN);

    return (
        <Box sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
        }}>
            <IconButton
                size="large"
                edge="start"
                aria-label="menu"
                sx={{ m: 0, color: navColors.textNav }}
                onClick={() => setDrawer(true)}
            >
                <Menu />
            </IconButton>
            <Drawer
                anchor="right"
                open={drawer}
                onClose={() => setDrawer(false)}
                sx={(theme) => ({
                    ".MuiDrawer-paper": {
                        width: "250px",
                        backgroundColor: navColors.navBackground,
                        color: navColors.textNav,
                        display: "flex",
                        justifyContent: "space-between",
                    },
                    [theme.breakpoints.down("sm")]: {
                        ".MuiDrawer-paper": {
                            width: "100%",
                        }
                    }
                })}
            >
                <div>
                    <NavHeader>
                        {userToken ? (<NavbarAuth>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: navColors.textNavDraw, mr: 2}}>A</Avatar>
                            <Typography variant="body2" sx={{
                                color: navColors.textNav, 
                                fontWeight: "bold",
                            }}>
                                {`Welcome, Andra`}
                            </Typography>  
                        </NavbarAuth>) : (
                            <Typography variant="body2" sx={{
                                color: navColors.textNav, 
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}>
                                {`Welcome`}
                            </Typography> 
                        )}
                        <IconButton onClick={() => setDrawer(false)}>
                            <Close fontSize="small" sx={{color: navColors.textNav,}}/>
                        </IconButton> 

                    </NavHeader>
                    <Divider sx={{backgroundColor: navColors.textNav}}/>
                    <Box 
                        onClick={() => setDrawer(false)}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            py: 1,
                        }}
                    >
                        <StyledLink to="/topart">
                            Top Art
                        </StyledLink>
                        <StyledLink to="/topamateur">
                            Top Amateur
                        </StyledLink>
                        <StyledLink to="/gallery">
                            Gallery
                        </StyledLink>
                        <StyledLink to="/users">
                            Users
                        </StyledLink>
                        <StyledLink to="/draw" color={navColors.textNavDraw} fontWeight="bold">
                            Draw
                        </StyledLink>
                    </Box>
                    {userToken && (<>
                        <Divider sx={{backgroundColor: navColors.textNav}}/>
                        <Box 
                            onClick={() => setDrawer(false)}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                py: 1,
                            }}
                        >
                            <StyledLink to="/profile">
                                Profile
                            </StyledLink>
                            <StyledLink to="/settings">
                                Settings
                            </StyledLink>
                        <Box 
                                onClick={() => {
                                    localStorage.removeItem(LocalStorageKeys.USER_TOKEN);
                                    setDrawer(false);
                                }}
                                sx={{
                                    px: 3, 
                                    py: "4px",
                                    ':hover': {
                                        backgroundColor: `${navColors.textNavColorHover}`,
                                    },
                                }
                            }>
                                <Typography 
                                    component="span" 
                                    variant="body2" 
                                    sx={{
                                        lineHeight: `${navSizes.linkHeight}px`,
                                    }}
                                > Logout </Typography>
                            </Box>
                        </Box>
                    </>)}
                </div>
                {!userToken && <div>
                    <Box sx={{
                        mb: 3,
                        display: "flex",
                        flexDirection: "column-reverse",
                    }}>
                        <SignUpButton setOpenSignUp={onOpenSignUp} sx={{mx: 2}}/>
                        <SignUp open={openSignUp} onHandleClose={onCloseSignUp} onOpenSignIn={onOpenSignIn}/>
                        <SignInButton setOpenSignIn={onOpenSignIn} sx={{mx: 2, mb: 1}}/>
                        <SignIn open={openSignIn} onHandleClose={onCloseSignIn} onOpenSignup={onOpenSignUp}/>
                        <Result 
                            open={result.openResult} 
                            step={result.step} 
                            onHandleClose={onResultClose} 
                            onOpenSignIn={onOpenSignIn} 
                            onOpenSignUp={onOpenSignUp}
                        />
                    </Box>
                </div>}
            </Drawer>
        </Box>
    );
}