import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MessageCircle, Share2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import CopyLink from './CopyLink'
import { handleVote } from '../actions'
import UpVoteButton from './UpVoteButton'
import DownVoteButton from './DownVoteButton'
import RenderJson from './RenderJson'
import { Progress } from '@/components/ui/progress';

interface Props {
    title: string;
    jsonContent: any;
    id: string;
    subName: string;
    userName: string;
    imageString: string | null;
    upVoteCount: number;
    downVoteCount: number;
    commentAmount: number;
    trustScore: number;
    shareLinkVisible: boolean;
}

interface ProcessedContent {
    type: 'heading' | 'paragraph' | 'other' | 'error';
    content: any;
    level?: number;
}

const PostCard = ({
    id,
    title,
    imageString,
    jsonContent,
    subName,
    userName,
    upVoteCount,
    downVoteCount,
    commentAmount,
    trustScore,
    shareLinkVisible
}: Props) => {
    const voteCount = upVoteCount - downVoteCount;

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

    const processContent = (content: any): ProcessedContent => {
        if (!content) {
            return { type: 'error', content: '内容がありません' };
        }

        try {
            let parsedContent = content;
            if (typeof content === 'string') {
                parsedContent = JSON.parse(content);
            }

            if (!parsedContent.content || parsedContent.content.length === 0) {
                return { type: 'error', content: '内容が空です' };
            }

            const firstItem = parsedContent.content[0];
            if (firstItem.type === 'heading') {
                const headingLimits = {
                    1: 10, 2: 15, 3: 20
                };
                const limit = headingLimits[firstItem.attrs.level as keyof typeof headingLimits] || 30;
    
                const truncatedHeading = {
                    ...firstItem,
                    content: firstItem.content.map((textNode: any) => ({
                        ...textNode,
                        text: textNode.text.slice(0, limit) + (textNode.text.length > limit ? '...' : '')
                    }))
                };
                return {
                    type: 'heading',
                    level: firstItem.attrs.level,
                    content: {
                        ...parsedContent,
                        content: [truncatedHeading]
                    }
                };
            } else {
                const paragraphs = parsedContent.content.filter((item: any) => item.type === 'paragraph').slice(0, 3);
                return {
                    type: 'paragraph',
                    content: {
                        ...parsedContent,
                        content: paragraphs
                    }
                };
            }
        } catch (error) {
            console.error('Error processing content:', error);
            return { type: 'error', content: 'コンテンツの処理中にエラーが発生しました' };
        }
    };

    const processedContent = processContent(jsonContent);

    return (
        <Card className='w-full'>
            <div className='flex'>
                <div className='flex flex-col items-center justify-center gap-3 p-2 bg-muted'>
                    <form action={handleVote}>
                        <input type="hidden" name='voteDirection' value="UP"/>
                        <input type="hidden" name='postId' value={id}/>
                        <UpVoteButton />
                    </form>
                    <span className='text-sm font-bold my-1'>{voteCount}</span>
                    <form action={handleVote}>
                        <input type="hidden" name='voteDirection' value="DOWN"/>
                        <input type="hidden" name='postId' value={id}/>
                        <DownVoteButton />
                    </form>
                </div>
                <div className='flex-1'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <div className='flex items-center space-x-2'>
                            <Link href={`/fit/${subName}`} className='font-semibold text-sm hover:underline'>
                                fit/{subName}
                            </Link>
                            <span className='text-sm text-muted-foreground'>•</span>
                            <p className='text-sm text-muted-foreground'>
                                投稿者: <span className='font-medium hover:underline'>{userName}</span>
                            </p>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className='flex items-center space-x-2'>
                                        <Progress value={trustScore} className={`w-20 h-2 [&>div]:${getTrustScoreColor(trustScore)}`} />
                                        <Badge variant='outline' className={`${getTrustScoreColor(trustScore)} text-white`}>
                                            {trustScore.toFixed(1)}%
                                        </Badge>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>信頼性スコア: {getTrustScoreText(trustScore)}</p>
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
                                    width={600}
                                    height={300}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className='flex justify-between items-center'>
                        <div className='flex items-center space-x-4'>
                            <Button variant='ghost' size='sm' className='flex items-center'>
                                <MessageCircle className='mr-1 h-5 w-5' />
                                <span>{commentAmount}</span>
                            </Button>
                            {shareLinkVisible && (
                                <div className='flex items-center'>
                                    <Share2 className='mr-1 h-4 w-4' />
                                    <CopyLink id={id} />
                                </div>
                            )}
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Badge variant='secondary'>UP: {upVoteCount}</Badge>
                            <Badge variant='secondary'>DOWN: {downVoteCount}</Badge>
                        </div>
                    </CardFooter>
                </div>
            </div>
        </Card>
    )
}

export default PostCard