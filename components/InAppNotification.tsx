// components/InAppNotification.tsx
import {Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useNotifications } from '@/lib/notification-context';

export const InAppNotification = () => {
    const { notifications, markAsRead } = useNotifications();
    const [visibleNotification, setVisibleNotification] = useState<NotificationProps | null>(null);

    useEffect(() => {
        if (notifications.length > 0 && !notifications[0].read) {
            setVisibleNotification(notifications[0]);
            const timer = setTimeout(() => {
                markAsRead(notifications[0].id);
                setVisibleNotification(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [notifications]);

    if (!visibleNotification) return null;

    return (
        <TouchableOpacity
            onPress={() => {
                markAsRead(visibleNotification.id);
                setVisibleNotification(null);
            }}
            className="absolute top-12 left-4 right-4 bg-primary-500 rounded-lg p-4 z-50 shadow-lg"
        >
            <Text className="text-white font-rubik-bold">{visibleNotification.title}</Text>
            <Text className="text-white font-rubik-regular mt-1">{visibleNotification.message}</Text>
        </TouchableOpacity>
    );
};