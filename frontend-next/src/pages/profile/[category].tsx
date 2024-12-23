import { getUserInfo, isUserLoggedIn } from "@/components/common/helpers";
import { AllDrawings } from "@/components/profile/AllDrawings";
import { AllUsers } from "@/components/profile/AllUsers";
import { Profile } from "@/components/profile/Profile";
import { ProfileDrawings } from "@/components/profile/ProfileDrawings";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

export default function ProfileCategory() {
    const router = useRouter();
    const slug = router.query.category;
    let component: ReactNode;
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        const userInfo = getUserInfo();
        const userId = (userInfo && userInfo?.id) ?? "";
        setUserId(userId);

        if (userId == '') {
            router.push('/');
        }
    }, []);

    switch(slug) {
        case 'info': {
            component = <ProfileInfo userId={userId}/>;
            break;
        }
        case 'myDrawings': {
            component = <ProfileDrawings userId={userId}/>;
            break;
        }
        case 'allUsers': {
            component = <AllUsers userId={userId}/>;
            break;
        }
        case 'allDrawings': {
            component = <AllDrawings userId={userId}/>;
            break;
        }
    }

    return <Profile>
        {component}
    </Profile>;
}