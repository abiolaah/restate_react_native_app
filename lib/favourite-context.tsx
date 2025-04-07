// lib/favourites-context.tsx
import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavouriteContextType = {
    favourites: FavouritesProps[];
    addToFavourites: (property: PropertyProps) => void;
    removeFromFavourites: (propertyId: string) => void;
    isInFavourites: (propertyId: string) => boolean;
};

const STORAGE_KEY = 'my_favourites';

const FavouriteContext = createContext<FavouriteContextType>({
    favourites: [],
    addToFavourites: () => {},
    removeFromFavourites: () => {},
    isInFavourites: () => false,
});

export const FavouritesProvider = ({ children }: { children: React.ReactNode }) => {
    const [favourites, setFavourites] = useState<FavouritesProps[]>([]);

    // Load notifications from storage on mount
    useEffect(() => {
        const loadFavourites = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setFavourites(JSON.parse(stored));
                }
            } catch (error) {
                console.error('Failed to load notifications', error);
            }
        };
        loadFavourites();
    }, []);

    // Save to storage whenever notifications change
    useEffect(() => {
        const saveFavourites = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
            } catch (error) {
                console.error('Failed to save notifications', error);
            }
        };
        saveFavourites();
    }, [favourites]);

    const addToFavourites = (property: PropertyProps) => {
        setFavourites(prev => {
            // Check if property already exists in wishlist
            const exists = prev.some(item => item.property.$id === property.$id);
            if (!exists) {
                return [
                    ...prev,
                    {
                        id: Math.random().toString(36).substring(7),
                        property,
                        createdAt: new Date()
                    }
                ];
            }
            return prev;
        });
    };

   const removeFromFavourites =  (propertyId: string) => {
       setFavourites(prev => prev.filter(item => item.property.$id !== propertyId));
   }

   const isInFavourites = (propertyId: string) => {
       return favourites.some(item => item.property.$id === propertyId);
   }

    return (
        <FavouriteContext.Provider
            value={{ favourites, addToFavourites, removeFromFavourites, isInFavourites}}
        >
            {children}
        </FavouriteContext.Provider>
    );
};

export const useFavourites = () => useContext(FavouriteContext);