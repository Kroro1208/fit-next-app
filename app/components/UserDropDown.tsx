import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import user from "../../public/user.png";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface Props {
    userImage: string | null;
}

const UserDropDown = ({ userImage }: Props) => {
    return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
                <MenuIcon className="w-6 h-6 lg:w-5 lg:h-5"/>
            <Image src={userImage ?? user}
            alt="avatar of user"
            width={10}
            height={10}
            className="rounded-full h-8 w-8 hidden lg:block" /> 
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem>
                <Link href="/fit/create">コミュニティをつくる</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Link href="/fit/naoy/create">投稿作成</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Link href="/settings">設定</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <LogoutLink className="w-full">ログアウト</LogoutLink>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    )
}

export default UserDropDown
