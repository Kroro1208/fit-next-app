"use client";
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'
import React, { useState } from 'react'
import { getNotifications } from '../actions'
import NotificationModal from './NotificationModal'

interface Notification {
    id: string;
    message: string;
    createdAt: Date;
}

interface NotificationProps {
    initialCount: number
}

const NotificationBell = ({initialCount}: NotificationProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const handleClick = async() => {
        if(!isOpen) {
            const fetchedNotifications = await getNotifications();
            setNotifications(fetchedNotifications);
            setCount(0);
        }
        setIsOpen(true);
    }

    return (
    <div className='relative'>
        <button onClick={handleClick} className='focus:outline-none'>
            <Bell className='h-6 w-6'/>
            { count > 0 && (
                <Badge className='absolute -top-2 -right-2 px-2 py-1 text-xs'>
                    {count}
                </Badge>
            )}
        </button>
        { isOpen && <NotificationModal notifications={notifications} onClose={()=> setIsOpen(false)} />}
    </div>
    )
}

export default NotificationBell
