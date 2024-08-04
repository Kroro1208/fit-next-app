/* eslint-disable @next/next/no-img-element */
import prisma from "@/app/lib/db"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlarmClock, MessageCircle, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { handleVote } from "@/app/actions";
import UpVoteButton from "@/app/components/UpVoteButton";
import DownVoteButton from "@/app/components/DownVoteButton";
import RenderJson from "@/app/components/RenderJson";
import CopyLink from "@/app/components/CopyLink";
import CommentForm from "@/app/components/CommentForm";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

async function getData(id: string) {
    const data = await prisma.post.findUnique({
        where: {
            id: id
        },
        select: {
            createdAt: true,
            title: true,
            imageString: true,
            textContent: true,
            shareLinkVisible: true,
            subName: true,
            id: true,
            upVoteCount: true,
            downVoteCount: true,
            Comment: {
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    text: true,
                    User: {
                        select: {
                            imageUrl: true,
                            userName: true
                        }
                    }
                }
            },
            Community: {
                select: {
                    name: true,
                    createdAt: true,
                    description: true,
                }
            },
            User: {
                select: {
                    userName: true
                }
            }
        }
    });
    if(!data){
        return notFound();
    }

    return data;
}

const PostPage = async ({ params }: { params: {id: string} }) => {
    const data = await getData(params.id);

    const upVoteCount = data.upVoteCount;
    const downVoteCount = data.downVoteCount;
    const totalVotes = upVoteCount + downVoteCount;
    const trustScore = totalVotes > 0 ? (upVoteCount / totalVotes) * 100 : 50;

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
        <div className="max-w-[1200px] mx-auto flex gap-x-10 mt-4 mb-10">
            <div className="w-[70%] flex flex-col gap-y-5">
                <Card className="w-full">
                    <div className="flex">
                        <div className="flex flex-col items-center justify-center p-2 bg-muted">
                            <form action={handleVote}>
                                <input type="hidden" name='voteDirection' value="UP"/>
                                <input type="hidden" name='postId' value={data.id}/>
                                <UpVoteButton />
                            </form>
                            <span className="text-sm font-bold my-1">{upVoteCount - downVoteCount}</span>
                            <form action={handleVote}>
                                <input type="hidden" name='voteDirection' value="DOWN"/>
                                <input type="hidden" name='postId' value={data.id}/>
                                <DownVoteButton />
                            </form>
                        </div>
                        <div className="flex-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center space-x-2">
                                    <Link href={`/fit/${data.subName}`} className="font-semibold text-sm hover:underline">
                                        fit/{data.subName}
                                    </Link>
                                    <span className="text-sm text-muted-foreground">•</span>
                                    <p className="text-sm text-muted-foreground">
                                        投稿者: <span className="font-medium hover:underline">{data.User?.userName}</span>
                                    </p>
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center space-x-2">
                                                <Progress value={trustScore} className="w-20 h-2" indicatorClassName={getTrustScoreColor(trustScore)} />
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
                                <h1 className="text-xl font-semibold mb-2">{data.title}</h1>
                                {data.imageString && (
                                    <Image src={data.imageString} alt="投稿画像" width={500} height={400}
                                    className="w-full h-auto object-contain mt-2"/>
                                )}
                                {data.textContent && (<RenderJson data={data.textContent}/>)}
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <Button variant="ghost" size="sm" className="flex items-center">
                                        <MessageCircle className="mr-1 h-4 w-4" />
                                        <span>{data.Comment.length}</span>
                                    </Button>
                                    {data.shareLinkVisible && (
                                        <div className='flex items-center'>
                                            <Share2 className='mr-1 h-4 w-4' />
                                            <CopyLink id={data.id} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary">UP: {upVoteCount}</Badge>
                                    <Badge variant="secondary">DOWN: {downVoteCount}</Badge>
                                </div>
                            </CardFooter>
                        </div>
                    </div>
                </Card>
                <CommentForm postId={params.id}/>
                <Separator className="my-5"/>
                <div className="flex flex-col gap-y-7">
                    {data.Comment.map((item) => (
                        <div key={item.id} className="flex flex-col">
                            <div className="flex items-center gap-x-3">
                                <img src={item.User?.imageUrl
                                    ? item.User?.imageUrl
                                    : 'https://w7.pngwing.com/pngs/81/570/png-transparent-pofile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png' }
                                    className="w-7 h-7 rounded-full"
                                    alt="userAvatar"
                                />
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    {item.User?.userName}
                                </h3>
                            </div>
                            <p className="ml-10 text-secondary-foreground text-sm tracking-wide">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-[30%]">
            <Card>
                    <div className='bg-muted p-4 font-semibold'>コミュニティについて</div>
                    <div className='p-4'>
                        <div className='flex items-center gap-x-3'>
                            <Image
                                className='rounded-full h-16 w-16'
                                src={`https://avatar.vercel.sh/${data?.subName}`}
                                alt='image' width={60} height={60}
                            />
                            <Link href={`/fit/${data?.subName}`} className='font-medium'>
                                fit/{data?.subName}
                            </Link>
                        </div>
                            <p className='text-sm font-normal text-secondary-foreground mt-2'>
                                {data?.Community?.description}
                            </p>
                        <div className='flex items-center gap-x-2 mt-4'>
                            <AlarmClock className='h-5 w-5 text-muted-foreground'/>
                        <p className='text-muted-foreground font-medium text-sm'>
                            作成日: {new Date(data?.createdAt as Date).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            weekday: 'long',
                            day: 'numeric'
                            })}
                        </p>
                        </div>
                        <Separator className='my-5'/>
                        <Button className='rounded-full w-full' asChild>
                            <Link href={`/fit/${data?.subName}/create`}>
                                投稿作成
                            </Link>
                        </Button>
                    </div>
            </Card>
            </div>
        </div>
    )
}

export default PostPage
