import Image from "next/image"
import Link from "next/link"
import logo from "../../public/banner3.png"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "@/components/ui/button"
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import UserDropDown from "./UserDropDown"
import prisma from "../lib/db"
import NotificationBell from "./NotificationBell"
import { TrendingUp, Award, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"

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
        <nav className="h-[100px] w-full flex items-center justify-between border-b px-5 lg:px-14 bg-gradient-to-r from-green-600 to-green-500 shadow-md">
            <div className="flex items-center gap-x-8">
                <Link href="/" className="flex items-center gap-x-3"> 
                    <Image src={logo} alt="desktop-text" className="h-[75px] w-auto hidden lg:block rounded-lg shadow-lg transition-transform duration-300 hover:scale-105" />
                </Link>
                <div className="relative hidden md:block">
                    <Input 
                        type="text" 
                        placeholder="投稿を検索..." 
                        className="pl-10 pr-4 py-2 rounded-full w-64 focus:w-80 transition-all duration-300"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>
            <div className="flex items-center gap-x-4">
                <Link href="#" passHref legacyBehavior>
                    <Button variant="ghost" className="flex items-center gap-2 rounded-full text-white hover:bg-green-700 hover:text-white dark:hover:text-white transition-colors duration-300">
                        <TrendingUp size={18} />
                        <span className="hidden sm:inline">高評価ランキング</span>
                    </Button>
                </Link>
                <Link href="#" passHref legacyBehavior>
                    <Button variant="ghost" className="flex items-center gap-2 rounded-full text-white hover:bg-green-700 hover:text-white dark:hover:text-white transition-colors duration-300">
                        <Award size={18} />
                        <span className="hidden sm:inline">優良ユーザーランキング</span>
                    </Button>
                </Link>
                {user && (
                    <NotificationBell initialCount={unreadNotificationCount}/>
                )}
                <ThemeToggle />
                { user ? (
                    <UserDropDown userImage={user.picture}/>
                ) : (
                    <div className="flex items-center gap-x-2">
                        <Button variant='outline' size="sm" asChild className="rounded-full">
                            <RegisterLink>登録</RegisterLink>
                        </Button>
                        <Button size="sm" asChild className="rounded-full">
                            <LoginLink>ログイン</LoginLink>
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar