'use client';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { toggleBookmark } from '../actions';

interface BookMarkButtonProps {
  postId: string;
  isBookmarked: boolean;
}

const BookMarkButton: React.FC<BookMarkButtonProps> = ({ postId, isBookmarked }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleToggleBookmark = async () => {
    try {
      const result = await toggleBookmark(postId);
      toast({
        title: result.action === 'bookmark' ? 'ブックマークに追加しました' : 'ブックマークを解除しました',
        variant: "default",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "もう一度お試しください",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleBookmark}
      aria-label={isBookmarked ? "ブックマークを解除" : "ブックマークに追加"}
    >
      <Bookmark className={isBookmarked ? "fill-current" : ""} />
    </Button>
  );
};

export default BookMarkButton;