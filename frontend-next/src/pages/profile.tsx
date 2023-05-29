import { getUserInfo } from "@/components/common/helpers";
import { Profile } from "@/components/profile/Profile";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { useEffect, useState } from "react";

function ProfilePage() {
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        const userInfo = getUserInfo();
        const userId = (userInfo && userInfo?.id) ?? "";
        setUserId(userId);
    }, []);

    return <Profile> 
        <ProfileInfo userId={userId}/>
    </Profile>
}

export default ProfilePage;