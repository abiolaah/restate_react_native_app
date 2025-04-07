import {View, Text, Modal, TouchableOpacity, Share, Image} from 'react-native'
import React from 'react'
import Toast from "react-native-toast-message";
import icons from "@/constants/icons";

export const ShareModal = ({visible, onClose}: {visible: boolean; onClose: () => void}) => {
    const handleShare = async () => {
        try {
            await Share.share({
                message: 'Check out this property!',
                url: 'https://github.com/abiolaah/restate_react_native_app/blob/main/README.md' // Replace with actual link
            });
            onClose();
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleCopy = () => {
        // Add actual copy functionality here
        Toast.show({
            type: 'success',
            text1: 'Copied to clipboard'
        });
        onClose();
    };

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white p-5 rounded-xl w-full max-w-md">
                    <View className="flex flex-row items-center justify-between px-4 py-2">
                        <Text className="text-xl font-rubik-bold text-black-300">Share</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Image source={icons.close} className="size-6" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex flex-row items-center justify-between border border-primary-200 rounded-lg p-3">
                        <Text className='text-base font-rubik flex-1 mr-2' numberOfLines={1} ellipsizeMode='tail'>https://github.com/abiolaah/restate_react_native_app/blob/main/README.md</Text>
                        <TouchableOpacity
                            onPress={handleCopy}
                            className="bg-primary-300 rounded-lg items-center justify-center px-4 py-2"
                        >
                            <Text className="text-white text-lg font-rubik-extrabold uppercase">Copy</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={handleShare}
                        className="bg-primary-300 py-3 rounded-lg items-center justify-center mt-4"
                    >
                        <Text className="text-white text-lg font-rubik-bold">Share via...</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
