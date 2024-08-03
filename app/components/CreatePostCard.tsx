import { Card } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'
import postImage from '../../public/idea.png'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ImageDown, Link2 } from 'lucide-react'

const CreatePostCard = () => {
    return (
        <div>
            <Card className='px-4 mt-5 py-2 flex items-center gap-x-4'>
                <Image src={postImage} alt='postImage' className='h-12 w-fit'/>
                <Link href="/fit/naoya/create" className='w-full'>
                    <Input placeholder='経験を投稿する'/>
                </Link>
                <div className='flex items-center gap-x-4'>
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/fit/naoya/create">
                            <ImageDown className='w-4 h-4'/>
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon">
                        <Link href="/fit/naoya/create">
                            <Link2 className='w-4 h-4'/>
                        </Link>
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export default CreatePostCard
