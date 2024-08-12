import React from 'react';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from '@/app/lib/db';
import PostCard from '@/app/components/PostCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { isBookmarked } from '@/app/actions';
import { unstable_noStore } from 'next/cache';
import PaginationWrapper from '../components/ PginationWrapper';
import { Badge } from '@/components/ui/badge';
import { FaTrophy, FaMedal } from 'react-icons/fa';

export const metadata = {
  title: '優良記事ランキング | YourSiteName',
  description: '最も高評価を得た記事のランキングをご覧いただけます。',
};

async function getTopPosts(userId: string | null, page = '1', pageSize = '10') {
  unstable_noStore();
  const pageNum = Number.parseInt(page, 10);
  const pageSizeNum = Number.parseInt(pageSize, 10);
  const skip = (pageNum - 1) * pageSizeNum;
  
  const posts = await prisma.post.findMany({
    take: pageSizeNum,
    skip: skip,
    orderBy: {
      trustScore: 'desc',
    },
    include: {
      User: true,
      Community: true,
      comments: {
        select: {
          id: true,
        },
      },
      votes: true,
      tags: true,
    },
  });

  const total = await prisma.post.count();

  const bookmarkedPosts = userId ? await Promise.all(
    posts.map(async (post) => ({
      ...post,
      isBookmarked: await isBookmarked(post.id, userId)
    }))
  ) : posts.map(post => ({ ...post, isBookmarked: false }));

  return { posts: bookmarkedPosts, total };
}

export default async function TopPostsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = searchParams.page || '1';
  const pageSize = '10';
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const { posts, total } = await getTopPosts(user?.id || null, page, pageSize);

  const totalPages = Math.ceil(total / Number.parseInt(pageSize, 10));

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            優良記事ランキング
          </CardTitle>
          <CardDescription>最も高評価を得た記事のトップ10ランキングです。</CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {posts.map((post, index) => {
          const upVoteCount = post.votes.filter(vote => vote.voteType === "UP").length;
          const downVoteCount = post.votes.filter(vote => vote.voteType === "DOWN").length;
          const totalVotes = upVoteCount + downVoteCount;
          const trustScore = totalVotes > 0 ? (upVoteCount / totalVotes) * 100 : 50;

          return (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-4 bg-gradient-to-r from-sky-500/30 to-transparent">
                  {index < 3 ? (
                    <div className="mr-4">
                      {index === 0 && <FaTrophy className="text-4xl text-yellow-500" />}
                      {index === 1 && <FaMedal className="text-4xl text-gray-400" />}
                      {index === 2 && <FaMedal className="text-4xl text-amber-600" />}
                    </div>
                  ) : (
                    <Badge variant="outline" className="mr-4 text-lg font-bold h-10 w-10 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                  )}
                  <PostCard
                    id={post.id}
                    title={post.title}
                    subName={post.Community?.name || ''}
                    userName={post.User?.userName || ''}
                    imageString={post.imageString || null}
                    jsonContent={post.textContent}
                    upVoteCount={upVoteCount}
                    downVoteCount={downVoteCount}
                    commentAmount={post.comments.length}
                    trustScore={trustScore}
                    shareLinkVisible={totalVotes >= 50}
                    currentUserId={user?.id}
                    userId={post.userId || ''}
                    tags={post.tags}
                    userVote={post.votes.find(vote => vote.userId === user?.id)?.voteType || null}
                    isBookmarked={post.isBookmarked}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6">
        <PaginationWrapper totalPages={totalPages} />
      </div>
    </div>
  );
}