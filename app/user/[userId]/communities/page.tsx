"use client";
import { getUserCommunities } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Communty {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    postCount: number;
}

const UserCommuntyPage = ({params}: {params: {userId: string}}) => {
    const [communities, setCommunities] = useState<Communty[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCommunities() {
            setIsLoading(true);
            try {
                const fetchedCommunities = await getUserCommunities(params.userId);
                setCommunities(fetchedCommunities);
            } catch (err) {
                console.error('コミュニティーの取得に失敗しました');
            } finally {
                setIsLoading(false);
            };
        }
        fetchCommunities();
    }, [params.userId])

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">マイコミュニティ</h1>
                    <Link href="/fit/create" passHref>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> 新規作成
                        </Button>
                    </Link>
                </div>
            </div>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {communities.length === 0 ? (
                        <div className="text-center">
                            <p className="mt-4 text-gray-500">コミュニティがありません。新しく作成してみましょう！</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {communities.map(community => (
                                <Card key={community.id}>
                                    <CardHeader>
                                        <CardTitle className="text-xl">
                                            <Link href={`/fit/${community.name}`} className="hover:underline">
                                                {community.name}
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-500 mb-2">{community.description || "説明なし"}</p>
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>投稿数: {community.postCount}</span>
                                            <span>作成日: {new Date(community.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default UserCommuntyPage
