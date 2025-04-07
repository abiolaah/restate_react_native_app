import {View, Text, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import images from "@/constants/images";
import icons from "@/constants/icons";
import {Models} from "react-native-appwrite";
import {useFavourites} from "@/lib/favourite-context";

interface Props {
    item: Models.Document;
    onPress?: () => void;
}

export const FeaturedCard = ({item: {$id, image, rating, name, address, price}, onPress}: Props) => {
    const {addToFavourites, removeFromFavourites, isInFavourites} = useFavourites();
    const isFavourite = isInFavourites($id);
    const handleFavouritePress = () => {
        if (isFavourite) {
            removeFromFavourites($id);
        } else {
            addToFavourites({ $id, name, address, price, image });
        }
    };
    return (
        <TouchableOpacity onPress={onPress} className="flex flex-col items-start w-60 h-80 relative">
            <Image source={{uri: image}} className="size-full rounded-2xl" />
            <Image source={images.cardGradient} className="size-full rounded-2xl absolute bottom-0"/>

            <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
                <Image source={icons.star} className="size-3.5" />
                <Text className="text-xs font-rubik-bold text-primary-300 ml-1">{rating}</Text>
            </View>

            <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
                <Text className="text-xl font-rubik-extrabold text-white" numberOfLines={1}>{name}</Text>
                <Text className="text-base font-rubik text-white">
                    {address}
                </Text>

                <View className="flex flex-row items-center justify-between w-full">
                    <Text className="text-xl font-rubik-extrabold text-white">
                        ${price}
                    </Text>
                    <TouchableOpacity onPress={handleFavouritePress}>
                        <Image source={isFavourite ? icons.heartFill : icons.heart} className={isFavourite ? "size-8" : "size-5"} tintColor={isFavourite ? "#FF0000" : "#FFFFFF"} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}


export const Card = ({item: {$id,image, rating, name, address, price}, onPress}: Props) => {
    const {addToFavourites, removeFromFavourites, isInFavourites} = useFavourites();
    const isFavourite = isInFavourites($id);
    const handleFavouritePress = () => {
        if (isFavourite) {
            removeFromFavourites($id);
        } else {
            addToFavourites({ $id, name, address, price, image });
        }
    };
    return (
        <TouchableOpacity onPress={onPress} className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative">
            <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
                <Image source={icons.star} className="size-2.5" />
                <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">{rating}</Text>
            </View>

            <Image source={{uri:image}} className="w-full h-40 rounded-lg" />

            <View className="flex flex-col mt-2">
                <Text className="text-base font-rubik-bold text-black-300">{name}</Text>
                <Text className="text-xs font-rubik text-black-200">
                    {address}
                </Text>

                <View className="flex flex-row items-center justify-between mt-2">
                    <Text className="text-base font-rubik-bold text-primary-300">
                        ${price}
                    </Text>
                    <TouchableOpacity onPress={handleFavouritePress}>
                        <Image source={isFavourite ? icons.heartFill : icons.heart} className={isFavourite ? "size-8" : "size-5"} tintColor={isFavourite ? "#FF0000" : "#191d31"} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}


export const FavouritesCard = ({item, onPress}: { item: PropertyProps; onPress: () => void; }) => {
    const { removeFromFavourites} = useFavourites();
    return (
        <TouchableOpacity onPress={onPress} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <View className="relative">
                <Image source={{uri:item.image}} className="w-full h-40 rounded-t-xl" resizeMode="cover" />
                <TouchableOpacity onPress={() =>  removeFromFavourites(item.$id)}  className="absolute top-2 right-2 bg-white/80 rounded-full p-2">
                    <Image source={ icons.heartFill} className="size-5" />
                </TouchableOpacity>
            </View>

            <View className="p-3">
                <Text className="font-rubik-bold text-lg">${item.price.toLocaleString()}</Text>
                <Text className="font-rubik-medium text-base">{item.name}</Text>
                <Text className="font-rubik-regular text-gray-500 text-sm">{item.address}</Text>
            </View>
        </TouchableOpacity>
    )
}
