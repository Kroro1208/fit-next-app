import Image from "next/image"
import Link from "next/link"
import logo from "../../public/fitness.gif"
import { ThemeToggle } from "./ThemeToggle"

const Navbar = () => {
    return (
        <nav className="h-[120px] w-full flex items-center justify-between border-b px-5 lg:px-14">
            <Link href="/" className="flex items-center gap-x-3"> 
                <Image src={logo} alt="desktop-text" className="h-24 p-1 mt-3 w-fit hidden lg:block" />
            </Link>
            <ThemeToggle />
        </nav>
    )
}

export default Navbar
