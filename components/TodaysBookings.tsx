import {View, Text, TouchableOpacity} from "react-native";
import {router} from "expo-router";
import {formatLocalDate} from "@/lib/timezone-converter";

export const TodaysBookings = ({ bookings }: { bookings: Booking[] }) => {
    const now = new Date();
    const todayString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
        .toISOString().split('T')[0];

    const todaysBookings = bookings?.filter(booking => {
        // Compare the raw date strings (both in UTC)
        return booking.date.split('T')[0] === todayString;
    }) || [];

    if (todaysBookings.length === 0) return null;

    return (
        <View className="mt-4 p-4 bg-gray-50 rounded-lg">
            <Text className="text-lg font-bold mb-2">Today's Bookings</Text>
            {todaysBookings.map(booking => (
                <TouchableOpacity
                    key={booking.$id}
                    className="border border-gray-200 rounded-lg p-3 mb-2"
                    onPress={() => {
                        if (booking.propertyId) {
                            router.push(`/properties/${booking.propertyId}`);
                        }
                    }}
                >
                    <Text className="font-semibold">
                        {booking.property?.name || 'Property'}
                    </Text>
                    <Text className="text-gray-600">
                        {formatLocalDate(booking.date)} - {booking.time} ({booking.status})
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};