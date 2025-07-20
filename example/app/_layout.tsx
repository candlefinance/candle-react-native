import FontAwesome from "@expo/vector-icons/FontAwesome";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import "react-native-reanimated";
import TabOneScreen from "./(tabs)";
import GetTradeQuotesScreen from "./(tabs)/get-trade-quotes";
import GetTradesScreen from "./(tabs)/get-trades";
import GetAssetAccountsScreen from "./(tabs)/get-asset-accounts";
import Modal from "./(tabs)/modal";
import { CandleClient } from "react-native-candle";
import { CandleClientContext } from "./Context/candle-context";

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
          <Stack.Screen
            options={{
              headerShown: true,
              title: "Linked Accounts",
              headerLargeTitle: true,
            }}
            name="Home"
            component={TabOneScreen}
          />
          <Stack.Screen
            name="Modal Screen"
            component={Modal}
            options={{
              headerLargeTitle: true,
              presentation: "modal",
              headerShown: true,
              title: "Modal",
            }}
          />
          <Stack.Screen
            name="Get Trade Quotes Screen"
            component={GetTradeQuotesScreen}
            options={{
              headerLargeTitle: true,
              presentation: "modal",
              headerShown: true,
              title: "Get Trade Quotes",
            }}
          />
          <Stack.Screen
            name="Get Trades Screen"
            component={GetTradesScreen}
            options={{
              headerLargeTitle: true,
              presentation: "modal",
              headerShown: true,
              title: "Get Trades",
            }}
          />
          <Stack.Screen
            name="Get Asset Accounts Screen"
            component={GetAssetAccountsScreen}
            options={{
              headerLargeTitle: true,
              presentation: "modal",
              headerShown: true,
              title: "Get Asset Accounts",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CandleClientContext.Provider>
  );
}
