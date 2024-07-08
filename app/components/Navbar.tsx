import Image from "next/image"
import Link from "next/link"
import logo from "../../public/fitness.gif"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "@/components/ui/button"

const Navbar = () => {
    return (
        <nav className="h-[120px] w-full flex items-center justify-between border-b px-5 lg:px-14">
            <Link href="/" className="flex items-center gap-x-3"> 
                <Image src={logo} alt="desktop-text" className="h-24 p-1 mt-3 w-fit hidden lg:block" />
            </Link>
            <div className="flex items-center gap-x-4">
                <ThemeToggle />
                <Button variant='secondary'>登録</Button>
                <Button>ログイン</Button>
            </div>
        </nav>
    )
}

export default Navbar
