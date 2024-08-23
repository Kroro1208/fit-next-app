// components/CommunitySelectModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import type { Community } from '@/types';

interface CommunitySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  communities: Community[];
}

const CommunitySelectModal: React.FC<CommunitySelectModalProps> = ({ isOpen, onClose, communities }) => {
  const router = useRouter();

  const handleCommunitySelect = (communityName: string) => {
    router.push(`/fit/${communityName}/create`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>コミュニティを選択</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {communities.map((community) => (
            <Button key={community.id} onClick={() => handleCommunitySelect(community.name)}>
              {community.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommunitySelectModal;