import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'
import image from '../../../../public/fitness.png'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Text, Video } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TipTapEditor } from '@/app/components/TipTabEditor'
import SubmitButton from '@/app/components/SubmitButton'

const rules = [
    {
        id: 1,
        text: '思いやりを持って接しましょう'
    },
    {
        id: 2,
        text: '実社会と同じようにマナーを守りましょう'
    },
    {
        id: 3,
        text: '情報の出典を確認しましょう'
    },
    {
        id: 4,
        text: '投稿前に同じ内容がないか確認しましょう'
    },
    {
        id: 5,
        text: 'コミュニティガイドラインを読みましょう'
    },
]

const CreatePostRoute = ({params}: {params: {id: string}}) => {
    return (
        <div className='max-w-[1000px] mx-auto flex gap-x-10 mt-4'>
            <div className='w-[65%] flex flex-col gap-y-5'>
                <h1 className='font-semibold'>
                    コミュニティ名: <Link className='text-primary' href={`/fit/${params.id}`}>{params.id}</Link>
                </h1>
                <Tabs className='w-full' defaultValue='post'>
                    <TabsList className='grid grid-cols-2 w-full'>
                        <TabsTrigger value='post'>
                            <Text className='h-4 w-4 mr-2'/>
                            投稿
                        </TabsTrigger>
                        <TabsTrigger value='image'>
                            <Video className='h-4 w-4 mr-2'/>
                            画像/動画
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value='post'>
                        <Card>
                            <form>
                                <CardHeader>
                                    <Label></Label>
                                    <Input required name='title' placeholder='Title'/>
                                    <TipTapEditor />
                                </CardHeader>
                                <CardFooter>
                                    <SubmitButton text="投稿作成"/>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <div className='w-[35%]'>
                <Card className='flex flex-col p-4'>
                    <div className='flex items-center gap-x-2'>
                        <Image src={image} height={50} width={50} alt='image'/>
                        <h1 className='font-medium'>投稿する</h1>
                    </div>
                    <Separator className='mt-2'/>
                    <div className='flex flex-col gap-y-5 mt-5'>
                        {rules.map((item) => (
                            <div key={item.id} >
                                <p className='text-sm font-medium'>
                                    {item.id}. {item.text}
                                </p>
                                <Separator className='mt-2'/>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default CreatePostRoute
