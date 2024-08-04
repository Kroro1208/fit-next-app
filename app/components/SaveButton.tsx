"use client";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react'
import { useFormStatus } from 'react-dom';

const SaveButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button 
            className='mt-1 px-6 w-full' 
            type='submit' 
            size="sm"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                    保存中
                </>
            ) : '保存'}
        </Button>
    );
}

export default SaveButton