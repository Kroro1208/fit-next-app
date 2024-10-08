"use client";
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { useEffect, useState } from 'react'
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
import { createPost, getTags } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import Select from 'react-select'
import type { MultiValue } from 'react-select';


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

interface Tag {
    value: string;
    label: string;
}

const CreatePostRoute = ({params}: {params: {id: string}}) => {
    const [imageUrl, setImageUrl] = useState<null | string>(null);
    const [jsonString, setJsonString] = useState<string | null>(null);
    const [title, setTitle] = useState<null | string>(null);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<MultiValue<Tag>>([]);    const router = useRouter();
    const { toast } = useToast()

    useEffect(() => {
        const fetchTags = async () => {
            const tags = await getTags();
            setAvailableTags(tags.map(tag => ({ value: tag.id, label: tag.name })));
        };
        fetchTags();
    }, []);

    const handleSubmit = async (formData: FormData) => {
        try {
            const tagIds = selectedTags.map(tag => tag.value);
            const result = await createPost({ jsonString, tags: tagIds }, formData);
            
            if ('error' in result && typeof result.error === 'string') {
                toast({
                    variant: "destructive",
                    title: "エラー",
                    description: result.error,
                });
            } else if ('success' in result && result.success && 'postId' in result) {
                toast({
                    variant: 'success',
                    title: "成功",
                    description: "投稿が作成されました！",
                });
                router.push(`/post/${result.postId}`);
            } else {
                toast({
                    variant: "destructive",
                    title: "エラー",
                    description: "投稿の作成中に問題が発生しました。",
                });
            }
        } catch (error) {
            console.error('投稿作成中にエラーが発生しました:', error);
            toast({
                variant: "destructive",
                title: "エラー",
                description: "予期せぬエラーが発生しました。",
            });
        }
    };

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
                            <form action={handleSubmit}>
                                <input type="hidden" name='imageUrl' value={imageUrl ?? ''} />
                                <input type="hidden" name='subName' value={params.id} />
                                <input type="hidden" name="jsonString" value={jsonString ?? ''} />
                                <CardHeader>
                                    <Label>タイトル</Label>
                                    <Input required
                                        name='title'
                                        placeholder='タイトルを入力'
                                        value={title ?? ""}
                                        onChange={(e) => setTitle(e.target.value)}/>
                                    <Label>タグ</Label>
                                    <Select
                                        isMulti
                                        name="tags"
                                        options={availableTags}
                                        value={selectedTags}
                                        onChange={(newValue: MultiValue<Tag>) => setSelectedTags(newValue)}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                    <TipTapEditor setJsonString={setJsonString} jsonString={jsonString} />
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