import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {useFavourites} from "@/lib/favourite-context";
import icons from "@/constants/icons";
import {router} from "expo-router";
import {FavouritesCard} from "@/components/Cards";

const Favourites = () => {
    const {favourites, removeFromFavourites} = useFavourites();
    return (
        <SafeAreaView className="h-full bg-white">
            <View className="flex-1 px-5">
                <View className="flex-row items-center justify-between mt-5 mb-4">
                    <TouchableOpacity onPress={() => router.push('/profile')}>
                        <Image source={icons.backArrow} className="size-5" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-rubik-semibold">Favourites</Text>
                    <Text className="text-base font-rubik-medium text-gray-500">
                        {favourites.length} {favourites.length <= 1 ? 'property' : 'properties'}
                    </Text>
                </View>

                {favourites.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-400 font-rubik-semibold mb-2">It's a little lonely here. Add favourites</Text>
                        <TouchableOpacity className="flex flex-row items-center gap-3 bg-primary-300 h-12 w-48 rounded-lg px-2" onPress={() => router.back()}>
                            <Image source={icons.property} className="size-6" tintColor="white"/>
                            <Text className="text-base text-center text-white">Back To Properties</Text>
                        </TouchableOpacity>
                    </View>
                ): (
                    <FlatList
                        data={favourites}
                        renderItem={({item}) => (
                        <View>
                            <FavouritesCard
                                item={item.property}
                                onPress={() => router.push(`/properties/${item.property.$id}`)}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    removeFromFavourites(item.property.$id);
                                }}
                                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm">
                                <Image source={icons.heartFill} className="size-5"/>
                            </TouchableOpacity>
                        </View>
                        )}
                        contentContainerClassName="pb-20"
                    />
                )}
            </View>
        </SafeAreaView>
    )
}
export default Favourites
