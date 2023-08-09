import { getUserInfo, isUserLoggedIn } from "@/components/common/helpers";
import { Profile } from "@/components/profile/Profile";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function ProfilePage() {
    const [userId, setUserId] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const userInfo = getUserInfo();
        const userId = (userInfo && userInfo?.id) ?? "";
        setUserId(userId);

        if (userId == '') {
            router.push('/');
        }
    }, []);

    return <Profile> 
        <ProfileInfo userId={userId}/>
    </Profile>
}

export default ProfilePage;