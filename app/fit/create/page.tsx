"use client";
import { createCommunity } from '@/app/actions'
import SubmitButton from '@/app/components/SubmitButton';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useFormState } from 'react-dom'

const initialState = {
    message: "",
    status: "",
};

const CreateCommunity = () => {
    const [ state, formAction ] = useFormState(createCommunity, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if(state.status === 'error') {
            toast({
                title: "Error",
                description: state.message,
                variant: 'destructive'
            });
        }
    }, [state, toast]);

  return (
    <div className='max-w-[1000px] mx-auto flex flex-col mt-4'>
        <form action={formAction}>
            <h1 className='text-3xl font-extrabold tracking-tight'>
                自分のコミュニティ作成
            </h1>
            <Separator className='mt-4'/>
            <Label className='text-lg'>Name</Label>
            <p className='text-muted-foreground'>大文字と小文字を含むコミュニティ名は変更できません</p>

            <div className='relative mt-3'>
                <p className='absolute left-0 w-8 flex items-center justify-center h-full text-muted-foreground'>
                    fit/
                </p>
                <Input
                    name='name'
                    required
                    className='pl-6'
                    min={2}
                    max={21}/>
            </div>
            <p className='mt-1 text-destructive'>{state.message}</p>
            <div className='w-full flex mt-5 gap-x-5 justify-end'>
                <Button variant="secondary" asChild>
                    <Link href="/">キャンセル</Link>
                </Button>
                <SubmitButton text="コミュニティを作成"/>
            </div>
        </form>
    </div>
  )
}

export default CreateCommunity
