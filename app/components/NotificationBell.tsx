"use client";
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { getNotifications } from '../actions'
import NotificationModal from './NotificationModal'

interface Notification {
    id: string;
    message: string;
    createdAt: Date;
    type: string;
    postTitle?: string;
    commentText?: string;
}

interface NotificationProps {
    initialCount: number
}

const NotificationBell = ({initialCount}: NotificationProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchNotifications = async () => {
        const fetchedNotifications = await getNotifications();
        setNotifications(fetchedNotifications);
        setCount(0); // 通知を取得したら、カウントを0にリセット
    };

    const handleClick = async () => {
        if (!isOpen) {
            await fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        // initialCountが変更されたときにcountを更新
        setCount(initialCount);
    }, [initialCount]);

    return (
        <div className='relative'>
            <button type='button' onClick={handleClick} className='focus:outline-none'>
                <Bell className='h-6 w-6'/>
                {count > 0 && (
                    <Badge className='absolute -top-2 -right-2 px-2 py-1 text-xs'>
                        {count}
                    </Badge>
                )}
            </button>
            {isOpen && <NotificationModal notifications={notifications} onClose={handleClose} />}
        </div>
    )
}

export default NotificationBell