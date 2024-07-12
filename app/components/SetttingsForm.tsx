"use client";
import React, { useEffect } from 'react'
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { updateUsername } from '../actions';
import SubmitButton from './SubmitButton';
import { useFormState } from 'react-dom';
import { useToast } from '@/components/ui/use-toast';

const initialState = {
  message: "",
  status: ""
};

const SetttingsForm = ({ username }: { username: string | null | undefined }) => {
  const [ state, formAction ] = useFormState(updateUsername, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if(state?.status === 'success') {
      toast({
        title: 'Successfull',
        description: state.message,
        variant: 'default'
      });
    } else if(state?.status === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive'
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
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
          {state?.message && (
                  <p className={`mt-2 ${state.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {state.message}
                  </p>
                )}
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
