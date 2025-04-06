import {ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import {Card, FeaturedCard} from "@/components/Cards";
import Filters from "@/components/Filters";
import {router, useLocalSearchParams} from "expo-router";
import {useAppwrite} from "@/lib/useAppwrite";
import {getLatestProperties, getProperties} from "@/lib/appwrite";
import {useEffect} from "react";
import NoResults from "@/components/NoResults";

export default function Explore() {

    // Update the params type at the top of the file
    const params = useLocalSearchParams<{
        query?: string;
        filter?: string;
        minPrice?: string;
        maxPrice?: string;
        types?: string;
        minBedrooms?: string;
        minBathrooms?: string;
        minSize?: string;
        maxSize?: string;
    }>();

    const {data: properties, loading, refetch} = useAppwrite({
        fn: getProperties,
        params: {
            filter: params.filter || 'All',
            query: params.query || '',
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            types: params.types,
            minBedrooms: params.minBedrooms,
            minBathrooms: params.minBathrooms,
            minSize: params.minSize,
            maxSize: params.maxSize,
            limit: 20
        },
        skip: true,
    });

    const handleCardPress = (id: string) => router.push(`/properties/${id}`)

        // Update the useEffect to include all params
    useEffect(() => {
        refetch({
            filter: params.filter || 'All',
            query: params.query || '',
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            types: params.types,
            minBedrooms: params.minBedrooms,
            minBathrooms: params.minBathrooms,
            minSize: params.minSize,
            maxSize: params.maxSize,
            limit: 20
        });
    }, [params.filter, params.query, params.minPrice, params.maxPrice, params.types, params.minBedrooms, params.minBathrooms, params.minSize, params.maxSize]);

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={properties}
                renderItem={({ item }) => (<Card item={item} onPress={() => handleCardPress(item.$id)} />)}
                keyExtractor={(item) => item.$id}
                numColumns={2}
                contentContainerClassName="pb-32"
                columnWrapperClassName="flex gap-5 px-5"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" className="text-primary-300 mt-5" />
                    ): <NoResults />
                }
                ListHeaderComponent={
                    <View className="px-5">
                        <View className="flex flex-row items-center justify-between mt-5">
                            <TouchableOpacity onPress={() => router.back()} className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center">
                                <Image source={icons.backArrow} className="size-5" />
                            </TouchableOpacity>

                            <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">Search for Your Ideal Home</Text>

                            <TouchableOpacity onPress={() => router.push("/notifications")}>
                                <Image source={icons.bell} className="size-5" />
                            </TouchableOpacity>
                        </View>
                        <Search />

                        <View className="mt-5">
                            <Filters />
                            <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                                Found {properties?.length} Properties
                            </Text>
                        </View>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
