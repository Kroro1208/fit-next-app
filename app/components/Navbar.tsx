import Image from "next/image"
import Link from "next/link"
import logo from "../../public/banner2.png"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "@/components/ui/button"
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import UserDropDown from "./UserDropDown"
import prisma from "../lib/db"
import NotificationBell from "./NotificationBell"


const Navbar = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    let unreadNotificationCount = 0;
    if(user) {
        unreadNotificationCount = await prisma.notification.count({
            where: {
                userId: user.id,
                read: false
            }
        })
    }

    return (
        <nav className="h-[120px] w-full flex items-center justify-between border-b px-5 lg:px-14 bg-green-600">
            <Link href="/" className="flex items-center gap-x-3"> 
                <Image src={logo} alt="desktop-text" className="h-28 p-1 w-[550px] hidden lg:block rounded-xl" />
            </Link>
            <div className="flex items-center gap-x-4">
                {
                    user && (
                        <NotificationBell initialCount={unreadNotificationCount}/>
                    )
                }
                <ThemeToggle />
                { user ? (
                    <UserDropDown userImage={user.picture}/>
                    // <Button>ログアウト</Button>
                ) : (
                    <div className="flex items-center gap-x-4">
                        <Button variant='secondary' asChild>
                            <RegisterLink>登録</RegisterLink>
                        </Button>
                        <Button asChild>
                            <LoginLink>ログイン</LoginLink>
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
