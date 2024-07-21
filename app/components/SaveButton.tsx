"use client";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react'
import { useFormStatus } from 'react-dom';

const SaveButton = () => {
    const { pending } = useFormStatus();
    return (
        <div>
        {pending ? (
            <Button className='mt-2 w-full disabled size-2'>
                <Loader2 className='mr-2 h-3 w-3 animate-spin'/>
                    保存中です
            </Button>
        ): (
            <Button className='mt-2 w-full' type='submit' size="sm">
                保存
            </Button>
        )}
        </div>
    );
}

export default SaveButton
