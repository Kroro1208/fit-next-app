import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>通知</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={notification.id} className="mb-2 p-2 bg-secondary rounded">
                <p>{notification.message}</p>
                <small>{new Date(notification.createdAt).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p>新しい通知はありません。</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NotificationModal