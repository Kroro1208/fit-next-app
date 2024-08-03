import prisma from "@/app/lib/db"
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubDescriptionForm from '@/app/components/SubDescriptionForm';
import { AlarmClock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
                <h1>投稿ページです</h1>
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
