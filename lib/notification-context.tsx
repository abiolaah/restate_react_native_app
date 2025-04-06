// lib/notification-context.tsx
import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NotificationContextType = {
    notifications: NotificationProps[];
    addNotification: (notification: NotificationInput) => void;
    markAsRead: (id: string) => void;
    unreadCount: number;
    clearAll: () => void;
};

const STORAGE_KEY = 'app_notifications';

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    addNotification: () => {},
    markAsRead: () => {},
    unreadCount: 0,
    clearAll: () => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);

    // Load notifications from storage on mount
    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setNotifications(JSON.parse(stored));
                }
            } catch (error) {
                console.error('Failed to load notifications', error);
            }
        };
        loadNotifications();
    }, []);

    // Save to storage whenever notifications change
    useEffect(() => {
        const saveNotifications = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
            } catch (error) {
                console.error('Failed to save notifications', error);
            }
        };
        saveNotifications();
    }, [notifications]);

    const addNotification = (notification: NotificationInput) => {
        const newNotification: NotificationProps = {
            ...notification,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date(),
            read: false,
        };

        setNotifications(prev => [newNotification, ...prev]);

    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const clearAll = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{ notifications, addNotification, markAsRead, unreadCount, clearAll }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);