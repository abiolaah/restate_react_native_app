import {View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList} from 'react-native'
import React, {useState} from 'react'
import {router} from "expo-router";
import icons from "@/constants/icons";
import {getUserBookings} from "@/lib/appwrite";
import {useAppwrite} from "@/lib/useAppwrite";
import {SafeAreaView} from "react-native-safe-area-context";
import {Calendar, DateData} from "react-native-calendars";
import {TodaysBookings} from "@/components/TodaysBookings";
import {formatDateForDisplay} from "@/lib/timezone-converter";
import {BookingItem} from "@/components/BookingItem";
import {DayBookingList} from "@/components/DayBookingList";

interface MarkedDatesProps{
    [date: string]: {
        marked: boolean;
        dotColor: string;
        selected?: boolean;
        selectedColor?: string;
    }
}

const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Completed: 'bg-blue-100 text-blue-800'
};

const Bookings = () => {
    const { data: bookings, loading, refetch } = useAppwrite<Booking[]>({
        fn:  getUserBookings
    });
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [selectedDayBookings, setSelectedDayBookings] = useState<Booking[]>([]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const markedDates: MarkedDatesProps = bookings?.reduce((acc: MarkedDatesProps, booking) => {
        const date = formatDateForDisplay(booking.date) // Format date as YYYY-MM-DD
        acc[date] = {
            marked: true,
            dotColor: booking.status === 'Confirmed' ? 'green' :
                booking.status === 'Pending' ? 'yellow' :
                    booking.status === 'Cancelled' ? 'red' : 'blue',
            selected: false,
            selectedColor: '#0061FF',
        };
        return acc;
    }, {} as MarkedDatesProps) || {};

    // Explicitly check for empty array (not just falsy value)
    const hasBookings = Array.isArray(bookings) && bookings.length > 0;


    const handleDayPress = (day: DateData) => {
        // Use the exact date string from the calendar (YYYY-MM-DD format)
        const selectedDateString = day.dateString;
        const dayBookings = bookings?.filter(booking => {
            const bookingDate = formatDateForDisplay(booking.date);
            return bookingDate === selectedDateString;
        }) || [];
        setSelectedDayBookings(dayBookings);
    }

    // Custom Pressable component to avoid navigation context issues
    const ViewModeButton = ({
                                mode,
                                currentMode,
                                onPress
                            }: {
        mode: 'list' | 'calendar';
        currentMode: 'list' | 'calendar';
        onPress: () => void;
    }) => {
        const isActive = mode === currentMode;
        return (
            <View
                className={`px-3 py-1 rounded-full ${isActive ? 'bg-white shadow-sm' : ''}`}
                onTouchEnd={onPress} // Using onTouchEnd instead of onPress
            >
                <Image source={mode === 'list' ? icons.list : icons.calendar} className={`size-5`} />
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 p-4">
            {/* Header with view toggle */}
            <View className="flex flex-row justify-between items-center mb-4">
                <View className="flex flex-row items-center gap-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2"
                    >
                        <Image source={icons.backArrow} className="size-6" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold">My Bookings</Text>
                </View>

                {/* View mode toggle buttons */}
                <View className="flex flex-row bg-gray-100 rounded-full p-1">
                    <ViewModeButton
                        mode="list"
                        currentMode={viewMode}
                        onPress={() => setViewMode('list')}
                    />
                    <ViewModeButton
                        mode="calendar"
                        currentMode={viewMode}
                        onPress={() => setViewMode('calendar')}
                    />
                </View>
            </View>

            {!hasBookings ? (
                <View className="flex-1 justify-center items-center">
                    <Image source={icons.calendar} className="w-20 h-20 opacity-30 mb-4" />
                    <Text className="text-lg text-gray-500">No bookings yet</Text>
                    <TouchableOpacity
                        className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
                        onPress={() => router.push('/')}
                    >
                        <Text className="text-white">Browse Properties</Text>
                    </TouchableOpacity>
                </View>
            ) : viewMode === 'list' ? (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.$id}
                    refreshing={loading}
                    onRefresh={refetch}
                    renderItem={({ item }) => (
                        <BookingItem booking={item} onPress={() => item.propertyId && router.push(`/properties/${item.propertyId}`)} />
                    )}
                />
            ) : (
                <View className="flex-1">
                    <Calendar
                        markedDates={markedDates}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#b6c1cd',
                            selectedDayBackgroundColor: '#3b82f6',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#3b82f6',
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#d9e1e8',
                            dotColor: '#3b82f6',
                            selectedDotColor: '#ffffff',
                            arrowColor: '#3b82f6',
                            monthTextColor: '#3b82f6',
                            indicatorColor: '#3b82f6',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 16
                        }}
                        onDayPress={handleDayPress}
                    />

                    {/* Selected Day's Bookings (replaces the modal) */}
                    {selectedDayBookings.length > 0 && (
                        <View className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <Text className="text-lg font-bold mb-2">
                                Bookings for {selectedDayBookings[0].date.split('T')[0]}
                            </Text>

                            {selectedDayBookings.map(booking => (
                                <DayBookingList key={booking.$id} booking={booking} />
                            ))}
                        </View>
                    )}

                    {/* Today's bookings sections*/}
                    <TodaysBookings bookings={bookings} />
                </View>
            )}
        </SafeAreaView>
    )
}
export default Bookings
