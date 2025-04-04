import {Account, Avatars, Client, Databases, OAuthProvider, Query} from "react-native-appwrite";
import * as Linking from 'expo-linking';
import {openAuthSessionAsync} from "expo-web-browser";

export const config = {
    platform: 'com.victoria.restate',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
    reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
    agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
    propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
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
        const response = await account.get();

        if(response.$id) {
            const userAvatar = avatar.getInitials(response.name);

            return {
                ...response,
                avatar: userAvatar.toString(),
            };
        }
    }catch (error) {
        console.error(error);
        return null;
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