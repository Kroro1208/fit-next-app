"use client"

import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'

interface User {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
}

export default function UserConnections({ params }: { params: { userId: string } }) {
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState("followers")
    const [followers, setFollowers] = useState<User[]>([])
    const [following, setFollowing] = useState<User[]>([])

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab === 'following' || tab === 'followers') {
            setActiveTab(tab)
        }
        // Here you would fetch the actual data
        setFollowers([
            { id: '1', name: 'Alice Smith', username: 'alice', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice' },
            { id: '2', name: 'Bob Johnson', username: 'bob', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bob' },
            // ... more followers
        ])
        setFollowing([
            { id: '3', name: 'Charlie Brown', username: 'charlie', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie' },
            { id: '4', name: 'Diana Prince', username: 'diana', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Diana' },
            // ... more following
        ])
    }, [searchParams])

    const UserList = ({ users }: { users: User[] }) => (
        <div className="space-y-4 mt-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {users.map(user => (
                <Card key={user.id}>
                    <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-500">@{user.username}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            {activeTab === 'followers' ? 'フォローする' : 'フォロー解除'}
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Your Folowing and Followers</h1>
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