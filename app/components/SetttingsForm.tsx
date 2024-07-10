"use client";
import React from 'react'
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"



const SetttingsForm = ({ username }: { username: string | null | undefined }) => {
  return (
    <form>
      <h1 className='text-3xl font-extrabold font-mono'>設定ページ</h1>
      <Separator className='my-4' />
      <Label className='text-xl'>ユーザー名</Label>
      <p className='text-sm text-muted-foreground'>ユーザー名を変更できます</p>

      <Input defaultValue={username ?? undefined}
      name='username' required className='mt2' min={2} max={21}/>
    </form>
  )
}

export default SetttingsForm
