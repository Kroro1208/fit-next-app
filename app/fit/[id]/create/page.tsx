"use client";
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import React, { useState } from 'react'
import image from '../../../../public/fitness.png'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Text, Video } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TipTapEditor } from '@/app/components/TipTabEditor'
import SubmitButton from '@/app/components/SubmitButton'
import { UploadDropzone } from '@/app/components/Uploadthing'
import { createPost } from '@/app/actions';
import { JSONContent } from '@tiptap/react';

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
    const [imageUrl, setImageUrl] = useState<null | string>(null);
    const [json, setJson] = useState<null | JSONContent>(null);
    const [title, setTitle] = useState<null | string>(null);
    const createPostFit = createPost.bind(null, {jsonContent: json});
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
                            <form action={createPostFit}>
                                <input type="hidden" name='imageUrl' value={imageUrl ?? undefined} />
                                <input type="hidden" name='subName' value={params.id} />
                                <CardHeader>
                                    <Label>タイトル</Label>
                                    <Input required
                                        name='title'
                                        placeholder='タイトルを入力'
                                        value={title ?? ""}
                                        onChange={(e) => setTitle(e.target.value)}/>
                                    <TipTapEditor setJson={setJson} json={json}/>
                                </CardHeader>
                                <CardFooter>
                                    <SubmitButton text="投稿作成"/>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                    <TabsContent value='image'>
                        <Card>
                            <CardHeader>
                                {imageUrl === null ? (
                                    <UploadDropzone
                                        className='ut-button:bg-primary ut-button:ut-readying:bg-primary/50
                                        ut-label:text-primary ut-button:ut-uploading::bg-primary/50
                                        ut-button:ut-uploading:after:bg-primary'
                                        onClientUploadComplete={(res) => {
                                            setImageUrl(res[0].url);
                                        }}
                                        endpoint="imageUploader"
                                        onUploadError={(error: Error) => {
                                            alert('エラーが発生しました');
                                    }}/>
                                ) : (
                                    <Image
                                    className='h-80 rounded-lg w-full object-contain'
                                    src={imageUrl} alt='uploadImage' width={500} height={400}/>
                                )}
                            </CardHeader>
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