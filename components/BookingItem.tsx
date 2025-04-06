import {TouchableOpacity, View, Text, Alert} from "react-native";
import {formatDateForListDisplay} from "@/lib/timezone-converter";
import Toast from "react-native-toast-message";
import {updateBooking} from "@/lib/appwrite";
import {useState} from "react";
import BookingDrawer from "@/components/BookingDrawer";
import {useNotifications} from "@/lib/notification-context";

const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Completed: 'bg-blue-100 text-blue-800'
};

export const BookingItem = ({ booking, onPress, onUpdate }: { booking: Booking; onPress: () => void; onUpdate: () => void; }) => {
    const [showReschedule, setShowReschedule] = useState(false);
    const { addNotification } = useNotifications();


    const canModifyBooking = () => {
        if (booking.status === 'Cancelled' || booking.status === 'Completed') {
            return false;
        }

        const bookingDate = new Date(booking.date);
        const now = new Date();
        const timeDifference = bookingDate.getTime() - now.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        return hoursDifference > 24;
    };

    const handleCancel = async () => {
        if (!canModifyBooking()) {
            Toast.show({
                type: "error",
                text1: 'Cannot cancel',
                text2: 'You can only cancel bookings more than 24 hours in advance.',
            })
            return;
        }

        Alert.alert(
            "Confirm Cancellation",
            "Are you sure you want to cancel this booking?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            await updateBooking(booking.$id, { status: 'Cancelled' });
                            Toast.show({
                                type: "success",
                                text1: "Cancelled",
                                text2: "Booking has been cancelled"
                            })
                            onUpdate();
                            addNotification({
                                title: 'Cancelled Booking',
                                message: `Your booking for ${booking.property?.name} on ${booking.date} at ${booking.time} has been cancelled`,
                                type: "booking",
                                relatedId: booking.propertyId
                            });
                        } catch (error) {
                            Toast.show({
                                type: "error",
                                text1: "Error",
                                text2: "Failed to cancel booking"
                            })
                        }
                    }
                }
            ]
        );
    };

    return (
        <View className="border border-gray-200 rounded-lg p-4 mb-4">
            <TouchableOpacity onPress={onPress}>
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
                    Date: {formatDateForListDisplay(booking.date)} at {booking.time}
                </Text>
                {booking.notes && (
                    <Text className="text-gray-600 mt-1">
                        Notes: {booking.notes}
                    </Text>
                )}
            </TouchableOpacity>

            {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                <View className="flex-row mt-3 space-x-2 gap-2">
                    <TouchableOpacity
                        className={`flex-1 py-2 rounded-lg items-center ${canModifyBooking() ? 'bg-danger' : 'bg-gray-500'}`}
                        onPress={handleCancel}
                        disabled={!canModifyBooking()}
                    >
                        <Text className="text-white">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 py-2 rounded-lg items-center ${canModifyBooking() ? 'bg-primary-300' : 'bg-gray-500'}`}
                        onPress={() => {
                            if (!canModifyBooking()) {
                                Alert.alert(
                                    "Cannot Reschedule",
                                    "You can only reschedule bookings more than 24 hours in advance."
                                );
                                return;
                            }
                           setShowReschedule(true);
                        }}
                        disabled={!canModifyBooking()}
                    >
                        <Text className="text-white">Reschedule</Text>
                    </TouchableOpacity>

                    {showReschedule && (
                        <BookingDrawer
                            visible={showReschedule}
                            onClose={() => setShowReschedule(false)}
                            onUpdate={onUpdate}
                            property={booking.property}
                            isReschedule={true}
                            bookingToReschedule={booking}
                        />
                    )}
                </View>
            )}
        </View>
    );
}
