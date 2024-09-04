import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string;
  message: string;
  createdAt: string | Date;
  type: string;
  postTitle?: string;
  commentText?: string;
}

interface NotificationModalProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationModal = ({ notifications, onClose }: NotificationModalProps) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>通知</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[60vh] pr-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="mb-4 p-3 bg-secondary rounded-lg shadow-sm">
                <p className="text-sm">{notification.message}</p>
                <small className="text-xs text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">新しい通知はありません。</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default NotificationModal