"use client";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react'
import { useFormStatus } from 'react-dom';

const SubmitButton = ({ text }: { text: string }) => {
    const { pending } = useFormStatus();
  return (
    <>
    {pending ? (
        <Button disabled>
            <Loader2 className='mr-2 w-4 h-4 animate-spin'/>
            更新しています
        </Button>
     ) : (
         <Button type='submit'>
            {text}
         </Button>
     )}
    </>
  );
}

export default SubmitButton
