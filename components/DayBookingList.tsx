import {View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import {router} from "expo-router";

const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Completed: 'bg-blue-100 text-blue-800'
};

export const DayBookingList = ({ booking}: { booking: Booking }) => {
    return (
        <TouchableOpacity
            key={booking.$id}
            className="border border-gray-200 rounded-lg p-3 mb-2"
            onPress={() => {
                if (booking.propertyId) {
                    router.push(`/properties/${booking.propertyId}`);
                }
            }}
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
                {booking.time}
            </Text>
        </TouchableOpacity>
    )
}
