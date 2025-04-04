import {View, Text, TouchableOpacity, Image, ScrollView, TextInput, Alert} from 'react-native'
import React, {useEffect, useState} from 'react'
import icons from "@/constants/icons";
import {router} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {useGlobalContext} from "@/lib/global-provider";
import {account, createUserProfile, getUserProfile, updateUserProfile, uploadProfileImage} from "@/lib/appwrite";
import * as ImagePicker from 'expo-image-picker';
import Toast from "react-native-toast-message";

const ProfileDetails = () => {
    const {user, refetch} = useGlobalContext();
    const userDisplayName = user?.name.split(" ")[0];
    const [name, setName] = useState(user?.name || '');
    const [displayName, setDisplayName] = useState(userDisplayName|| '');
    const [profilePicture, setProfilePicture] = useState(user?.avatar || '');
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        const loadUserProfile = async () => {
            if (user?.$id) {
                const profile = await getUserProfile(user.$id);
                setUserProfile(profile);
                if (profile) {
                    setName(profile.name);
                    setDisplayName(profile.displayName);
                    if (profile.avatar) {
                        setProfilePicture(profile.avatar);
                    }
                }
            }
        };

        loadUserProfile();
    }, [user?.$id])

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'We need access to your photos to set a profile picture');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [1,1],
            quality: 1,
        });

        if(!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
    };

    const saveProfile =async () => {
        if (!name.trim() || !displayName.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Name and display name cannot be empty'
            });
            return;
        }

        setIsLoading(true);

        try {
            let imageUrl = profilePicture;

            // Upload new image if it's a local URI
            if (profilePicture.startsWith('file://')) {
                imageUrl = await uploadProfileImage(profilePicture);
            }

            //Check if profile exist and update/create accordingly
            if(user?.$id){
                const existingProfile = await getUserProfile(user.$id);

                if (existingProfile) {
                    //update existing profile
                    await updateUserProfile({
                        profileId: userProfile.$id,
                        name,
                        displayName,
                        avatar: imageUrl
                    });
                } else {
                    //Create new profile
                    await createUserProfile({
                        userId: user.$id,
                        name,
                        displayName,
                        avatar: imageUrl
                    });
                }

                //Also update the auth user's name
                await account.updateName(name);
            }

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Profile updated successfully'
            });

            // Refresh user data
            await refetch();

            // Navigate back to profile screen
            router.push('/profile');

        } catch (error) {
            console.error('Error saving profile:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update profile'
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView className="h-full bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-32 px-7"
            >
                <View className="flex flex-row items-center justify-between mt-5">
                    <TouchableOpacity onPress={() => router.push('/profile')}>
                        <Image source={icons.backArrow} className="size-6" />
                    </TouchableOpacity>
                    <Text className="text-xl font-rubik-bold text-center">Edit Profile</Text>
                    <Text></Text>
                </View>

                <View className="flex-row justify-center flex mt-5">
                    <View className="flex flex-col items-center relative mt-5">
                        <Image
                            source={{ uri: profilePicture }}
                            className="size-44 rounded-full"
                        />
                        <TouchableOpacity
                            className="absolute bottom-2 right-2 bg-primary-500 p-2 rounded-full"
                            onPress={pickImage}
                        >
                            <Image source={icons.edit} className="size-5" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mt-8">
                    <Text className="text-lg font-rubik-medium mb-2">Full Name</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 font-rubik-regular"
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your full name"
                    />
                    <Text className="text-lg font-rubik-medium mb-2 mt-2">Display Name</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 font-rubik-regular"
                        value={displayName}
                        onChangeText={setDisplayName}
                        placeholder="Enter your display name"
                    />
                </View>

                <TouchableOpacity
                    className="bg-primary-300 p-4 rounded-lg mt-8 items-center"
                    onPress={saveProfile}
                    disabled={isLoading}
                >
                    <Text className="text-white font-rubik-medium text-lg">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}
export default ProfileDetails
