"use client";
import React from 'react'
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { updateUsername } from '../actions';
import SubmitButton from './SubmitButton';



const SetttingsForm = ({ username }: { username: string | null | undefined }) => {
  return (
    <form action={updateUsername}>
      <h1 className='text-3xl font-extrabold tracking-tight font-mono'>設定ページ</h1>
      <Separator className='my-4' />
        <Label className='text-xl'>ユーザー名</Label>
        <p className='text-sm text-muted-foreground'>ユーザー名を変更できます</p>
        <Input defaultValue={username ?? undefined}
          name='username'
          required
          className='mt-2'
          min={2}
          max={21}/>
      <div className='w-full flex mt-5 gap-x-5 justify-end'>
        <Button variant="secondary" asChild type='button'>
          <Link href="/">キャンセル</Link>
        </Button>
        <SubmitButton />
      </div>
    </form>
  )
}

export default SetttingsForm
