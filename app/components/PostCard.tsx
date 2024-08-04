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

    return (
        <Card className='w-full'>
            <div className='flex'>
                <div className='flex flex-col items-center justify-start p-2 bg-muted'>
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
                                        <Progress value={trustScore} className='w-20 h-2' indicatorClassName={getTrustScoreColor(trustScore)} />
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
                        <div className='max-h-[300px] overflow-hidden rounded-md'>
                            {imageString ? (
                                <Image
                                    src={imageString}
                                    alt='投稿画像'
                                    width={600}
                                    height={300}
                                    className='w-full h-full object-cover'
                                />
                            ) : jsonContent ? (
                                <RenderJson data={jsonContent} />
                            ) : (
                                <p className='text-muted-foreground'>投稿内容がありません</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className='flex justify-between items-center'>
                        <div className='flex items-center space-x-4'>
                            <Button variant='ghost' size='sm' className='flex items-center'>
                                <MessageCircle className='mr-1 h-4 w-4' />
                                <span>{commentAmount}</span>
                            </Button>
                            {shareLinkVisible && (
                                <Button variant='outline' size='sm'>
                                    <Share2 className='mr-1 h-4 w-4' />
                                    <CopyLink id={id} />
                                </Button>
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