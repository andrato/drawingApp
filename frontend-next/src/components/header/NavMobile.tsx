import { Close, Menu } from "@mui/icons-material";
import { Avatar, Box, BoxProps, Divider, Drawer, IconButton, Typography, useTheme} from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import { LocalStorageKeys } from "../../utils/constants/LocalStorage";
import { ResultType, SignInButton, SignUpButton } from "./Navbar";
import { SignUp } from "../user/SignUp";
import { SignIn } from "../user/SignIn";
import { Result } from "../user/Result";
import { useRouter } from "next/router";
import Link from "next/link";

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
    const isActive = useRouter().basePath === to;

    return (
        <Link href={to} style={{
            textDecoration: 'none', 
        }}>
            <Box sx={(theme) => ({
                px: 3,
                backgroundColor: isActive ? theme.palette.backgroundCustom.active : "none",
                whiteSpace: "nowrap",
                ':hover': {
                    backgroundColor: isActive ? theme.palette.backgroundCustom.active : theme.palette.backgroundCustom.hover,
                },
                py: "4px",
            })}>
                <Typography 
                    variant="body2"
                    sx={(theme) => ({
                        color: (!color || isActive) ? theme.palette.textCustom.primary : `${color}`,
                        lineHeight: theme.customSizes.linkHeight,
                        fontWeight: isActive ? 'bold' : `${fontWeight}`,
                    })}
                >
                    {children}
                </Typography>
            </Box>
        </Link>)
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
    const userToken = useRef<string | null>(null);
    const theme = useTheme();

    useEffect(() => {
        userToken.current = localStorage.getItem(LocalStorageKeys.USER_TOKEN)
    }, [])

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
                sx={(theme) => ({ m: 0, color: theme.palette.textCustom.primary })}
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
                        backgroundColor: theme.palette.backgroundCustom.main,
                        color: theme.palette.textCustom.primary,
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
                        {userToken.current ? (<NavbarAuth>
                            <Avatar sx={(theme) => ({ width: 32, height: 32, bgcolor: theme.palette.textCustom.secondary, mr: 2})}>A</Avatar>
                            <Typography variant="body2" sx={(theme) => ({
                                color: theme.palette.textCustom.primary, 
                                fontWeight: "bold",
                            })}>
                                {`Welcome, Andra`}
                            </Typography>  
                        </NavbarAuth>) : (
                            <Typography variant="body2" sx={(theme) => ({
                                color: theme.palette.textCustom.primary, 
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            })}>
                                {`Welcome`}
                            </Typography> 
                        )}
                        <IconButton onClick={() => setDrawer(false)}>
                            <Close fontSize="small" sx={(theme) => ({color: theme.palette.textCustom.primary,})}/>
                        </IconButton> 

                    </NavHeader>
                    <Divider sx={(theme) => ({backgroundColor: theme.palette.textCustom.primary})}/>
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
                        <StyledLink to="/draw" color={theme.palette.textCustom.secondary} fontWeight="bold">
                            Draw
                        </StyledLink>
                    </Box>
                    {userToken.current && (<>
                        <Divider sx={(theme) => ({backgroundColor: theme.palette.textCustom.primary})}/>
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
                                    localStorage.removeItem(LocalStorageKeys.USER_INFO);
                                    setDrawer(false);
                                    window.location.reload();
                                }}
                                sx={(theme) => ({
                                    px: 3, 
                                    py: "4px",
                                    ':hover': {
                                        backgroundColor: theme.palette.textCustom.primary,
                                    },
                                })
                            }>
                                <Typography 
                                    component="span" 
                                    variant="body2" 
                                    sx={(theme) => ({
                                        lineHeight: theme.customSizes.linkHeight,
                                    })}
                                > Logout </Typography>
                            </Box>
                        </Box>
                    </>)}
                </div>
                {!userToken.current && <div>
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