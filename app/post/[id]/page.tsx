/* eslint-disable @next/next/no-img-element */
import prisma from "@/app/lib/db"
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlarmClock, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { handleVote } from "@/app/actions";
import UpVoteButton from "@/app/components/UpVoteButton";
import DownVoteButton from "@/app/components/DownVoteButton";
import RenderJson from "@/app/components/RenderJson";
import CopyLink from "@/app/components/CopyLink";
import CommentForm from "@/app/components/CommentForm";
import user from "../../../public/user.png";

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
            subName: true,
            id: true,
            Vote: {
                select: {
                    voteType: true
                }
            },
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
    return (
        <div className="max-w-[1200px] mx-auto flex gap-x-10 mt-4 mb-10">
            <div className="w-[70%] flex flex-col gap-y-5">
                <Card className="flex p-2">
                    <div className="flex flex-col items-center gap-y-2 p-2">
                        <form action={handleVote}>
                            <input type="hidden" name='voteDirection' value="UP"/>
                            <input type="hidden" name='postId' value={data.id}/>
                            <UpVoteButton />
                        </form>
                        {data.Vote.reduce((acc, vote) => {
                            if(vote.voteType === 'UP') return acc + 1;
                            if(vote.voteType === 'DOWN') return acc - 1;
                            return acc;
                            }, 0)}
                        <form action={handleVote}>
                            <input type="hidden" name='voteDirection' value="DOWN"/>
                            <input type="hidden" name='postId' value={data.id}/>
                            <DownVoteButton />
                        </form>
                    </div>
                    <div className="p-2 w-full">
                        <p className="text-sm text-muted-foreground">投稿者: {data.User?.userName}</p>
                        <h1 className="font-medium mt-1 text-lg">{data.title}</h1>
                        {data.imageString && (
                            <Image src={data.imageString} alt="UserImage" width={500} height={400}
                            className="w-full h-auto object-contain mt-2"/>
                        )}
                        {data.textContent && (<RenderJson data={data.textContent}/>)}
                        <div className="flex gap-x-5 items-center mt-3">
                            <div className="flex items-center gap-x-1">
                                <MessageCircle className="h-5 w-5 text-muted-foreground"/>
                                <p className="text-muted-foreground font-medium text-sm">{data.Comment.length}件のコメント</p>
                            </div>
                            <CopyLink id={params.id}/>
                        </div>
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
                                            alt="userAvata"
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
                </Card>
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
