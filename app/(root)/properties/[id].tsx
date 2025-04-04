import {
    FlatList,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Platform, TextInput, Alert, Keyboard, KeyboardAvoidingView, findNodeHandle,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import icons from "@/constants/icons";
import images from "@/constants/images";
import Comment from "@/components/Comment";
import { facilities } from "@/constants/data";

import { useAppwrite } from "@/lib/useAppwrite";
import {createReview, getPropertyById} from "@/lib/appwrite";
import {useEffect, useRef, useState} from "react";
import {useGlobalContext} from "@/lib/global-provider";

const Property = () => {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const scrollViewRef = useRef<ScrollView>(null); // Add this ref
    const reviewsSectionRef = useRef<View>(null);

    const { user } = useGlobalContext();
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(5);
    const [isAddingReview, setIsAddingReview] = useState(false);
    const [isAllComments, setAllComments] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [keyboardOffset, setKeyboardOffset] = useState(0);
    const [scrollOffset, setScrollOffset] = useState(100); // Default offset of 100px


    // Update your useAppwrite hook usage
    const { data: property, refetch } = useAppwrite({
        fn: getPropertyById,
        params: { id: id! },
    });

    useEffect(() => {
        if (property?.reviews) {
            setReviews(property.reviews);
        }
    }, [property]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                setKeyboardOffset(e.endCoordinates.height);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardOffset(0);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleAddReview = async () => {
        if (!newReview.trim()) {
            Alert.alert("Error", "Please enter your review");
            return;
        }

        try {
            setIsAddingReview(true);
            const createdReview = await createReview({
                propertyId: id!,
                name: user?.name || "Anonymous",
                avatar: user?.avatar || "",
                review: newReview,
                rating
            });

            // Update local state immediately with the new review
            setReviews(prev => [...prev, {
                ...createdReview,
                $id: createdReview.$id,
                name: user?.name || "Anonymous",
                avatar: user?.avatar || "",
                review: newReview,
                rating
            }]);

            setNewReview("");
            Alert.alert("Success", "Your review has been added");
            Keyboard.dismiss();
        } catch (error) {
            Alert.alert("Error", "Failed to add review");
        } finally {
            setIsAddingReview(false);
        }
    };

    const scrollToReviews = () => {
        if (reviewsSectionRef.current && scrollViewRef.current) {
            const scrollResponder = scrollViewRef.current.getScrollResponder();
            const scrollNode = scrollViewRef.current.getScrollableNode();
            const reviewsNode = findNodeHandle(reviewsSectionRef.current);

            if (scrollResponder && reviewsNode) {
                scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                    reviewsNode,
                    100, // offset
                    true // animated
                );
            } else {
                // Fallback for older RN versions
                reviewsSectionRef.current.measureLayout(
                    scrollNode,
                    (x, y) => {
                        scrollViewRef.current?.scrollTo({
                            y: y - 100, // Adjust offset as needed
                            animated: true
                        });
                    },
                    () => console.log("Measurement failed")
                );
            }
        }
    };


    const windowHeight = Dimensions.get("window").height;

    // Sort reviews by latest first
    const sortedReviews = [...reviews].sort((a, b) => {
        return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
            <View className="flex-1">
                <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="bg-white"
                contentContainerStyle={{paddingBottom: 120}}
                ref={scrollViewRef}
                >
                    <View className="relative w-full" style={{ height: windowHeight / 2 }}>
                        <Image
                            source={{ uri: property?.image }}
                            className="size-full"
                            resizeMode="cover"
                        />
                        <Image
                            source={images.whiteGradient}
                            className="absolute top-0 w-full z-40"
                        />

                        <View
                            className="z-50 absolute inset-x-7"
                            style={{
                                top: Platform.OS === "ios" ? 70 : 20,
                            }}
                        >
                            <View className="flex flex-row items-center w-full justify-between">
                                <TouchableOpacity
                                    onPress={() => router.back()}
                                    className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
                                >
                                    <Image source={icons.backArrow} className="size-5" />
                                </TouchableOpacity>

                                <View className="flex flex-row items-center gap-3">
                                    <Image
                                        source={icons.heart}
                                        className="size-7"
                                        tintColor={"#191D31"}
                                    />
                                    <Image source={icons.send} className="size-7" />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="px-5 mt-7 flex gap-2">
                    {/*Basic Property details*/}
                        <Text className="text-2xl font-rubik-extrabold">
                            {property?.name}
                        </Text>

                        <View className="flex flex-row items-center gap-3">
                            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
                            <Text className="text-xs font-rubik-bold text-primary-300">
                                {property?.type}
                            </Text>
                        </View>

                            <View className="flex flex-row items-center gap-2">
                                <Image source={icons.star} className="size-5" />
                                <TouchableOpacity
                                    onPress={scrollToReviews}
                                >
                                    <Text className="text-black-200 text-sm mt-1 font-rubik-medium">
                                        {property?.rating} ({reviews.length} reviews)
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/*Basic Property Info e.g area, beds and bath*/}
                        <View className="flex flex-row items-center mt-5">
                            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10">
                                <Image source={icons.bed} className="size-4" />
                            </View>
                            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
                                {property?.bedrooms} Beds
                            </Text>
                            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7">
                                <Image source={icons.bath} className="size-4" />
                            </View>
                            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
                                {property?.bathrooms} Baths
                            </Text>
                            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7">
                                <Image source={icons.area} className="size-4" />
                            </View>
                            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
                                {property?.area} sqft
                            </Text>
                        </View>

                        {/*Agent details*/}
                        <View className="w-full border-t border-primary-200 pt-7 mt-5">
                            <Text className="text-black-300 text-xl font-rubik-bold">
                                Agent
                            </Text>

                            <View className="flex flex-row items-center justify-between mt-4">
                                <View className="flex flex-row items-center">
                                    <Image
                                        source={{ uri: property?.agent.avatar }}
                                        className="size-14 rounded-full"
                                    />
                                    <View className="flex flex-col items-start justify-center ml-3">
                                        <Text className="text-lg text-black-300 text-start font-rubik-bold">
                                            {property?.agent.name}
                                        </Text>
                                        <Text className="text-sm text-black-200 text-start font-rubik-medium">
                                            {property?.agent.email}
                                        </Text>
                                    </View>
                                </View>

                            <View className="flex flex-row items-center gap-3">
                                <Image source={icons.chat} className="size-7" />
                                <Image source={icons.phone} className="size-7" />
                            </View>
                        </View>
                    </View>

                        {/*Overview*/}
                        <View className="mt-7">
                            <Text className="text-black-300 text-xl font-rubik-bold">
                                Overview
                            </Text>
                            <Text className="text-black-200 text-base font-rubik mt-2">
                                {property?.description}
                            </Text>
                        </View>

                        {/*Facilities*/}
                        <View className="mt-7">
                            <Text className="text-black-300 text-xl font-rubik-bold">
                                Facilities
                            </Text>
                            {property?.facilities.length > 0 && (
                                <View className="flex flex-row flex-wrap items-start justify-start mt-2 gap-5">
                                    {property?.facilities.map((item: string, index: number) => {
                                        const facility = facilities.find(
                                            (facility) => facility.title === item
                                        );
                                        return (
                                            <View
                                                key={index}
                                                className="flex flex-1 flex-col items-center min-w-16 max-w-20"
                                            >
                                                <View className="size-14 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <Image
                                                        source={facility ? facility.icon : icons.info}
                                                        className="size-6"
                                                    />
                                                </View>

                                                <Text
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                    className="text-black-300 text-sm text-center font-rubik mt-1.5"
                                                >
                                                    {item}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        </View>

                        {/*Gallery*/}
                        {property?.gallery.length > 0 && (
                            <View className="mt-7">
                                <Text className="text-black-300 text-xl font-rubik-bold">
                                    Gallery
                                </Text>
                                <FlatList
                                    contentContainerStyle={{ paddingRight: 20 }}
                                    data={property?.gallery}
                                    keyExtractor={(item) => item.$id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <Image
                                            source={{ uri: item.image }}
                                            className="size-40 rounded-xl"
                                        />
                                    )}
                                    contentContainerClassName="flex gap-4 mt-3"
                                />
                            </View>
                        )}

                        {/*Address*/}
                        <View className="mt-7">
                            <Text className="text-black-300 text-xl font-rubik-bold">
                                Location
                            </Text>
                            <View className="flex flex-row items-center justify-start mt-4 gap-2">
                                <Image source={icons.location} className="w-7 h-7" />
                                <Text className="text-black-200 text-sm font-rubik-medium">
                                    {property?.address}
                                </Text>
                            </View>

                            <Image
                                source={images.map}
                                className="h-52 w-full mt-5 rounded-xl"
                            />
                        </View>

                        {/*Review*/}
                        {sortedReviews.length > 0 && (
                            <View ref={reviewsSectionRef} className="mt-7">
                                <View className="flex flex-row items-center justify-between">
                                    <View className="flex flex-row items-center">
                                        <Image source={icons.star} className="size-6" />
                                        <Text className="text-black-300 text-xl font-rubik-bold ml-2">
                                            {property?.rating} ({sortedReviews.length} reviews)
                                        </Text>
                                    </View>

                                    <TouchableOpacity onPress={() => setAllComments(!isAllComments)}>
                                        <Text className="text-primary-300 text-base font-rubik-bold">
                                            {isAllComments ? "Show Less" : "View All"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View className="mt-5">
                                    {isAllComments ? (
                                        sortedReviews.map((review, index) => (
                                            <Comment key={review.$id || index} item={review} />
                                        ))
                                    ) : (
                                        <Comment item={sortedReviews[0]} />
                                    )}
                                </View>
                            </View>
                        )}

                        {/*Add review section*/}
                        <View className="mt-7 border-t border-primary-200 pt-4">
                            <Text className="text-xl font-rubik-bold text-black-300 mb-3">Add Review</Text>
                            {/*Rating Selection*/}
                            <View className="flex flex-row items-center mb-4">
                            <Text className="text-black-300 font-rubik-medium mr-2">Rating:</Text>
                            {[1,2,3,4,5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <Image
                                        source={icons.star}
                                        className="size-6 mx-1"
                                        tintColor={star <= rating ? "#FFD700" : "#E8E8E8"}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                            {/*Review Input*/}
                            <TextInput
                                value={newReview}
                                onChangeText={setNewReview}
                                placeholder="Share your experience with this property..."
                                placeholderTextColor="black"
                                multiline
                                className="border border-primary-200 rounded-lg p-3 text-black-300 font-rubik h-24"
                                onFocus={()=> {
                                    //Scroll to the input when focused
                                    setTimeout(() => {
                                        scrollViewRef.current?.scrollToEnd({animated: true});
                                }, 100)
                                }}
                            />

                            {/*Submit*/}
                            <TouchableOpacity
                                onPress={handleAddReview}
                                disabled={isAddingReview}
                                className="bg-primary-300 py-3 rounded-full mt-4 items-center justify-center"
                            >
                                <Text className="text-white text-lg font-rubik-bold">
                                    {isAddingReview ? "Submitting..." : "Submit Review"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

            <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7" style={{paddingBottom: Platform.OS === 'ios' ? 30: 20}}>
                <View className="flex flex-row items-center justify-between gap-10">
                    <View className="flex flex-col items-start">
                        <Text className="text-black-200 text-xs font-rubik-medium">
                            Price
                        </Text>
                        <Text
                            numberOfLines={1}
                            className="text-primary-300 text-start text-2xl font-rubik-bold"
                        >
                            ${property?.price}
                        </Text>
                    </View>

                    <TouchableOpacity className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400">
                        <Text className="text-white text-lg text-center font-rubik-bold">
                            Book Now
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </KeyboardAvoidingView>
    );
};

export default Property;