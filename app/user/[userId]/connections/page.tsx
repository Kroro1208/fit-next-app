"use client"

import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'
import { followUser } from '@/app/actions'
import { toast } from "@/components/ui/use-toast"

interface User {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    imageUrl: string | null;
    isFollowing: boolean;
}

export default function UserConnections({ params }: { params: { userId: string } }) {
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState("followers")
    const [followers, setFollowers] = useState<User[]>([])
    const [following, setFollowing] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab === 'following' || tab === 'followers') {
            setActiveTab(tab)
        }

        const fetchConnections = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/user/${params.userId}/connections`)
                if (!response.ok) {
                    throw new Error('Failed to fetch connections')
                }
                const data = await response.json()
                setFollowers(data.followers.map((user: User) => ({ ...user, isFollowing: false })))
                setFollowing(data.following.map((user: User) => ({ ...user, isFollowing: true })))
            } catch (error) {
                console.error('Error fetching connections:', error)
                toast({
                    title: "エラー",
                    description: "接続情報の取得に失敗しました",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchConnections()
    }, [searchParams, params.userId])

    const handleFollow = async (userId: string) => {
        try {
            const result = await followUser(userId)
            if (result.action === "follow") {
                updateUserFollowStatus(userId, true)
                toast({
                    title: "成功",
                    description: "フォローしました",
                })
            } else {
                updateUserFollowStatus(userId, false)
                toast({
                    title: "成功",
                    description: "フォロー解除しました",
                })
            }
        } catch (error) {
            console.error("Failed to follow/unfollow:", error)
            toast({
                title: "エラー",
                description: "フォロー/フォロー解除に失敗しました",
                variant: "destructive",
            })
        }
    }

    const updateUserFollowStatus = (userId: string, isFollowing: boolean) => {
        setFollowers(prev => prev.map(user => 
            user.id === userId ? { ...user, isFollowing } : user
        ))
        setFollowing(prev => prev.map(user => 
            user.id === userId ? { ...user, isFollowing } : user
        ))
    }

    const UserList = ({ users }: { users: User[] }) => (
        <div className="space-y-4 mt-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {users.map(user => (
                <Card key={user.id}>
                    <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={user.imageUrl || undefined} alt={`${user.firstName} ${user.lastName}`} />
                                <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-gray-500">@{user.userName}</p>
                            </div>
                        </div>
                        <Button 
                            variant={user.isFollowing ? "outline" : "default"} 
                            size="sm"
                            onClick={() => handleFollow(user.id)}
                        >
                            {user.isFollowing ? 'フォロー解除' : 'フォローする'}
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Your Following and Followers</h1>
                </div>
            </div>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="followers">フォロワー</TabsTrigger>
                            <TabsTrigger value="following">フォロー中</TabsTrigger>
                        </TabsList>
                        <TabsContent value="followers">
                            <UserList users={followers} />
                        </TabsContent>
                        <TabsContent value="following">
                            <UserList users={following} />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}