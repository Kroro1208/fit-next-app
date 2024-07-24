"use client";
import { useToast } from '@/components/ui/use-toast';
import { Share } from 'lucide-react'

const CopyLink = ({ id }: { id: string }) => {
    const { toast } = useToast();
    async function copytoClipboard(){
        await navigator.clipboard.writeText(`${location.origin}/post/${id}`);
        toast({
            title: 'Success',
            description: 'クリップボードにコピーされました'
        });
    }
    return (
        <button className='flex items-center gap-x-1' onClick={copytoClipboard}>
            <Share className='h-4 w-4 text-muted-foreground'/>
            <p className='text-muted-foreground font-medium text-sm'>共有</p>
        </button>
    );
}

export default CopyLink
