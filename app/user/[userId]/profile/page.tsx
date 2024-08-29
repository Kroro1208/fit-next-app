import { getUserInfo, getUserPosts } from '@/app/actions'
import PostCard from '@/app/components/PostCard'
import UserInfoCard from '@/app/components/UserInfo'
import UserProfile from '@/app/components/UserProfile'
import type { Post } from '@/types'

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const userInfo = await getUserInfo(params.userId)
  const userPosts = await getUserPosts(params.userId)

  if (!userInfo) {
    return <div>ユーザーが見つかりません</div>
  }

  return (
    <div className="container mx-auto px-4">
      <UserProfile userId={params.userId} />
      <h2 className="text-2xl font-bold mt-8 mb-4">投稿一覧</h2>
      <div className="space-y-4">
        {userPosts.map((post: Post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            subName={post.subName || ''}
            userName={userInfo.userName}
            imageString={post.imageString}
            jsonContent={post.textContent}
            upVoteCount={post.upVoteCount}
            downVoteCount={post.downVoteCount}
            commentAmount={post.comments.length}
            trustScore={post.trustScore}
            shareLinkVisible={post.shareLinkVisible}
            currentUserId={params.userId}
            userId={post.User?.id}
            tags={post.tags}
            userVote={null}
            isBookmarked={false}
          />
        ))}
      </div>
    </div>
  )
}