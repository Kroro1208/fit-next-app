'use client'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import PostCard from './PostCard'
import { getFilteredPosts } from '@/app/actions'

interface Tag {
    id: string;
    name: string;
}

interface Post {
    id: string;
    title: string;
    imageString: string | null;
    subName: string | null;
    upVoteCount: number;
    downVoteCount: number;
    trustScore: number;
    shareLinkVisible: boolean;
    User: { id: string; userName: string | null } | null;
    comments: { id: string }[];
    tags: Tag[];
    textContent: any;
}

const FilterablePosts = ({ initialPosts, tags, currentUserId }: { initialPosts: Post[], tags: Tag[], currentUserId?: string }) => {
    const [posts, setPosts] = useState(initialPosts);
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const handleTagClick = async (tagId: string) => {
    if (activeTag === tagId) {
        setActiveTag(null);
        setPosts(await getFilteredPosts());
    } else {
        setActiveTag(tagId);
        setPosts(await getFilteredPosts(tagId));
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
                jsonContent={post.textContent}
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
            />
        ))}
        </div>
    </div>
    );
};

export default FilterablePosts;