import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useMemo } from "react";
import "react-native-reanimated";
import GetLinkedAccounts from "./(tabs)/get-linked-accounts";
import GetTradeQuotesScreen from "./(tabs)/get-trade-quotes";
import GetTradesScreen from "./(tabs)/get-trades";
import GetAssetAccountsScreen from "./(tabs)/get-asset-accounts";
import GetLinkedDetialScreen from "./(tabs)/get-linked-account-details";
import { CandleClient } from "react-native-candle";
import { CandleClientContext } from "./Context/candle-context";

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
            name="Get Linked Accounts Screen"
            component={GetLinkedAccounts}
          />
          <Stack.Screen
            name="Get Linked Account Details Screen"
            component={GetLinkedDetialScreen}
            options={{
              presentation: "card",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="Get Linked Account Screen 2"
            component={GetLinkedAccounts}
            options={{
              presentation: "modal",
              headerShown: true,
              headerLargeTitle: true,
              title: "Test Modal",
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
