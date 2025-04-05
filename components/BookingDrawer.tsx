import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import { useGlobalContext } from '@/lib/global-provider';
import { createBooking } from '@/lib/appwrite';
import Toast from "react-native-toast-message";

const timeSlots = [
    '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00',
    '15:00', '16:00'
];

export default function BookingDrawer({
                                          visible,
                                          onClose,
                                          property
                                      }: {
    visible: boolean;
    onClose: () => void;
    property: any;
}) {
    const { user } = useGlobalContext();
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(true);
    const [dateSelected, setDateSelected] = useState(false); // Track if date has been selected
    const [loading, setLoading] = useState(false);

    const handleDateSelect = (event:DateTimePickerEvent, selectedDate: Date | undefined) => {

        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setDateSelected(true); // Mark date as selected
        }
    };


    const handleSubmit = async () => {
        if (!time) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please select a time slot'
            });
            return;
        }

        if (!property?.agent?.$id) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Property agent information is missing'
            });
            return;
        }

        if (!user?.$id) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'User not authenticated'
            });
            return;
        }

        setLoading(true);
        try {
            // Format the date as YYYY-MM-DD without timezone conversion
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

            await createBooking({
                propertyId: property.$id,
                agentId: property.agent.$id,
                date: formattedDate,
                time,
                notes: notes || undefined
            });
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Booking request sent!'
            });

            //Reset form
            setDate(new Date());
            setTime('');
            setNotes('');
            setDateSelected(false);
            onClose();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to create booking'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                onClose();
                setDateSelected(false); // Reset if modal is closed
            }}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white p-6 rounded-t-3xl">
                    <Text className="text-2xl font-bold mb-4">Schedule Viewing</Text>

                    {/* Step 1: Date Selection */}
                    {!dateSelected && (
                        <View>
                            <Text className="text-lg font-semibold mb-4">Select a Date</Text>
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="inline" // Shows calendar view
                                minimumDate={new Date()}
                                onChange={handleDateSelect}
                                textColor="#000000"
                                themeVariant="light"
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                }}
                            />
                            <TouchableOpacity
                                className="mt-4 p-3 bg-gray-100 rounded-lg"
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text className="text-center">Change Date</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Step 2: Time and Notes (only shown after date selection) */}
                    {dateSelected && (
                        <>
                            <View className="mb-4">
                                <Text className="text-lg font-semibold">Selected Date:</Text>
                                <Text className="text-lg">{date.toLocaleDateString()}</Text>
                                <TouchableOpacity
                                    className="mt-2"
                                    onPress={() => {
                                        setDateSelected(false);
                                        setTime('');
                                    }}
                                >
                                    <Text className="text-blue-500">Change Date</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Time Slots */}
                            <Text className="text-lg font-semibold mb-2">Available Times</Text>
                            <View className="flex-row flex-wrap gap-2 mb-4">
                                {timeSlots.map((slot) => (
                                    <TouchableOpacity
                                        key={slot}
                                        className={`p-3 border rounded-lg ${time === slot ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
                                        onPress={() => setTime(slot)}
                                    >
                                        <Text className={time === slot ? 'text-white' : 'text-black'}>
                                            {slot}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Notes */}
                            <TextInput
                                className="border p-3 rounded-lg mb-6 h-24"
                                placeholder="Additional notes (optional)"
                                multiline
                                value={notes}
                                onChangeText={setNotes}
                            />

                            {/* Buttons */}
                            <View className="flex-row justify-between">
                                <TouchableOpacity
                                    className="flex-1 border border-gray-300 p-3 rounded-lg mr-2"
                                    onPress={() => {
                                        onClose();
                                        setDateSelected(false);
                                    }}
                                    disabled={loading}
                                >
                                    <Text className="text-center">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-1 bg-blue-500 p-3 rounded-lg ml-2"
                                    onPress={handleSubmit}
                                    disabled={loading || !time}
                                >
                                    <Text className="text-white text-center">
                                        {loading ? 'Processing...' : 'Confirm Booking'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}