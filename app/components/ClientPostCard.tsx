"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowDown, ArrowUp, MessageCircle, Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CopyLink from './CopyLink';
import RenderJson from './RenderJson';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useClientVote } from '../hooks/useClientVote';
import type { TipTapContent } from '@/types';
import type { Prisma } from '@prisma/client';
import { deletePost } from '../actions';
import ClientUpVoteButton from './ClientUpVoteButton';
import ClientDownVoteButton from './ClientDownVoteButton';

interface Props {
    title: string;
    id: string;
    subName: string;
    userName: string;
    imageString: string | null;
    jsonContent: Prisma.JsonValue | TipTapContent;
    upVoteCount: number;
    downVoteCount: number;
    commentAmount: number;
    trustScore: number;
    shareLinkVisible: boolean;
    currentUserId?: string;
    userId?: string;
    tags?: {
        id: string;
        name: string
    }[];
    userVote: 'UP' | 'DOWN' | null;
}

type ProcessedContent = 
    | { type: 'error'; content: string }
    | { type: 'heading'; level: number; content: string | TipTapContent }
    | { type: 'paragraph'; content: string | TipTapContent };

    const ClientPostCard: React.FC<Props> = ({
        id,
        title,
        imageString,
        jsonContent,
        subName,
        userName,
        upVoteCount: initialUpVoteCount,
        downVoteCount: initialDownVoteCount,
        commentAmount,
        trustScore,
        shareLinkVisible,
        currentUserId,
        userId,
        tags,
        userVote
    }) => {
        const { toast } = useToast();
        const [localUpVoteCount, setLocalUpVoteCount] = useState(initialUpVoteCount);
        const [localDownVoteCount, setLocalDownVoteCount] = useState(initialDownVoteCount);
        const { voteState, clientVote } = useClientVote(
            { upVoteCount: localUpVoteCount, downVoteCount: localDownVoteCount, trustScore, userVote },
            id
        );
        const [isUpVoting, setIsUpVoting] = useState(false);
        const [isDownVoting, setIsDownVoting] = useState(false);
        const [isDeleting, setIsDeleting] = useState(false);

        useEffect(() => {
            setLocalUpVoteCount(voteState.upVoteCount);
            setLocalDownVoteCount(voteState.downVoteCount);
        }, [voteState]);
    
        const handleVote = async (direction: 'UP' | 'DOWN') => {
            const setVotingState = direction === "UP" ? setIsUpVoting : setIsDownVoting;
            setVotingState(true)
            try {
                await clientVote(direction);
            } catch (error) {
                console.error('Vote error:', error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: '投票に失敗しました。もう一度お試しください。'
                });
            } finally {
                setVotingState(false);
            }
        };

    const getTrustScoreColor = (score: number) => {
        if (score >= 70) return 'bg-green-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getTrustScoreText = (score: number) => {
        if (score >= 70) return '高信頼度';
        if (score >= 40) return '中程度の信頼度';
        return '低信頼度';
    };

    const processContent = (content: Prisma.JsonValue | TipTapContent): ProcessedContent => {
        if (content === null || content === undefined) {
            return { type: 'error', content: '内容がありません' };
        }
    
        try {
            let parsedContent: TipTapContent;
            if (typeof content === 'string') {
                parsedContent = JSON.parse(content);
            } else if (typeof content === 'object') {
                parsedContent = content as unknown as TipTapContent;
            } else {
                throw new Error('Invalid content format');
            }
    
            if (!parsedContent.content || parsedContent.content.length === 0) {
                return { type: 'error', content: '内容が空です' };
            }
    
            const firstItem = parsedContent.content[0];
            if (firstItem.type === 'heading' && firstItem.attrs?.level) {
                const headingLimits: Record<number, number> = {
                    1: 10, 2: 15, 3: 20
                };
                const limit = headingLimits[firstItem.attrs.level] || 30;
    
                const truncatedHeading = {
                    ...firstItem,
                    content: firstItem.content?.map((textNode) => ({
                        ...textNode,
                        text: textNode.text ? textNode.text.slice(0, limit) + (textNode.text.length > limit ? '...' : '') : ''
                    })) || []
                };
                return {
                    type: 'heading',
                    level: firstItem.attrs.level,
                    content: {
                        ...parsedContent,
                        content: [truncatedHeading]
                    }
                };
            }
    
            const paragraphs = parsedContent.content.filter((item) => item.type === 'paragraph').slice(0, 3);
            return {
                type: 'paragraph',
                content: {
                    ...parsedContent,
                    content: paragraphs
                }
            };
        } catch (error) {
            console.error('Error processing content:', error);
            return { type: 'error', content: 'コンテンツの処理中にエラーが発生しました' };
        }
    };

    const processedContent = processContent(jsonContent);
    const totalVote = voteState.upVoteCount - voteState.downVoteCount;

    const handleDeletePost = async () => {
        if (window.confirm('本当にこの投稿を削除しますか？')) {
            setIsDeleting(true);
            try {
                const result = await deletePost(id);
                if (result.success) {
                    toast({
                        title: "Success",
                        description: result.message,
                    });
                    window.location.reload();
                } else {
                    throw new Error(result.message || '削除に失敗しました');
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : '投稿の削除に失敗しました',
                    variant: "destructive",
                });
            } finally {
                setIsDeleting(false);
            }
        }
    }

    return (
        <Card className='w-full'>
            <div className='flex'>
                <div className='flex flex-col items-center justify-center gap-3 p-2'>
                    <button 
                        type='button'
                        disabled={isUpVoting}
                    >
                        <ClientUpVoteButton isLoading={isUpVoting} onclick={() => handleVote('UP')}/>
                    </button>
                    <span className='text-sm font-bold my-1'>{totalVote}</span>
                    <button
                        type='button'
                        disabled={isDownVoting}
                    >
                        <ClientDownVoteButton  isLoading={isDownVoting} onclick={() => handleVote('DOWN')}/>
                    </button>
                </div>
                <div className='flex-1'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='flex items-center space-x-2'>
                            <Link href={`/fit/${subName}`} className='font-semibold text-sm hover:underline'>
                                fit/{subName}
                            </Link>
                            <Link href={`/user/${userId}/profile`} className='text-sm text-muted-foreground'>
                                投稿者: <span className='font-medium hover:underline'>{userName}</span>
                            </Link>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className='flex items-center space-x-2'>
                                        <Progress value={voteState.trustScore} className={`w-20 h-2 [&>div]:${getTrustScoreColor(voteState.trustScore)}`} />
                                        <Badge variant='outline' className={`${getTrustScoreColor(voteState.trustScore)} text-white`}>
                                            {voteState.trustScore.toFixed(1)}%
                                        </Badge>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>信頼性スコア: {getTrustScoreText(voteState.trustScore)}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent>
                        <Link href={`/post/${id}`} className='block'>
                            <h2 className='text-xl font-semibold mb-2 hover:underline'>{title}</h2>
                        </Link>
                        <div className='mb-4'>
                            {processedContent.type === 'error' ? (
                                <p className="text-red-500">{processedContent.content}</p>
                            ) : processedContent.type === 'heading' ? (
                                <div className='text-2xl font-bold mb-2'>
                                    <RenderJson data={processedContent.content} />
                                </div>
                            ) : (
                                <div className='max-h-24 overflow-hidden text-sm'>
                                    <RenderJson data={processedContent.content} />
                                </div>
                            )}
                            <Link href={`/post/${id}`} className='text-sm text-blue-500 hover:underline'>
                                続きを見る
                            </Link>
                        </div>
                        {imageString && (
                            <div className='max-h-[300px] overflow-hidden rounded-md'>
                                <Image
                                    src={imageString}
                                    alt='投稿画像'
                                    width={300}
                                    height={150}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                        )}
                        {tags && tags.length > 0 && (
                            <div className='mt-2 space-x-2'>
                            {tags.map(tag => (
                                <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                            ))}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className='flex justify-between items-center'>
                        <div className='flex items-center space-x-4'>
                            <Button variant='ghost' size='sm' className='flex items-center'>
                                <MessageCircle className='mr-1 h-5 w-5' />
                                <Link href={`/post/${id}`}>
                                    <span>{commentAmount}</span>
                                </Link>
                            </Button>
                            {shareLinkVisible && (
                                <div className='flex items-center'>
                                    <Share2 className='mr-1 h-4 w-4' />
                                    <CopyLink id={id} />
                                </div>
                            )}
                            {currentUserId === userId && (
                                <Button 
                                    variant='ghost' 
                                    size='sm' 
                                    onClick={handleDeletePost}
                                    disabled={isDeleting}
                                >
                                    <Trash2 className='mr-1 h-4 w-4' />
                                    {isDeleting ? '削除中...' : '削除'}
                                </Button>
                            )}
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Badge variant='outline' className='bg-green-100 text-green-800 border-green-300'>
                                <ArrowUp className='mr-1 h-3 w-3' /> {localUpVoteCount}
                            </Badge>
                            <Badge variant='outline' className='bg-red-100 text-red-800 border-red-300'>
                                <ArrowDown className='mr-1 h-3 w-3' /> {localDownVoteCount}
                            </Badge>
                        </div>
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
};

export default ClientPostCard;