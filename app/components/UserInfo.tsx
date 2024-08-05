"use client"
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserCircle, FileText, Bookmark, Settings, MessageSquare, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserInfo, followUser } from "../actions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserInfoCard({ userId }: { userId: string }) {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const info = await getUserInfo(userId);
                setUserInfo(info);
                // ここでフォロー状態も取得する必要があります
                // 例: const followStatus = await getFollowStatus(userId);
                // setIsFollowing(followStatus.isFollowing);
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [userId]);

    const handleFollow = async () => {
        try {
            const result = await followUser(userId);
            if (result.action === "follow") {
                setIsFollowing(true);
                setUserInfo((prev: { followerCount: number; }) => ({ ...prev, followerCount: prev.followerCount + 1 }));
            } else {
                setIsFollowing(false);
                setUserInfo((prev: { followerCount: number; }) => ({ ...prev, followerCount: prev.followerCount - 1 }));
            }
        } catch (error) {
            console.error("Failed to follow/unfollow:", error);
            // ユーザーにエラーを通知するロジックを追加
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!userInfo) {
        return <div>User not found</div>;
    }

    return (
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
                        <div>
                            <h2 className="font-bold text-2xl">{userInfo.userName}</h2>
                            <p className="text-sm text-muted-foreground">@{userInfo.userName?.toLowerCase().replace(/\s+/g, '')}</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push('/settings')}>
                        <Settings className="w-4 h-4 mr-2" />
                        編集
                    </Button>
                </div>
                
                <div className="flex justify-between mt-6 mb-6">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="text-center cursor-pointer" onClick={() => router.push(`/user/${userId}/posts`)}>
                                    <p className="font-bold text-xl">{userInfo.postCount}</p>
                                    <p className="text-xs text-muted-foreground">投稿</p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>投稿した記事を見る</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="text-center cursor-pointer" onClick={() => router.push(`/user/${userId}/comments`)}>
                                    <p className="font-bold text-xl">{userInfo.commentCount}</p>
                                    <p className="text-xs text-muted-foreground">コメント</p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>コメントを見る</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="text-center cursor-pointer" onClick={() => router.push(`/user/${userId}/followers`)}>
                                    <p className="font-bold text-xl">{userInfo.followerCount}</p>
                                    <p className="text-xs text-muted-foreground">フォロワー</p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>フォロワーを見る</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="text-center cursor-pointer" onClick={() => router.push(`/user/${userId}/following`)}>
                                    <p className="font-bold text-xl">{userInfo.followingCount}</p>
                                    <p className="text-xs text-muted-foreground">フォロー中</p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>フォロー中のユーザーを見る</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                
                <div className="flex flex-col gap-y-3">
                    <Button variant="outline" className="justify-start" onClick={() => router.push(`/user/${userId}/posts`)}>
                        <FileText className="w-4 h-4 mr-2" />
                        投稿した記事
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => router.push(`/user/${userId}/comments`)}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        コメント
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => router.push(`/user/${userId}/saved`)}>
                        <Bookmark className="w-4 h-4 mr-2" />
                        保存した記事
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => router.push(`/user/${userId}/connections`)}>
                        <Users className="w-4 h-4 mr-2" />
                        フォロー/フォロワー
                    </Button>
                    <Button 
                        variant={isFollowing ? "outline" : "default"} 
                        onClick={handleFollow}
                    >
                        {isFollowing ? "フォロー解除" : "フォローする"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}