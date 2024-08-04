"use client";
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect } from 'react'
import SaveButton from './SaveButton';
import { updateSubDescription } from '../actions';
import { useFormState } from 'react-dom';
import { useToast } from '@/components/ui/use-toast';

interface Props {
    subName: string;
    description: string | null | undefined;
};

const initialState = {
    message: "",
    status: "",
};

const SubDesciptionForm = ({ description, subName }: Props) => {
    const [state, formAction] = useFormState(updateSubDescription, initialState);
    const { toast } = useToast();
    useEffect(() => {
        if(state.status ==='green'){
            toast({
                variant: 'success',
                title: 'Success',
                description: state.message,
            });
        } else if (state.status ==='error'){
            toast({
                title: 'Error',
                description: state.message,
                variant: 'destructive'
            });
        }
    }, [state, toast]);

    return (
        <form action={formAction} className='mt-3 space-y-4'>
            <input type="hidden" name='subName' value={subName} />
            <Textarea
                maxLength={100}
                name='description'
                placeholder='コミュニティについての説明'
                defaultValue={description ?? undefined}
            />
            <div className="flex justify-center">
                <SaveButton />
            </div>
        </form>
    )
}

export default SubDesciptionForm
