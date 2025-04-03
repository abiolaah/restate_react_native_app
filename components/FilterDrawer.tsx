import { View, Text, TouchableOpacity, ScrollView, Image, Modal, TextInput } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import icons from '@/constants/icons';
import { categories } from '@/constants/data';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomMarker  from '@/components/CustomMarker'; // You'll need to create this marker component

const FilterDrawer = ({ isDrawerVisible, setDrawerVisible }: { isDrawerVisible: boolean, setDrawerVisible: (visible: boolean) => void }) => {

    // Initial values
    const initialPriceRange = [1000, 100000];
    const initialBedrooms = 1;
    const initialBathrooms = 1;
    const initialBuildingSize = [1000, 3000];

    // State
    const [priceRange, setPriceRange] = useState(initialPriceRange);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [bedrooms, setBedrooms] = useState(initialBedrooms);
    const [bathrooms, setBathrooms] = useState(initialBathrooms);
    const [buildingSize, setBuildingSize] = useState(initialBuildingSize);

    //Filter out "All" category
    const propertyTypes = categories.filter(category => category.category !== 'All');

    const togglePropertyType = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleNumberChange = (value: number, setter: (val: number) => void, min: number, max: number) => {
        const newValue = Math.max(min, Math.min(max, value));
        setter(newValue);
    };

    const resetFilters = () => {
        setPriceRange(initialPriceRange);
        setSelectedTypes([]);
        setBedrooms(initialBedrooms);
        setBathrooms(initialBathrooms);
        setBuildingSize(initialBuildingSize);
        router.setParams({
            minPrice: '',
            maxPrice: '',
            types: '',
            minBedrooms: '',
            maxBedrooms: '',
            minSize:'',
            maxSize:'',
        });
        setDrawerVisible(false);
    }

    // Update the applyFilters function in FilterDrawer.tsx
    const applyFilters = () => {
        const params: Record<string, string> = {};

        // Only add parameters that have values
        if (priceRange[0] !== initialPriceRange[0] || priceRange[1] !== initialPriceRange[1]) {
            params.minPrice = priceRange[0].toString();
            params.maxPrice = priceRange[1].toString();
        }

        if (selectedTypes.length > 0) {
            params.types = selectedTypes.join(',');
        }

        if (bedrooms !== initialBedrooms) {
            params.minBedrooms = bedrooms.toString();
        }

        if (bathrooms !== initialBathrooms) {
            params.minBathrooms = bathrooms.toString();
        }

        if (buildingSize[0] !== initialBuildingSize[0] || buildingSize[1] !== initialBuildingSize[1]) {
            params.minSize = buildingSize[0].toString();
            params.maxSize = buildingSize[1].toString();
        }

        router.setParams(params);
        setDrawerVisible(false);
    };

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={isDrawerVisible}
            onRequestClose={() => setDrawerVisible(false)}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl p-5 h-3/4">
                    <View className="flex-row justify-between items-center mb-4">
                        <TouchableOpacity onPress={() => setDrawerVisible(false)}>
                            <Image source={icons.backArrow} className="size-5" />
                        </TouchableOpacity>
                        <Text className="text-xl font-rubik-bold text-black-300">Filters</Text>
                        <TouchableOpacity onPress={resetFilters}>
                            <Text className="text-primary-300 font-rubik-bold">Reset</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-3">
                        {/* Price Range */}
                        <View className="mb-6">
                            <Text className="text-lg font-rubik-bold text-black-300 mb-3">Price Range</Text>
                            <MultiSlider
                                values={priceRange}
                                sliderLength={300}
                                onValuesChange={setPriceRange}
                                min={1000}
                                max={100000}
                                step={1000}
                                allowOverlap={false}
                                minMarkerOverlapDistance={10}
                                customMarker={CustomMarker}
                                selectedStyle={{ backgroundColor: '#0061FF' }}
                                trackStyle={{ backgroundColor: '#E8E8E8' }}
                            />
                            <View className="flex-row justify-between mt-2">
                                <View className="flex-row items-center">
                                    <TouchableOpacity
                                        onPress={() => handleNumberChange(priceRange[0] - 1000, (val) => setPriceRange([val, priceRange[1]]), 1000, priceRange[1] - 1000)}
                                        className="bg-primary-100 rounded-full w-8 h-8 items-center justify-center"
                                    >
                                        <Text>-</Text>
                                    </TouchableOpacity>
                                    <TextInput
                                        value={`$${priceRange[0].toLocaleString()}`}
                                        onChangeText={(text) => {
                                            const num = parseInt(text.replace(/\D/g, ''));
                                            if (!isNaN(num)) {
                                                handleNumberChange(num, (val) => setPriceRange([val, priceRange[1]]), 1000, priceRange[1] - 1000);
                                            }
                                        }}
                                        keyboardType="numeric"
                                        className="text-black-300 font-rubik mx-2 w-20 text-center"
                                    />
                                    <TouchableOpacity
                                        onPress={() => handleNumberChange(priceRange[0] + 1000, (val) => setPriceRange([val, priceRange[1]]), 1000, priceRange[1] - 1000)}
                                        className="bg-primary-100 rounded-full w-8 h-8 items-center justify-center"
                                    >
                                        <Text>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="flex-row items-center">
                                    <TouchableOpacity
                                        onPress={() => handleNumberChange(priceRange[1] - 1000, (val) => setPriceRange([priceRange[0], val]), priceRange[0] + 1000, 100000)}
                                        className="bg-primary-100 rounded-full w-8 h-8 items-center justify-center"
                                    >
                                        <Text>-</Text>
                                    </TouchableOpacity>
                                    <TextInput
                                        value={`$${priceRange[1].toLocaleString()}`}
                                        onChangeText={(text) => {
                                            const num = parseInt(text.replace(/\D/g, ''));
                                            if (!isNaN(num)) {
                                                handleNumberChange(num, (val) => setPriceRange([priceRange[0], val]), priceRange[0] + 1000, 100000);
                                            }
                                        }}
                                        keyboardType="numeric"
                                        className="text-black-300 font-rubik mx-2 w-20 text-center"
                                    />
                                    <TouchableOpacity
                                        onPress={() => handleNumberChange(priceRange[1] + 1000, (val) => setPriceRange([priceRange[0], val]), priceRange[0] + 1000, 100000)}
                                        className="bg-primary-100 rounded-full w-8 h-8 items-center justify-center"
                                    >
                                        <Text>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Property Type */}
                        <View className="mb-6">
                            <Text className="text-lg font-rubik-bold text-black-300 mb-3">Property Type</Text>
                            <View className="flex-row flex-wrap">
                                {propertyTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type.title}
                                        onPress={() => togglePropertyType(type.category)}
                                        className={`px-4 py-2 mr-2 mb-2 rounded-full ${
                                            selectedTypes.includes(type.category)
                                                ? 'bg-primary-300'
                                                : 'bg-accent-100 border border-primary-200'
                                        }`}
                                    >
                                        <Text className={`text-sm ${
                                            selectedTypes.includes(type.category)
                                                ? 'text-white font-rubik-bold'
                                                : 'text-black-300 font-rubik'
                                        }`}>
                                            {type.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Home Details */}
                        <View className="mb-6">
                            <Text className="text-lg font-rubik-bold text-black-300 mb-3">Home Details</Text>

                            <View className=" flex flex-row mb-4 items-center justify-start gap-2">
                                <Text className="text-black-300 font-rubik-medium mb-2">Bedrooms: </Text>
                                <View className="flex-row items-center">
                                    <TouchableOpacity
                                        onPress={() => handleNumberChange(bedrooms - 1, setBedrooms, 1, 5)}
                                        className="bg-primary-100 rounded-full w-8 h-8 items-center justify-center"
                                    >
                                        <Text>-</Text>
                                    </TouchableOpacity>
                                    <TextInput
                                        value={bedrooms.toString()}
                                        onChangeText={(text) => {
                                            const num = parseInt(text);
                                            if (!isNaN(num)) {
                                                handleNumberChange(num, setBedrooms, 1, 5);
                                            }
                                        }}
                                        keyboardType="numeric"
                                        className="text-black-300 font-rubik mx-2 w-10 text-center"
                                    />
                                    <TouchableOpacity
                                        onPress={() => handleNumberChange(bedrooms + 1, setBedrooms, 1, 5)}
                                        className="bg-primary-100 rounded-full w-8 h-8 items-center justify-center"
                                    >
                                        <Text>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="flex flex-row mb-4 items-center justify-start gap-2">
                                <Text className="text-black-300 font-rubik-medium mb-2">Bathrooms: </Text>
                                <View className="flex-row items-center">
                                    <TouchableOpacity
                                        onPress={() => handleNumberChange(bathrooms - 1, setBathrooms, 1, 5)}
                                        className="bg-primary-100 rounded-full w-8 h-8 items-center justify-center"
                                    >
                                        <Text>-</Text>
                                    </TouchableOpacity>
                                    <TextInput
                                        value={bathrooms.toString()}
                                        onChangeText={(text) => {
                                            const num = parseInt(text);
                                            if (!isNaN(num)) {
                                                handleNumberChange(num, setBathrooms, 1, 5);
                                            }
                                        }}
                                        keyboardType="numeric"
                                        className="text-black-300 font-rubik mx-2 w-10 text-center"
                                    />
                                    <TouchableOpacity
                                        onPress={() => handleNumberChange(bathrooms + 1, setBathrooms, 1, 5)}
                                        className="bg-primary-100 rounded-full w-8 h-8 items-center justify-center"
                                    >
                                        <Text>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View>
                                <Text className="text-black-300 font-rubik-medium mb-2">Building Size (sqft)</Text>
                                <MultiSlider
                                    values={buildingSize}
                                    sliderLength={300}
                                    onValuesChange={setBuildingSize}
                                    min={500}
                                    max={5000}
                                    step={100}
                                    allowOverlap={false}
                                    minMarkerOverlapDistance={10}
                                    customMarker={CustomMarker}
                                    selectedStyle={{ backgroundColor: '#0061FF' }}
                                    trackStyle={{ backgroundColor: '#E8E8E8' }}
                                />
                                <View className="flex-row justify-between mt-2">
                                    <View className="flex-row items-center">
                                        <TouchableOpacity
                                            onPress={() => handleNumberChange(buildingSize[0] - 100, (val) => setBuildingSize([val, buildingSize[1]]), 500, buildingSize[1] - 100)}
                                            className="bg-primary-100 rounded-full w-8 h-8 items-center justify-center"
                                        >
                                            <Text>-</Text>
                                        </TouchableOpacity>
                                        <TextInput
                                            value={`${buildingSize[0].toLocaleString()} sqft`}
                                            onChangeText={(text) => {
                                                const num = parseInt(text.replace(/\D/g, ''));
                                                if (!isNaN(num)) {
                                                    handleNumberChange(num, (val) => setBuildingSize([val, buildingSize[1]]), 500, buildingSize[1] - 100);
                                                }
                                            }}
                                            keyboardType="numeric"
                                            className="text-black-300 font-rubik mx-2 w-24 text-center"
                                        />
                                        <TouchableOpacity
                                            onPress={() => handleNumberChange(buildingSize[0] + 100, (val) => setBuildingSize([val, buildingSize[1]]), 500, buildingSize[1] - 100)}
                                            className="bg-primary-100 rounded-full w-8 h-8 items-center justify-center"
                                        >
                                            <Text>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View className="flex-row items-center">
                                        <TouchableOpacity
                                            onPress={() => handleNumberChange(buildingSize[1] - 100, (val) => setBuildingSize([buildingSize[0], val]), buildingSize[0] + 100, 5000)}
                                            className="bg-primary-100 rounded-full w-8 h-8 items-center justify-center"
                                        >
                                            <Text>-</Text>
                                        </TouchableOpacity>
                                        <TextInput
                                            value={`${buildingSize[1].toLocaleString()} sqft`}
                                            onChangeText={(text) => {
                                                const num = parseInt(text.replace(/\D/g, ''));
                                                if (!isNaN(num)) {
                                                    handleNumberChange(num, (val) => setBuildingSize([buildingSize[0], val]), buildingSize[0] + 100, 5000);
                                                }
                                            }}
                                            keyboardType="numeric"
                                            className="text-black-300 font-rubik mx-2 w-24 text-center"
                                        />
                                        <TouchableOpacity
                                            onPress={() => handleNumberChange(buildingSize[1] + 100, (val) => setBuildingSize([buildingSize[0], val]), buildingSize[0] + 100, 5000)}
                                            className="bg-primary-100 rounded-full w-8 h-8 items-center justify-center"
                                        >
                                            <Text>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Set Filter Button */}
                    <TouchableOpacity
                        onPress={applyFilters}
                        className="bg-primary-300 py-4 rounded-full mt-4 items-center justify-center"
                    >
                        <Text className="text-white text-lg font-rubik-bold">Set Filter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default FilterDrawer;