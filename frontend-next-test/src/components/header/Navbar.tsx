import { 
    Box, 
    Typography, 
    Button, 
    BoxProps,
    Avatar,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    ButtonProps, 
} from "@mui/material";
import {
    navColors,
    navSizes, 
} from "./constants";
import Image from 'next/image'
import React, { useEffect, useRef, useState } from "react";
import { SignUp } from "../user/SignUp";
import { SignIn } from "../user/SignIn";
import { Result } from "../user/Result";
import { Step } from "../user/utils";
import { LocalStorageKeys } from "../../utils/constants/LocalStorage";
import { NavUser } from "./NavUser";
import { NavMobile } from "./NavMobile";
import { useRouter } from "next/router";
import Link from "next/link";

const StyledBoxLink = ({
    children, 
    to, 
    color, 
    fontWeight = "normal"
} : {
    children: string, 
    to: string, 
    color?: string, 
    fontWeight?: string,
}) => {
    const isActive = useRouter().basePath === to;

    return (
    <Link href={to} style={{
        textDecoration: 'none', 
    }}>
        <Box sx={{
            px: 3,
            display: "flex",
            justifyContent: "center",
            borderRight: `1px solid ${navColors.textNav}`,
            height: `${navSizes.linkHeight}px`,
            // width: `${linkWidth}`,
            backgroundColor: isActive ? `${navColors.activeElemBackground}` : "none",
            whiteSpace: "nowrap",
            ':hover': {
                backgroundColor: isActive ? `${navColors.activeElemBackground}` : `${navColors.textNavColorHover}`,
            }
        }}>
            <Typography 
                variant="body2"
                sx={{
                    color: (!color || isActive) ? `${navColors.textNav}` : `${color}`,
                    lineHeight: `${navSizes.linkHeight}px`,
                    textTransform: 'uppercase',
                    fontSize: `${navSizes.fontSizeText}px`,
                    fontWeight: isActive ? 'bold' : `${fontWeight}`,
                }}
            >
                {children}
            </Typography>
        </Box>
    </Link>)
}

const NavbarWrapper = ({children, props} : {children: React.ReactNode, props?: BoxProps}) => {
    // const resolvePath = useResolvedPath('/draw');
    // const isActive = useMatch({path:resolvePath.pathname, end:true});

    const isActive = useRouter().basePath === '/draw';

    return (<Box 
        {...props}
        sx={{
            height: `${navSizes.navHeight}px`,
            width: "100%",
            backgroundColor: `${navColors.navBackground}`,
            borderBottom: isActive ? 0 : `0.5px solid ${navColors.textNav}`,
        }}
    >
        {children}
    </Box>)
}

const NavbarContainer = ({children, props} : {children: React.ReactNode, props?: BoxProps}) => (
    <Box 
        {...props}
        sx={{
            mx: 3,
            display: "flex",
            alignItems: "center",
            height: "100%",
        }}
    >
        {children}
    </Box>
)

const NavbarPagesLinks = ({children, props} : {children: React.ReactNode, props?: BoxProps}) => (
    <Box 
        {...props}
        sx={{
            display: "flex",
            alignItems: "center",
            '> a:first-of-type': {
                borderLeft: `1px solid ${navColors.textNav}`,
            },
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
            justifyContent: "flex-end",
            width: "100%",
            alignItems: "center",
        }}
    >
        {children}
    </Box>
)

export const SignInButton = ({setOpenSignIn, ...props}: {setOpenSignIn: () => void} & ButtonProps) => {
    return <Button 
        variant="contained" 
        size="small" 
        onClick={() => setOpenSignIn()}
        sx={{
            backgroundColor: `${navColors.textNavButton}`,
            color: `${navColors.navBackground}`,
            fontWeight: "bold",
            fontSize: `${navSizes.fontSizeButtonsText}px`,
            borderRadius: "18px",
            textTransform: 'none',
            ':hover': {
                backgroundColor: `${navColors.textNavButtonHover}`,
            },
            p: "3px 12px",
            ...(props?.sx ?? {})
        }}
    >
        Sign in
    </Button>
}

export const SignUpButton = ({setOpenSignUp, ...props}: {setOpenSignUp: () => void} & ButtonProps) => {
    return <Button 
        variant="outlined" 
        size="small" 
        onClick={() => setOpenSignUp()}
        sx={{
            color: `${navColors.textNavButton}`,
            mx: 1,
            fontWeight: "bold",
            fontSize: `${navSizes.fontSizeButtonsText}px`,
            border: `1px solid ${navColors.textNavButton}`,
            borderRadius: "18px",
            textTransform: 'none',
            ':hover': {
                color: `${navColors.textNavButtonHover}`,
                borderColor: `${navColors.textNavButtonHover}`,
            },
            p: "3px 12px",
            ...(props?.sx ?? {})
        }}
    >
        Sign up
    </Button>
}

export type ResultType = {openResult: boolean, step: Step | null};

export function Navbar() {
    const [openSignIn, setOpenSignIn] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);
    const [result, setResult] = useState<ResultType>({openResult: false, step: null});
    const userToken = useRef<string | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const theme = useTheme();
	const isMdScreenUp = useMediaQuery(theme.breakpoints.up(980));

    useEffect(() => {
        userToken.current = localStorage.getItem(LocalStorageKeys.USER_TOKEN)
    }, [])

    const handleSignInClose = () => {
        setOpenSignIn(false);
    }

    const handleSignUpClose = (step?: Step) => {
        setOpenSignUp(false);

        if (step) {
            setResult({openResult: true, step});
        }
    }

    const handleResultClose = () => {
        setResult({...result, openResult: false});
    }

    const handleOpenSignUp = () => {
        setOpenSignIn(false);
        setOpenSignUp(true);
    }

    const handleOpenSignIn = () => {
        setOpenSignIn(true);
        setOpenSignUp(false);
    }
 
    return (
    <NavbarWrapper>
        <NavbarContainer>
            <a href="/">
                <img className="image-img" src={'/logo.png'} height="50" style={{marginRight: "80px", marginTop: "5px"}}/>
                {/* <Image
                    src="/logo.png"
                    alt="Vercel Logo"
                    width={50}
                    height={50}
                    style={{marginRight: "80px", marginTop: "5px"}}
                    priority
                /> */}
            </a>
            {isMdScreenUp ? (<>
                <NavbarPagesLinks>
                    <StyledBoxLink to="/topart">
                        Top Art
                    </StyledBoxLink>
                    <StyledBoxLink to="/topamateur">
                        Top Amateur
                    </StyledBoxLink>
                    <StyledBoxLink to="/gallery">
                        Gallery
                    </StyledBoxLink>
                    <StyledBoxLink to="/users">
                        Users
                    </StyledBoxLink>
                    <StyledBoxLink to="/draw" color={navColors.textNavDraw} fontWeight="bold">
                        Draw
                    </StyledBoxLink>
                </NavbarPagesLinks>
                {!userToken.current && <NavbarAuth>
                    <SignUpButton setOpenSignUp={handleOpenSignUp}/>
                    <SignUp open={openSignUp} onHandleClose={handleSignUpClose} onOpenSignIn={handleOpenSignIn}/>
                    <SignInButton setOpenSignIn={handleOpenSignIn}/>
                    <SignIn open={openSignIn} onHandleClose={handleSignInClose} onOpenSignup={handleOpenSignUp}/>
                    <Result 
                        open={result.openResult} 
                        step={result.step} 
                        onHandleClose={handleResultClose} 
                        onOpenSignIn={() => setOpenSignIn(true)} 
                        onOpenSignUp={handleOpenSignUp}
                    />
                </NavbarAuth>}
                {userToken.current &&
                    <NavbarAuth>
                        <Typography variant="body2" sx={{
                            color: navColors.textNav, 
                            fontWeight: "bold",
                        }}>
                            {`Welcome, Andra`}
                        </Typography>
                        <Tooltip title="Account settings">
                            <IconButton
                                onClick={(event) => setAnchorEl(event.currentTarget)}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-haspopup="true"
                                aria-expanded={Boolean(anchorEl)  ? 'true' : undefined}
                            >
                                <Avatar sx={{ width: 32, height: 32, bgcolor: navColors.textNavDraw}}>A</Avatar>
                            </IconButton>
                        </Tooltip>
                        <NavUser
                            anchorEl={anchorEl}
                            onClose={() => {setAnchorEl(null)}}
                        />      
                    </NavbarAuth>
                }
            </>) : (
                <NavMobile 
                    openSignIn={openSignIn} 
                    openSignUp={openSignUp} 
                    onOpenSignIn={handleOpenSignIn}
                    onCloseSignIn={handleSignInClose}
                    onOpenSignUp={handleOpenSignUp}
                    onCloseSignUp={handleSignUpClose}
                    result={result}
                    onResultClose={handleResultClose}
                />
            )}
        </NavbarContainer>
    </NavbarWrapper>)
}