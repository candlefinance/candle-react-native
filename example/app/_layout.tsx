import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useMemo } from "react";
import "react-native-reanimated";
import GetLinkedAccounts from "./(tabs)/LinkedAccountsScreens/get-linked-accounts";
import GetTradeQuotesScreen from "./(tabs)/TradeQuoteScreens/get-trade-quotes";
import GetTradesScreen from "./(tabs)/TradeScreen/get-trades";
import GetAssetAccountsScreen from "./(tabs)/AssetsScreens/get-asset-accounts";
import GetLinkedAccountDetailsScreen from "./(tabs)/LinkedAccountsScreens/get-linked-account-details";
import GetAssetAccountDetailsScreen from "./(tabs)/AssetsScreens/get-asset-accounts-details";
import GetTradeQuotesDetailsScreen from "./(tabs)/TradeQuoteScreens/get-trade-quote-details";
import GetTradeDetailsScreen from "./(tabs)/TradeScreen/get-trade-details";
import { CandleClient } from "react-native-candle";
import { CandleClientContext } from "./Context/candle-context";

const Stack = createNativeStackNavigator();
const AssetStack = createNativeStackNavigator();
const TradesStack = createNativeStackNavigator();
const TradeQuotesStack = createNativeStackNavigator();

export default function RootLayout() {
  function TradeQuotesListStack() {
    return (
      <TradeQuotesStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <TradeQuotesStack.Screen
          name="Get Trade Quotes Screen"
          component={GetTradeQuotesScreen}
          options={{
            headerLargeTitle: true,
            headerShown: true,
            title: "Get Trade Quotes",
          }}
        />
        <TradeQuotesStack.Screen
          name="Get Trade Quotes Details Screen"
          component={GetTradeQuotesDetailsScreen}
          options={{
            headerShown: true,
            title: "Trade Quote Details",
          }}
        />
      </TradeQuotesStack.Navigator>
    );
  }
  function TradesListStack() {
    return (
      <TradesStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <TradesStack.Screen
          name="Get Trades Screen"
          component={GetTradesScreen}
          options={{
            headerLargeTitle: true,
            headerShown: true,
            title: "Get Trades",
          }}
        />
        <TradesStack.Screen
          name="Get Trade Detail Screen"
          component={GetTradeDetailsScreen}
          options={{
            headerShown: true,
            title: "Get Trade Quotes",
          }}
        />
      </TradesStack.Navigator>
    );
  }
  function AssetAccountsStack() {
    return (
      <AssetStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <AssetStack.Screen
          name="Get Asset Accounts Screen"
          component={GetAssetAccountsScreen}
          options={{
            headerLargeTitle: true,
            headerShown: true,
            title: "Get Asset Accounts",
          }}
        />
        <AssetStack.Screen
          name="Get Asset Accounts Details Screen"
          component={GetAssetAccountDetailsScreen}
          options={{
            headerShown: true,
            title: "Asset Account Details",
          }}
        />
      </AssetStack.Navigator>
    );
  }

  const candleClient = useMemo(() => {
    const appKey = "key-ykhw691crgrtw2tx3dwuizey";
    const appSecret = "sec-dSnRm6HsJmt/e/0ZnyqC/AxBayOZAYeWQLHsMZWfYfY=";
    console.log("app", appKey, appSecret);
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
          component={GetLinkedAccountDetailsScreen}
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
          component={TradeQuotesListStack}
          options={{
            presentation: "modal",
            title: "Get Trade Quotes",
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="Get Trades Screen"
          component={TradesListStack}
          options={{
            presentation: "modal",
            headerLargeTitle: true,
            title: "Get Trades",
          }}
        />
        <Stack.Screen
          name="Get Asset Accounts Screen"
          component={AssetAccountsStack}
          options={{
            presentation: "modal",
            headerLargeTitle: true,
            title: "Get Asset Accounts",
          }}
        />
      </Stack.Navigator>
    </CandleClientContext.Provider>
  );
}
