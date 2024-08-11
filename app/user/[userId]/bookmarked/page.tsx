import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import PostCard from '@/app/components/PostCard';
import { getBookmarkedPosts } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { BsBookmarkFill } from 'react-icons/bs';
import { ScrollArea } from '@/components/ui/scroll-area';


export default async function BookmarksPage() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
    return (
        <Alert variant="destructive">
        <AlertTitle>認証エラー</AlertTitle>
        <AlertDescription>
            ブックマークを表示するにはログインが必要です。
        </AlertDescription>
        </Alert>
    );
    }

    const bookmarkedPosts = await getBookmarkedPosts(user.id);

    return (
        <Card className="w-full max-w-4xl mx-auto mt-8">
            <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                <BsBookmarkFill className="text-blue-500" />
                <span>あなたが保存した投稿一覧</span>
            </CardTitle>
            </CardHeader>
            <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                {bookmarkedPosts.length === 0 ? (
                <Alert>
                    <AlertTitle>ブックマークがありません</AlertTitle>
                    <AlertDescription>
                    まだ投稿をブックマークしていません。興味のある投稿を見つけてブックマークしてみましょう！
                    </AlertDescription>
                </Alert>
                ) : (
                <div className="space-y-4">
                    {bookmarkedPosts.map((post) => (
                    <PostCard 
                        key={post.id}
                        {...post}
                        currentUserId={user.id}
                        subName={post.subName || ""}  // nullの場合は空文字列を使用
                        userId={post.userId || ""} 
                    />
                    ))}
                </div>
                )}
            </ScrollArea>
            </CardContent>
        </Card>
    );
}

export function BookmarksPageSkeleton() {
    return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardHeader>
        <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent>
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Skeleton key={i} className="h-40 w-full" />
            ))}
        </div>
        </CardContent>
    </Card>
    );
}