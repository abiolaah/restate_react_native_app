import {Modal, TouchableOpacity, View, Text, FlatList} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {BookingItem} from "@/components/BookingItem";

export const DayBookingsModal = ({ visible, onClose, bookings }: {
    visible: boolean;
    onClose: () => void;
    bookings: Booking[];
}) => (
    <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={onClose}
    >
        <SafeAreaView className="flex-1 bg-white">
            <View className="p-4">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-bold">Bookings</Text>
                    <TouchableOpacity onPress={onClose} className="p-2">
                        <Text className="text-blue-500">Close</Text>
                    </TouchableOpacity>
                </View>

                {bookings.length > 0 ? (
                    <FlatList
                        data={bookings}
                        keyExtractor={(item) => item.$id}
                        renderItem={({ item }) => (
                            <BookingItem
                                booking={item}
                                onPress={() => {
                                    onClose();
                                    if (item.propertyId) {
                                        router.push(`/properties/${item.propertyId}`);
                                    }
                                }}
                            />
                        )}
                    />
                ) : (
                    <View className="flex-1 justify-center items-center mt-10">
                        <Text className="text-gray-500">No bookings for this day</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    </Modal>
);