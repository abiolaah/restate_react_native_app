// components/NotificationBell.tsx
import { View, TouchableOpacity, Image } from 'react-native';
import { useNotifications } from '@/lib/notification-context';
import icons from '@/constants/icons';
import { router } from 'expo-router';

export const NotificationBell = () => {
    const { unreadCount } = useNotifications();

    return (
        <View className="relative">
            <TouchableOpacity onPress={() => router.push("/notifications")}>
                <Image source={icons.bell} className="size-5" />
            </TouchableOpacity>
            {unreadCount > 0 && (
                <View className="absolute -top-1 -right-0.5 bg-primary-300 rounded-full w-2 h-2" />
            )}
        </View>
    );
};