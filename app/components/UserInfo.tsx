import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserCircle, FileText, Bookmark, Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function UserInfoCard() {
  return (
    <Card className="mt-5 overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="absolute -bottom-16 left-4">
          <Image
            src="/placeholder-avatar.png"
            alt="User Avatar"
            width={96}
            height={96}
            className="rounded-full border-4 border-white"
          />
        </div>
      </div>
      <CardContent className="pt-20">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <UserCircle className="w-6 h-6 mr-2 text-blue-500" />
            <div>
              <h2 className="font-bold text-2xl">ユーザー名</h2>
              <p className="text-sm text-muted-foreground">@username</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            編集
          </Button>
        </div>
        
        <div className="flex justify-between mt-6 mb-6">
          <TooltipProvider>
            <div className="text-center">
              <p className="font-bold text-xl">100</p>
              <p className="text-xs text-muted-foreground">投稿</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center cursor-pointer">
                  <p className="font-bold text-xl">1,234</p>
                  <p className="text-xs text-muted-foreground">フォロワー</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>フォロワーを見る</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center cursor-pointer">
                  <p className="font-bold text-xl">567</p>
                  <p className="text-xs text-muted-foreground">フォロー中</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>フォローしている人を見る</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex flex-col gap-y-3">
          <Button variant="outline" className="justify-start">
            <FileText className="w-4 h-4 mr-2" />
            <Link href="/fit/naoya/create">投稿した記事</Link>
          </Button>
          <Button variant="outline" className="justify-start">
            <Bookmark className="w-4 h-4 mr-2" />
            <Link href="/fit/create">保存した記事</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}