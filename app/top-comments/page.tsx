import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from '@/app/lib/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaComments } from 'react-icons/fa';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { unstable_cache } from 'next/cache';
import PostCard from '@/app/components/PostCard';
import type { Post, JsonValue } from '@/types';

export const revalidate = 86400; // 1週間（秒単位）

const getTopCommentedPosts = unstable_cache(
  async (limit: number): Promise<Post[]> => {
    const posts = await prisma.post.findMany({
      take: limit,
      orderBy: {
        comments: {
          _count: 'desc'
        }
      },
      include: {
        User: {
          select: {
            id: true,
            userName: true,
          }
        },
        comments: {
          select: {
            id: true,
          }
        },
        votes: true,
        tags: true,
      },
    });

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      imageString: post.imageString,
      subName: post.subName,
      upVoteCount: post.upVoteCount,
      downVoteCount: post.downVoteCount,
      trustScore: post.trustScore,
      shareLinkVisible: post.shareLinkVisible,
      User: post.User,
      comments: post.comments,
      tags: post.tags,
      textContent: post.textContent as JsonValue,
    }));
  },
  ['top-commented-posts'],
  { revalidate: 86400 } // 1週間（秒単位）
);

export default async function TopCommentsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return <div>認証されていないユーザーです。ログインしてください。</div>;
  }

  const posts = await getTopCommentedPosts(10); // 上位10件を取得

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <FaComments className="text-blue-500" />
            最もコメントが多い記事
          </CardTitle>
          <CardDescription>コメントが最も多い記事のトップ10ランキングです。このリストは1日に1回更新されます。</CardDescription>
        </CardHeader>
      </Card>
      <Alert variant="default" className="mb-6 bg-blue-100 dark:bg-blue-600 dark:text-white items-center">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          これらの記事は、コミュニティでの活発な議論を呼んだ投稿です。詳細ページで議論に参加してみましょう。
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {posts.map((post, index) => (
          <Card key={post.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-200 to-transparent">
                <Badge variant="outline" className="mr-4 text-lg font-bold h-10 w-10 rounded-full flex items-center justify-center">
                  {index + 1}
                </Badge>
                <PostCard
                  id={post.id}
                  title={post.title}
                  subName={post.subName || ''}
                  userName={post.User?.userName || ''}
                  imageString={post.imageString}
                  jsonContent={post.textContent}
                  upVoteCount={post.upVoteCount}
                  downVoteCount={post.downVoteCount}
                  commentAmount={post.comments.length}
                  trustScore={post.trustScore}
                  shareLinkVisible={post.shareLinkVisible}
                  currentUserId={user.id}
                  userId={post.User?.id || ''}
                  tags={post.tags}
                  userVote={null}
                  isBookmarked={false}
                  hideVoteButtons={true}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}