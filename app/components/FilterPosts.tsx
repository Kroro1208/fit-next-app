'use client';
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import PostCard from './PostCard'
import { getFilteredPosts } from '@/app/actions'
import type { Post, Tag, TipTapContent } from '@/types'
import type { Prisma } from '@prisma/client'

const FilterablePosts = ({ initialPosts, tags, currentUserId }: { initialPosts: Post[], tags: Tag[], currentUserId?: string }) => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const handleTagClick = async (tagId: string) => {
        if (activeTag === tagId) {
            setActiveTag(null);
            const newPosts = await getFilteredPosts();
            setPosts(newPosts as Post[]);
        } else {
            setActiveTag(tagId);
            const newPosts = await getFilteredPosts(tagId);
            setPosts(newPosts as Post[]);
        }
    };

    return (
    <div>
        <div className="mb-4 space-x-2">
        {tags.map(tag => (
            <Badge
            key={tag.id}
            variant={activeTag === tag.id ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleTagClick(tag.id)}
            >
            {tag.name}
            </Badge>
        ))}
        </div>
        <div className="space-y-4">
        {posts.map(post => (
            <PostCard
                key={post.id}
                id={post.id}
                imageString={post.imageString}
                jsonContent={post.textContent as Prisma.JsonValue | TipTapContent}
                subName={post.subName || ''}
                title={post.title}
                userName={post.User?.userName || ''}
                commentAmount={post.comments.length}
                upVoteCount={post.upVoteCount}
                downVoteCount={post.downVoteCount}
                trustScore={post.trustScore}
                shareLinkVisible={post.shareLinkVisible}
                currentUserId={currentUserId}
                userId={post.User?.id}
                tags={post.tags}
                isClientSide={true}
                userVote={null}
            />
        ))}
        </div>
    </div>
    );
};

export default FilterablePosts;