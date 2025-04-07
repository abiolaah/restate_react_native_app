import {createContext, useContext} from "react";
import {useAppwrite} from "@/lib/useAppwrite";
import {getCurrentUser} from "./appwrite";

interface User {
    $id: string;
    email: string;
    name: string;
    avatar: string;
    displayName?: string;  // Add this line
    profile?: any;
}


interface GlobalContextType {
    isLoggedIn: boolean;
    user: User | null;
    loading: boolean;
    // refetch: (newParams?: Record<string, string | number>) => Promise<void>;
    refetch: () => Promise<void>;
}



const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({children} : {children: React.ReactNode}) => {
    const {data: user, loading, refetch} = useAppwrite({
        fn: getCurrentUser,
    });

    const isLoggedIn = !!user;
    // !null = true => !true => false
    // !{name: 'Adrian'} => false => true

    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            user,
            loading,
            refetch,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }

    return context;
}

export default GlobalProvider;