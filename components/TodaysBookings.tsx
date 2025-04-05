import {View, Text} from "react-native";
import {router} from "expo-router";
import {BookingItem} from "@/components/BookingItem";

export const TodaysBookings = ({ bookings }: { bookings: Booking[] }) => {
    const todaysBookings = bookings?.filter(booking => {
        const today = new Date().toISOString().split('T')[0];
        const bookingDate = new Date(booking.date).toISOString().split('T')[0];
        return bookingDate === today;
    }) || [];

    if (todaysBookings.length === 0) return null;

    return (
        <View className="mt-4">
            <Text className="text-lg font-bold mb-2">Today's Bookings</Text>
            {todaysBookings.map(booking => (
                <BookingItem
                    key={booking.$id}
                    booking={booking}
                    onPress={() => {
                        if (booking.propertyId) {
                            router.push(`/properties/${booking.propertyId}`);
                        }
                    }}
                />
            ))}
        </View>
    );
};