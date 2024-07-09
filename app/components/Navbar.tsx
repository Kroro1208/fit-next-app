import Image from "next/image"
import Link from "next/link"
import logo from "../../public/fitness.gif"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "@/components/ui/button"
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"


const Navbar = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    return (
        <nav className="h-[120px] w-full flex items-center justify-between border-b px-5 lg:px-14">
            <Link href="/" className="flex items-center gap-x-3"> 
                <Image src={logo} alt="desktop-text" className="h-24 p-1 mt-3 w-fit hidden lg:block" />
            </Link>
            <div className="flex items-center gap-x-4">
                <ThemeToggle />
                { user ? (
                    <Button>ログアウト</Button>
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
