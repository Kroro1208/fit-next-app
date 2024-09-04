"use client"
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Settings, MessageSquare, X, User2Icon } from "lucide-react";
import { getUserInfo, followUser } from "../actions";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Toast, ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import SuspenseCard from "./SuspenseCard";

interface UserProfile {
  id: string;
  userName: string;
  imageUrl: string | null;
  postCount: number;
  commentCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export default function UserProfile({ userId, currentUserId }: { userId: string, currentUserId: string }) {
    const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
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

        if (currentUserId === userId) {
            setToastMessage("自分自身はフォローできません");
            return;
        }

        try {
            const result = await followUser(userId);
            if (result.action === "follow") {
                setUserInfo(prev => prev ? {...prev, followerCount: prev.followerCount + 1} : null);
                setToastMessage("フォローしました");
            } else {
                setUserInfo(prev => prev ? {...prev, followerCount: prev.followerCount - 1} : null);
                setToastMessage("フォロー解除しました");
            }
        } catch (error) {
            console.error("Failed to follow/unfollow:", error);
            setToastMessage("フォロー/フォロー解除に失敗しました");
        }
    };

    if (isLoading) {
        return <SuspenseCard />;
    }

    if (!userInfo) {
        return <div>User not found</div>;
    }

    return (
        <ToastProvider swipeDirection="right">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="relative h-64 bg-gradient-to-r from-blue-400 to-purple-500">
                        <div className="absolute -bottom-20 left-10">
                            <Image
                                src={userInfo.imageUrl || "/placeholder-avatar.png"}
                                alt="User Avatar"
                                width={150}
                                height={150}
                                className="rounded-full border-4 border-white shadow-md"
                            />
                        </div>
                    </div>
                    <CardContent className="pt-24 px-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">{userInfo.userName}</h2>
                                <p className="text-gray-600">@{userInfo.userName.toLowerCase().replace(/\s+/g, '')}</p>
                            </div>
                            <Button 
                                variant={userInfo.isFollowing ? "outline" : "default"}
                                onClick={handleFollow}
                                className="px-6 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                {userInfo.isFollowing ? "フォロー解除" : "フォローする"}
                            </Button>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-8">
                            <StatItem label="投稿" value={userInfo.postCount} href={`/user/${userId}/posts`} />
                            <StatItem label="コメント" value={userInfo.commentCount} href={`/user/${userId}/comments`} />
                            <StatItem label="フォロワー" value={userInfo.followerCount} href={`/user/${userId}/connections/?tab=followers`} />
                            <StatItem label="フォロー中" value={userInfo.followingCount} href={`/user/${userId}/connections/?tab=following`} />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <ActionButton icon={<User2Icon />} label="コミュニティ一覧" href={`/user/${userId}/communities`} />
                            <ActionButton icon={<MessageSquare />} label="コメント" href={`/user/${userId}/comments`} />
                            <ActionButton icon={<Settings />} label="設定" href="/settings" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Toast open={!!toastMessage} onOpenChange={() => setToastMessage("")}>
                <div className="bg-white border border-gray-200 rounded-md shadow-lg p-4 flex justify-between items-center">
                    <span className="text-gray-800">{toastMessage}</span>
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

function StatItem({ label, value, href }: { label: string; value: number; href: string }) {
    return (
        <Link href={href} className="text-center p-2 rounded-lg hover:bg-gray-100 transition duration-300">
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
        </Link>
    );
}

function ActionButton({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
    return (
        <Link href={href} passHref>
            <Button variant="outline" className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition duration-300">
                {icon}
                <span>{label}</span>
            </Button>
        </Link>
    );
}