import { Box, Divider, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { getUserInfo } from "../common/helpers";

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
            width: "100%",
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

export const ProfileNav = () => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        const userInfo = getUserInfo();
        const isAdminAux = Boolean(userInfo && userInfo?.isAdmin);
        setIsAdmin(isAdminAux);
    }, []);

    return <Box sx={(theme) => ({
        height: "calc(100% - 16px)",
        width: "212px",
        bgcolor: theme.palette.backgroundCustom.dark,
        py: 1,
        display: "flex",
        flexDirection: "column",
    })}>
        <StyledLink to="/profile/info">
            Profile information
        </StyledLink>
        <StyledLink to="/profile/myDrawings">
            My drawings
        </StyledLink>
        {/* <StyledLink to="/profile/inProgress">
            Drawings in progress
        </StyledLink> */}
        {isAdmin && (
            <>
                <Divider sx={(theme) => ({backgroundColor: theme.palette.textCustom.primary, my: 1})}/>
                <StyledLink to="/profile/allUsers">
                    All users
                </StyledLink>
                <StyledLink to="/profile/allDrawings">
                    All drawings
                </StyledLink>
                {/* <StyledLink to="/profile/reported">
                    Reported users
                </StyledLink> */}
            </>
        )}
    </Box>
}