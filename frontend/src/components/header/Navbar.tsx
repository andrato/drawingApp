import { 
    Box, 
    Typography, 
    Button, 
    BoxProps, 
} from "@mui/material";
import {
    navColors,
    navSizes, 
} from "./constants";
import Logo from "../../assets/logo.png";
import { useMatch, useResolvedPath } from "react-router";
import { NavLink, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { SignUp } from "../user/SignUp";
import { SignIn } from "../user/SignIn";
import { Result } from "../user/Result";
import { Step } from "../user/utils";

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
    const resolvePath = useResolvedPath(to);
    const isActive = useMatch({path:resolvePath.pathname, end:true});

    return (
    <NavLink to={to} style={{
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
    </NavLink>)
}

const NavbarWrapper = ({children, props} : {children: React.ReactNode, props?: BoxProps}) => {
    const resolvePath = useResolvedPath('/draw');
    const isActive = useMatch({path:resolvePath.pathname, end:true});

    return (<Box 
        {...props}
        sx={{
            height: `${navSizes.navHeight}px`,
            width: "100%",
            backgroundColor: `${navColors.navBackground}`,
            borderBottom: isActive ? "0px" : `0.5px solid ${navColors.textNav}`,
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

const NavbarSignInOut = ({children, props} : {children: React.ReactNode, props?: BoxProps}) => (
    <Box 
        {...props}
        sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
        }}
    >
        {children}
    </Box>
)

export function Navbar() {
    const navigate = useNavigate();
    const [openSignIn, setOpenSignIn] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);
    const [result, setResult] = useState<{openResult: boolean, step: Step | null}>({openResult: false, step: null});

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
                <img className="image-img" src={Logo} height="50" style={{marginRight: "80px", marginTop: "5px"}}/>
            </a>
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
            <NavbarSignInOut>
                <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => setOpenSignUp(true)}
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
                    }}
                >
                    Sign up
                </Button>
                <SignUp open={openSignUp} onHandleClose={handleSignUpClose} onOpenSignIn={handleOpenSignIn}/>
                <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => setOpenSignIn(true)}
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
                    }}
                >
                    Sign in
                </Button>
                <SignIn open={openSignIn} onOpenSignup={handleOpenSignUp} onHandleClose={handleSignInClose}/>
                <Result 
                    open={result.openResult} 
                    step={result.step} 
                    onHandleClose={handleResultClose} 
                    onOpenSignIn={() => setOpenSignIn(true)} 
                    onOpenSignUp={handleOpenSignUp}
                />
            </NavbarSignInOut>
        </NavbarContainer>
    </NavbarWrapper>)
}