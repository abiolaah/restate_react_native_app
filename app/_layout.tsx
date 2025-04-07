import {SplashScreen, Stack} from "expo-router";

import "./globals.css";
import {useFonts} from "expo-font";
import {useEffect} from "react";
import GlobalProvider from "@/lib/global-provider";
import Toast from "react-native-toast-message";
import {NotificationProvider} from "@/lib/notification-context";
import * as Notifications from 'expo-notifications';
import {FavouritesProvider} from "@/lib/favourite-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require('../assets/fonts/Rubik-Bold.ttf'),
    "Rubik-ExtraBold": require('../assets/fonts/Rubik-ExtraBold.ttf'),
    "Rubik-Light": require('../assets/fonts/Rubik-Light.ttf'),
    "Rubik-Medium": require('../assets/fonts/Rubik-Medium.ttf'),
    "Rubik-SemiBold": require('../assets/fonts/Rubik-SemiBold.ttf'),
    "Rubik-Regular": require('../assets/fonts/Rubik-Regular.ttf'),
  })

  useEffect(()=> {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded])

  if (!fontsLoaded) return null;

  return (
      <GlobalProvider>
        <NotificationProvider>
          <FavouritesProvider>
            <Stack screenOptions={{headerShown: false}} />
            <Toast />
          </FavouritesProvider>
        </NotificationProvider>
      </GlobalProvider>
  );
}
