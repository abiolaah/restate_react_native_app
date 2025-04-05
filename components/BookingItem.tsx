import {TouchableOpacity, View, Text} from "react-native";

const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Completed: 'bg-blue-100 text-blue-800'
};

export const BookingItem = ({ booking, onPress }: { booking: Booking; onPress: () => void }) => (
    <TouchableOpacity
        className="border border-gray-200 rounded-lg p-4 mb-4"
        onPress={onPress}
    >
        <View className="flex-row justify-between">
            <Text className="text-lg font-bold flex-1">
                {booking.property?.name || 'Property No Longer Available'}
            </Text>
            <View className={`px-2 py-1 rounded-full ${statusColors[booking.status]}`}>
                <Text className="text-xs font-semibold capitalize">
                    {booking.status}
                </Text>
            </View>
        </View>
        <Text className="text-gray-600 mt-1">
            Agent: {booking.agent?.name || 'Agent'}
        </Text>
        <Text className="text-gray-600 mt-1">
            Date: {new Date(booking.date).toLocaleDateString()} at {booking.time}
        </Text>
        {booking.notes && (
            <Text className="text-gray-600 mt-1">
                Notes: {booking.notes}
            </Text>
        )}
    </TouchableOpacity>
);