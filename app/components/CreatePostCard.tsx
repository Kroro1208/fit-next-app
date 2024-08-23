"use client";
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import postImage from '../../public/idea.png'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ImageDown, Link2 } from 'lucide-react'
import { getUserCommunities } from '@/app/actions'
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import type { Community } from '@/types';

const CreatePostCard = () => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const { user } = useKindeBrowserClient();

    useEffect(() => {
        const fetchCommunities = async () => {
            if (user?.id) {
                const userCommunities = await getUserCommunities(user.id);
                setCommunities(userCommunities);
            }
        };

        fetchCommunities();
    }, [user]);

    const firstCommunity = communities[0];

    return (
        <div>
            <Card className='px-4 mt-5 py-2 flex items-center gap-x-4'>
                <Image src={postImage} alt='postImage' className='h-12 w-fit'/>
                <Link href={firstCommunity ? `/fit/${firstCommunity.name}/create` : ""} className='w-full'>
                    <Input placeholder='記事を投稿する'/>
                </Link>
                <div className='flex items-center gap-x-4'>
                    <Button variant="outline" size="icon" asChild>
                        <Link href={firstCommunity ? `/fit/${firstCommunity.name}/create` : "#"}>
                            <ImageDown className='w-4 h-4'/>
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon">
                        <Link href={firstCommunity ? `/fit/${firstCommunity.name}/create` : "#"}>
                            <Link2 className='w-4 h-4'/>
                        </Link>
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export default CreatePostCard