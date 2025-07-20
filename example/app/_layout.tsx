import FontAwesome from "@expo/vector-icons/FontAwesome";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import "react-native-reanimated";
import TabOneScreen from "./(tabs)";
import ScreenTwo from "./(tabs)/modal";
import { CandleClient } from "react-native-candle";
import { CandleClientContext } from "./Context/candle-context";
import ErrorBoundary from "react-native-error-boundary";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const candleClient = useMemo(() => {
    const appKey = process.env.EXPO_PUBLIC_CANDLE_APP_KEY;
    const appSecret = process.env.EXPO_PUBLIC_CANDLE_APP_SECRET;
    if (!appKey || !appSecret) {
      throw new Error(
        "EXPO_PUBLIC_CANDLE_APP_KEY and EXPO_PUBLIC_CANDLE_APP_SECRET must be set in .env file"
      );
    }
    return new CandleClient({
      appKey: appKey,
      appSecret: appSecret,
    });
  }, []);

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <CandleClientContext.Provider value={candleClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={TabOneScreen} />
          <Stack.Screen
            name="ScreenTwo"
            component={ScreenTwo}
            options={{
              presentation: "modal",
              headerShown: true,
              title: "Modal",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CandleClientContext.Provider>
  );
}
