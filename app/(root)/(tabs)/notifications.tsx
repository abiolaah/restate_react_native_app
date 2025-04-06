// app/(tabs)/notifications.tsx
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNotifications } from '@/lib/notification-context';
import { format } from 'date-fns';
import { router } from 'expo-router';
import {SafeAreaView} from "react-native-safe-area-context";

export default function NotificationsScreen() {
    const { notifications, markAsRead, unreadCount, clearAll } = useNotifications();

    return (
        <SafeAreaView className="h-full bg-white">
            <View className="flex-1 bg-gray-50">
                <View className="flex-row items-center justify-between px-4 pt-4">
                    <Text className="text-2xl font-rubik-bold">Notifications</Text>
                    {unreadCount > 0 && (
                        <TouchableOpacity onPress={clearAll} className="px-3 py-1 bg-primary-100 rounded-full">
                            <Text className="text-primary-500 font-rubik-medium">Mark all as read</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {notifications.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-400 font-rubik-regular">No notifications yet</Text>
                    </View>
                ) : (
                    <FlatList
                        data={notifications}
                        keyExtractor={item => item.id}
                        contentContainerClassName="p-4"
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    markAsRead(item.id);
                                    if (item.type === 'booking' && item.relatedId) {
                                        router.push(`/properties/${item.relatedId}`);
                                    }
                                }}
                                className={`p-4 mb-3 rounded-xl ${item.read ? 'bg-green-50 border-l-4 border-green-400' : 'bg-blue-50 border-l-4 border-primary-300'}`}
                            >
                                <View className="flex-row justify-between">
                                    <Text className={`font-rubik-medium ${item.read ? 'text-gray-800' : 'text-black'}`}>
                                        {item.title}
                                    </Text>
                                    {!item.read && (
                                        <View className="w-2 h-2 rounded-full bg-primary-500" />
                                    )}
                                </View>
                                <Text className="text-gray-600 mt-1 font-rubik-regular">{item.message}</Text>
                                <Text className="text-gray-400 text-xs mt-2 font-rubik-regular">
                                    {format(new Date(item.createdAt), 'MMM d, h:mm a')}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}