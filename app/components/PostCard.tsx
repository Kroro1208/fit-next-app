import { Card } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import CopyLink from './CopyLink'
import { handleVote } from '../actions'
import UpVoteButton from './UpVoteButton'
import DownVoteButton from './DownVoteButton'
import RenderJson from './RenderJson'

interface Props {
    title: string;
    jsonContent: any;
    id: string;
    subName: string;
    userName: string;
    imageString: string | null;
    voteCount: number;
}

const PostCard = ({id, title, imageString, jsonContent, subName, userName, voteCount }: Props) => {
    return (
        <Card className='flex relative overflow-hidden'>
            <div className='flex flex-col items-center gap-y-2 bg-muted p-2'>
                <form action={handleVote}>
                    <input type="hidden" name='voteDirection' value="UP"/>
                    <input type="hidden" name='postId' value={id}/>
                    <UpVoteButton />
                </form>
                {voteCount}
                <form action={handleVote}>
                    <input type="hidden" name='voteDirection' value="DOWN"/>
                    <input type="hidden" name='postId' value={id}/>
                    <DownVoteButton />
                </form>
            </div>
            <div>
                <div className='flex items-center gap-x-2 p-2'>
                    <Link href={`/fit/${subName}`} className='font-semibold text-xs'>
                        fit/{subName}
                    </Link>
                    <p className='text-xs text-muted-foreground'>
                        {userName}: <span className='hover:text-primary'>{`${subName}`}</span>
                    </p>
                </div>
                <div className='flex items-center gap-x-2 p-2'>
                        <Link href="/" className='font-semibold text-xs'>
                            <h1 className='font-medium mt-1 text-lg'>{title}</h1>
                        </Link>
                </div>
                <div className='max-h-[300px] overflow-hidden'>
                    {imageString ? (
                        <Image
                            src={imageString}
                            alt='postImage'
                            width={600}
                            height={300}
                            className='w-full h-full'
                        />
                    ) : jsonContent ? (
                        <RenderJson data={jsonContent} />
                    ) : (
                        <p>投稿内容がありません</p>
                    )}
                </div>
                <div className='m-3 flex items-center gap-x-5'>
                    <div className=' flex items-center gap-x-1'>
                        <MessageCircle className='h-4 w-4 text-muted-foreground'/>
                        <p className='text-xs text-muted-foreground font-medium'>
                            コメント数 15
                        </p>
                    </div>
                    <CopyLink id={id}/>
                </div>
            </div>
        </Card>
    )
}

export default PostCard
