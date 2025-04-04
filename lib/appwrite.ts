import {Account, Avatars, Client, Databases, ID, OAuthProvider, Query, Storage} from "react-native-appwrite";
import * as Linking from 'expo-linking';
import {openAuthSessionAsync} from "expo-web-browser";
import {Cloudinary} from "@cloudinary/url-gen";

export const config = {
    platform: 'com.victoria.restate',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
    reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
    agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
    propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
    userProfilesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_PROFILES_COLLECTION_ID,
    storageBucketId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || 'default',
}

export const client = new Client();

try {
    client
        .setEndpoint(config.endpoint!)
        .setProject(config.projectId!)
        .setPlatform(config.platform);
    // console.log('Appwrite client initialized successfully');
} catch (error) {
    console.error('Failed to initialize Appwrite client:', error);
}

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);


export const cloudinaryConfig = {
    cloud_name: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY,
    api_secret:process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET,
    upload_preset_name:process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET_NAME,
}

//Configure Cloudinary
const cld = new Cloudinary({
    cloud: {
        cloudName: cloudinaryConfig.cloud_name,
    },
    url: {
        secure: true,
    }
});

const options = {
    upload_preset: cloudinaryConfig.upload_preset_name,
    unsigned: true,
}


export async function createInitialUserProfile(userId: string, name:string) {
    try {
        const displayName = name.split(" ")[0];
        const avatarUrl = avatar.getInitials(name).toString();

        return createUserProfile({
            userId,
            name,
            displayName,
            avatar: avatarUrl,
        })
    }
    catch (error) {
        console.error("Error creating initial profile",error);
        throw error;
    }
}

export async  function login(){
    try {
        const redirectUri = Linking.createURL('/');

        const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUri);

        if (!response) throw  new Error('Failed to login');

        const browserResult = await openAuthSessionAsync(
            response.toString(),
            redirectUri
        )

        if(browserResult.type != 'success')throw  new Error('Failed to login');

        const url = new URL(browserResult.url);

        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        if(!userId || !secret) throw  new Error('Failed to login');

        const session = await account.createSession(userId, secret);

        if(!session) throw  new Error('Failed to create a session');

        //Create profile if it doesn't exist
        const authUser = await account.get();
        const existingProfile = await getUserProfile(userId);
        if(!existingProfile) {
            await createInitialUserProfile(userId, authUser.name)
        }

        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function logout() {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getCurrentUser(){
    try{
        const authUser = await account.get();
        if (!authUser?.$id) return null;

        // Get initials avatar as fallback
        const fallBackAvatar = avatar.getInitials(authUser.name).toString();

        //Get auth user first name as display fallback
        const fallBackDisplayName = authUser.name.split(" ")[0];

        //Try to get user profile
        let profileData = {
            name: authUser.name,
            avatar: fallBackAvatar,
            displayName: fallBackDisplayName,
            profile: null as any
        };

        try{
            const profile = await getUserProfile(authUser.$id);
            if(profile) {
                profileData.profile = profile;
                profileData.name = profile.name || authUser.name;
                profileData.avatar = profile.avatar || fallBackAvatar;
                profileData.displayName = profile.displayName || fallBackDisplayName;
            }
        }
        catch (profileError){
            console.log('No user profile found, using auth data');
        }

            return {
                ...authUser,
                ...profileData
            };
    }catch (error) {
        console.error(error);
        return null;
    }
}

export async function getUserProfile(userId: string){
    try {
        const result = await databases.listDocuments(
            config.databaseId!,
            config.userProfilesCollectionId!,
            [Query.equal('userId', userId), Query.limit(1)]
        );

        return result.documents[0] || null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}


export async function createUserProfile({userId, name, avatar, displayName}: {userId: string; name: string; avatar?: string; displayName: string; }){
    try {
        const result = await databases.createDocument(
            config.databaseId!,
            config.userProfilesCollectionId!,
            ID.unique(),
            {
                userId,
                name,
                displayName,
                ...(avatar && { avatar }),
            }
        );

        //Also update the auth user's name
        await account.updateName(name);

        return result;
    }
    catch (error) {
        console.error("Error creating user profile",error);
        throw error;
    }
}


export async function updateUserProfile({profileId, name, avatar, displayName}: {profileId: string; name: string; avatar?: string; displayName: string; }) {
    try {
        const result = await databases.updateDocument(
            config.databaseId!,
            config.userProfilesCollectionId!,
            profileId,
            {
                name,
                displayName,
                ...(avatar && { avatar })
            }
        );

        //Also update the auth user's name
        await account.updateName(name);

        return result;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

export async function uploadProfileImage(uri: string) {
    try {
        const formData = new FormData();
        formData.append('file', {
            uri,
            type: 'image/jpeg',
            name: `profile_${Date.now()}.jpg`
        } as any);
        formData.append('upload_preset', cloudinaryConfig.upload_preset_name!);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

export async  function getLatestProperties(){
    try {
        const result = await databases.listDocuments(
            config.databaseId!,
            config.propertiesCollectionId!,
            [Query.orderAsc('$createdAt'), Query.limit(5)]
        )

        return result.documents;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProperties({filter, query, limit, minPrice, maxPrice, types, minBedrooms, minBathrooms, minSize, maxSize}: {
    filter: string;
    query: string;
    limit?: number;
    minPrice?: string;
    maxPrice?: string;
    types?: string;
    minBedrooms?: string;
    minBathrooms?: string;
    minSize?: string;
    maxSize?: string;
}) {
    try {
        const buildQuery = [Query.orderDesc('$createdAt')];

        if (filter && filter !== 'All') {
            buildQuery.push(Query.equal('type', filter));
        }

        if (query) {
            buildQuery.push(
                Query.or([
                    Query.search('name', query),
                    Query.search('address', query),
                    Query.search('type', query),
                ])
            );
        }

        if (minPrice) {
            buildQuery.push(Query.greaterThanEqual('price', parseInt(minPrice)));
        }

        if (maxPrice) {
            buildQuery.push(Query.lessThanEqual('price', parseInt(maxPrice)));
        }

        if (types) {
            const typeArray = types.split(',');
            buildQuery.push(Query.equal('type', typeArray));
        }

        if (minBedrooms) {
            buildQuery.push(Query.greaterThanEqual('bedrooms', parseInt(minBedrooms)));
        }

        if (minBathrooms) {
            buildQuery.push(Query.greaterThanEqual('bathrooms', parseInt(minBathrooms)));
        }

        if (minSize) {
            buildQuery.push(Query.greaterThanEqual('size', parseInt(minSize)));
        }

        if (maxSize) {
            buildQuery.push(Query.lessThanEqual('size', parseInt(maxSize)));
        }

        if (limit) {
            buildQuery.push(Query.limit(limit));
        }

        const result = await databases.listDocuments(
            config.databaseId!,
            config.propertiesCollectionId!,
            buildQuery
        );

        return result.documents;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getPropertyById(params: {id: string}){
    try {
        const result = await databases.getDocument(
            config.databaseId!,
            config.propertiesCollectionId!,
            params.id,
        )

        return result;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

// Add to appwrite.ts
export async function createReview({propertyId, name, avatar, review, rating}: { propertyId: string; name: string; avatar: string; review: string; rating: number; }) {
    try {
        // Create the review document
        const newReview = await databases.createDocument(
            config.databaseId!,
            config.reviewsCollectionId!,
            'unique()',
            {
                name,
                avatar,
                review,
                rating
            }
        );

        // Get current property to update its reviews array
        const property = await databases.getDocument(
            config.databaseId!,
            config.propertiesCollectionId!,
            propertyId
        );

        // Update the property with the new review
        await databases.updateDocument(
            config.databaseId!,
            config.propertiesCollectionId!,
            propertyId,
            {
                reviews: [...property.reviews, newReview.$id]
            }
        );

        return newReview;
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
}