"use client"
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserCircle, FileText, Bookmark, Settings, MessageSquare, Users, X, User2Icon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserInfo, followUser } from "../actions";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Toast, ToastProvider, ToastViewport } from "@radix-ui/react-toast";

interface UserInfo {
  id: string;
  userName: string;
  imageUrl: string | null;
  postCount: number;
  commentCount: number;
  followerCount: number;
  followingCount: number;
}

export default function UserInfoCard({ userId }: { userId: string }) {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const info = await getUserInfo(userId);
                setUserInfo(info);
            } catch (error) {
                console.error("Failed to fetch user info:", error);
                setToastMessage("ユーザー情報の取得に失敗しました");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [userId]);

    const handleFollow = async () => {
        if (!userInfo) return;

        if (userInfo.id === userId) {
            setToastMessage("自分自身はフォローできません");
            return;
        }

        try {
            const result = await followUser(userId);
            if (result.action === "follow") {
                setIsFollowing(true);
                setUserInfo(prev => prev ? {...prev, followerCount: prev.followerCount + 1} : null);
                setToastMessage("フォローしました");
            } else {
                setIsFollowing(false);
                setUserInfo(prev => prev ? {...prev, followerCount: prev.followerCount - 1} : null);
                setToastMessage("フォロー解除しました");
            }
        } catch (error) {
            console.error("Failed to follow/unfollow:", error);
            setToastMessage("フォロー/フォロー解除に失敗しました");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!userInfo) {
        return <div>User not found</div>;
    }

    return (
        <ToastProvider swipeDirection="right">
            <Card className="mt-5 overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500">
                    <div className="absolute -bottom-16 left-4">
                        <Image
                            src={userInfo.imageUrl || "/placeholder-avatar.png"}
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
                            <Link href={`/user/${userId}/posts`}>
                                <div className="cursor-pointer">
                                    <h2 className="font-bold text-2xl">{userInfo.userName}</h2>
                                    <p className="text-sm text-muted-foreground">@{userInfo.userName.toLowerCase().replace(/\s+/g, '')}</p>
                                </div>
                            </Link>
                        </div>
                        <Link href='/settings' passHref legacyBehavior>
                            <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4 mr-2" />
                                編集
                            </Button>
                        </Link>
                    </div>
                    
                    <div className="flex justify-between mt-6 mb-6">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/user/${userId}/posts`}>
                                        <div className="text-center cursor-pointer">
                                            <p className="font-bold text-xl">{userInfo.postCount}</p>
                                            <p className="text-xs text-muted-foreground">投稿</p>
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>投稿した記事を見る</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/user/${userId}/comments`}>
                                        <div className="text-center cursor-pointer">
                                            <p className="font-bold text-xl">{userInfo.commentCount}</p>
                                            <p className="text-xs text-muted-foreground">コメント</p>
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>コメントを見る</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/user/${userId}/connections/?tab=followers`}>
                                        <div className="text-center cursor-pointer">
                                            <p className="font-bold text-xl">{userInfo.followerCount}</p>
                                            <p className="text-xs text-muted-foreground">フォロワー</p>
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>フォロワーを見る</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/user/${userId}/connections/?tab=following`}>
                                        <div className="text-center cursor-pointer">
                                            <p className="font-bold text-xl">{userInfo.followingCount}</p>
                                            <p className="text-xs text-muted-foreground">フォロー中</p>
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>フォロー中のユーザーを見る</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    
                    <div className="flex flex-col gap-y-3">
                        <Link href={`/user/${userId}/posts`} passHref legacyBehavior>
                            <Button variant="outline" className="justify-start">
                                <FileText className="w-4 h-4 mr-2" />
                                投稿した記事
                            </Button>
                        </Link>
                        <Link href={`/user/${userId}/communities`} passHref legacyBehavior>
                            <Button variant="outline" className="justify-start">
                                <User2Icon className="w-4 h-4 mr-2" />
                                コミュニティ一覧
                            </Button>
                        </Link>
                        <Link href={`/user/${userId}/comments`} passHref legacyBehavior>
                            <Button variant="outline" className="justify-start">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                コメント
                            </Button>
                        </Link>
                        <Link href={`/user/${userId}/bookmarked`} passHref legacyBehavior>
                            <Button variant="outline" className="justify-start">
                                <Bookmark className="w-4 h-4 mr-2" />
                                保存した記事
                            </Button>
                        </Link>
                        <Button 
                            variant={isFollowing ? "outline" : "default"} 
                            onClick={handleFollow}
                        >
                            {isFollowing ? "フォロー解除" : "フォローする"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Toast open={!!toastMessage} onOpenChange={() => setToastMessage("")}>
                <div className="bg-yellow-200 border border-gray-200 rounded-md shadow-lg p-4 flex justify-between items-center">
                    <span>{toastMessage}</span>
                    <button
                        type="button"
                        onClick={() => setToastMessage("")}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={16} />
                    </button>
                </div>
            </Toast>
            <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-[100vw] m-0 list-none z-50 outline-none" />
        </ToastProvider>
    );
}