import {View, Text, TouchableOpacity, Image, ScrollView, TextInput, Linking} from 'react-native'
import React, {useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import { router } from "expo-router";
import icons from "@/constants/icons";

// Sample FAQ data for real estate app
const faqs = [
    {
        question: "How do I schedule a property viewing?",
        answer: "You can schedule viewings directly through the property details page by clicking the 'Book Now' button and selecting your preferred date and time."
    },
    {
        question: "What payment methods are accepted for deposits?",
        answer: "We accept credit/debit cards, bank transfers, and certified checks for property deposits. All transactions are secured through our payment gateway."
    },
    {
        question: "How can I contact a property agent?",
        answer: "Each property listing shows the assigned agent. You can contact them via the 'Chat icon' button or call their direct line provided in the contact details."
    },
    {
        question: "Is my personal information secure?",
        answer: "Yes, we use industry-standard encryption to protect all personal and financial information. Your data will never be shared without your consent."
    },
    {
        question: "What happens if I need to cancel a viewing?",
        answer: "You can cancel or reschedule viewings up to 24 hours in advance through your bookings page. Late cancellations may affect your booking privileges."
    }
];

const HelpCenter = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <SafeAreaView className="px-5 bg-gray-50">
            {/*Header*/}
            <View className="flex flex-row items-center gap-6 py-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2"
                >
                    <Image source={icons.backArrow} className="size-6" />
                </TouchableOpacity>
                <Text className="text-2xl font-rubik-bold text-primary-500">Help Center</Text>
            </View>

            {/*Body*/}
            <ScrollView showsVerticalScrollIndicator={false} className="pb-10">

                {/*FAQ*/}
                <View className="bg-white rounded-xl shadow-sm p-6 mt-4 mb-6">
                    <Text className="text-xl text-primary-500 text-center font-rubik-bold mb-6">
                        Frequently Asked Questions
                    </Text>

                    {faqs.map((faq, index) => (
                        <View key={index} className="mb-4 border-b border-gray-100 pb-4">
                            <TouchableOpacity
                                onPress={() => toggleAccordion(index)}
                                className="flex-row justify-between items-center"
                            >
                                <Text className="text-base font-rubik-medium text-gray-800 flex-1">
                                    {faq.question}
                                </Text>
                                <Image
                                    source={expandedIndex === index ? icons.chevronUp : icons.chevronDown}
                                    className="size-5 ml-2"
                                />
                            </TouchableOpacity>

                            {expandedIndex === index && (
                                <View className="mt-3">
                                    <Text className="text-gray-600 font-rubik-regular">
                                        {faq.answer}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/*Contact Form*/}
                <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <Text className="text-xl text-primary-500 text-center font-rubik-bold mb-6">
                        Contact Our Support Team
                    </Text>

                    <View className="flex flex-col gap-5">
                        <View>
                            <Text className="text-base font-rubik-medium text-gray-800 mb-2">Name</Text>
                            <TextInput
                                className="border border-gray-200 rounded-lg p-4 font-rubik-regular bg-gray-50"
                                value={name}
                                onChangeText={setName}
                                placeholder="Your full name"
                            />
                        </View>

                        <View>
                            <Text className="text-base font-rubik-medium text-gray-800 mb-2">Email</Text>
                            <TextInput
                                className="border border-gray-200 rounded-lg p-4 font-rubik-regular bg-gray-50"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Your email address"
                                keyboardType="email-address"
                            />
                        </View>

                        <View>
                            <Text className="text-base font-rubik-medium text-gray-800 mb-2">Message</Text>
                            <TextInput
                                className="border border-gray-200 rounded-lg p-4 font-rubik-regular bg-gray-50 min-h-[120px]"
                                value={message}
                                onChangeText={setMessage}
                                placeholder="How can we help you?"
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <TouchableOpacity
                            className="mt-2 rounded-lg bg-primary-300 h-14 justify-center items-center shadow-sm"
                        >
                            <Text className="text-white font-rubik-medium text-lg">Send Message</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/*Contact Details*/}
                <View className="bg-white rounded-xl shadow-sm p-6 mb-10">
                    <Text className="text-xl text-primary-500 text-center font-rubik-bold mb-6">
                        Direct Contact Options
                    </Text>

                    <View className="space-y-6">
                        <View>
                            <Text className="text-base font-rubik-medium text-gray-800 mb-3">Phone Support</Text>
                            <View className="flex-row items-center gap-4">
                                <TouchableOpacity
                                    onPress={() => Linking.openURL('tel:5555555555')}
                                    className="flex-row items-center"
                                >
                                    <Image source={icons.phone} className="size-5 mr-2" />
                                    <Text className="text-blue-500 font-rubik-medium">
                                        555-555-5555
                                    </Text>
                                </TouchableOpacity>
                                <Text className="text-gray-400">|</Text>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL('sms:5555555555')}
                                    className="flex-row items-center"
                                >
                                    <Image source={icons.message} className="size-5 mr-2" />
                                    <Text className="text-blue-500 font-rubik-medium">
                                        Send Text Message
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View>
                            <Text className="text-base font-rubik-medium text-gray-800 mb-3">Email Support</Text>
                            <TouchableOpacity
                                onPress={() => Linking.openURL('mailto:admin@gmail.com')}
                                className="flex-row items-center"
                            >
                                <Image source={icons.email} className="size-5 mr-2" />
                                <Text className="text-blue-500 font-rubik-medium">
                                    admin@gmail.com
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Text className="text-base font-rubik-medium text-gray-800 mb-3">Office Hours</Text>
                            <Text className="text-gray-600 font-rubik-regular">
                                Monday - Friday: 9:00 AM - 6:00 PM{"\n"}
                                Saturday: 10:00 AM - 4:00 PM{"\n"}
                                Sunday: Closed
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HelpCenter