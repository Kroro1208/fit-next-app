'use client';
import { useCallback, useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import PostCard from './PostCard'
import { getFilteredPosts } from '@/app/actions'
import type { Post, Tag, TipTapContent } from '@/types'
import type { Prisma } from '@prisma/client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearch } from '../context/SearchContext';

interface FilterablePostsProps {
    initialPosts: Post[]
    tags: Tag[]
    currentUserId?: string
}

const FilterablePosts: React.FC<FilterablePostsProps> = ({ initialPosts, tags, currentUserId }) => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { searchQuery } = useSearch();


    const fetchPosts = useCallback(async (tagId?: string, query?: string) => {
        const filteredPosts = await getFilteredPosts(tagId, query);
        setPosts(filteredPosts);
    }, []);

    useEffect(() => {
        const tagId = searchParams.get('tag') || undefined;
        setActiveTag(tagId || null);
        fetchPosts(tagId, searchQuery);
    }, [searchParams, searchQuery, fetchPosts]);

    const handleTagClick = async (tagId: string) => {
        const newActiveTag = activeTag === tagId ? null : tagId;
        setActiveTag(newActiveTag);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        if (newActiveTag) {
            newSearchParams.set('tag', newActiveTag);
        } else {
            newSearchParams.delete('tag');
        }
        router.push(`?${newSearchParams.toString()}`, {scroll: false});
        fetchPosts(newActiveTag || undefined, searchParams.get('search') || undefined);
    };

    return (
        <div>
            <div className="mb-4 space-x-2">
                {tags.map(tag => (
                    <Badge
                        key={tag.id}
                        variant={activeTag === tag.id ? "default" : "outline"}
                        className="cursor-pointer ring-2 ring-gray-300 hover:ring-green-500 transition-all"
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
                        isBookmarked={false}
                    />
                ))}
            </div>
        </div>
    );
};

export default FilterablePosts;