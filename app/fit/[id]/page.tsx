import { updateSubDescription } from '@/app/actions'
import SaveButton from '@/app/components/SaveButton'
import prisma from '@/app/lib/db'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

async function getData(name: string) {
    const data = await prisma.community.findUnique({
        where: {
            name: name,
        },
        select: {
            name: true,
            createdAt: true,
            description: true,
            userId: true
        }
    });
    return data;
}

const CommunityRoute = async ({ params }: { params: {id: string}}) => {
    const data = await getData(params.id);
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    return (
        <div className='max-w-[1000px] mx-auto flex gap-x-10 mt-4'>
            <div className='w-[65%] flex flex-col gap-y-5'>
                <h1>投稿セクションです</h1>
            </div>
            <div className='w-[35%]'>
                <Card>
                <div className='bg-muted p-4 font-semibold'>コミュニティについて</div>
                    <div className='p-4'>
                        <div className='flex items-center gap-x-3'>
                            <Image
                                className='rounded-full h-16 w-16'
                                src={`https://avatar.vercel.sh/${data?.name}`}
                                alt='image' width={60} height={60}
                            />
                            <Link href={`/fit/${data?.name}`} className='font-medium'>
                                fit/{data?.name}
                            </Link>
                        </div>
                        {user?.id === data?.userId ? (
                            <form action={updateSubDescription} className='mt-3'>
                                <input type="hidden" name='subName' value={params.id} />
                                <Textarea
                                    maxLength={100}
                                    name='description'
                                    placeholder='コミュニティについての説明'
                                />
                                <SaveButton />
                            </form>
                        ): (
                            <p className='text-sm font-normal text-secondary-foreground mt-2'>
                                {data?.description}
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default CommunityRoute