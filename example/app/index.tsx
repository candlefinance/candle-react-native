import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-reanimated";

import GetLinkedAccounts from "./(tabs)/LinkedAccountsScreens/get-linked-accounts";
import GetLinkedAccountDetailsScreen from "./(tabs)/LinkedAccountsScreens/get-linked-account-details";

import GetAssetAccountsScreen from "./(tabs)/AssetsScreens/get-asset-accounts";
import GetAssetAccountDetailsScreen from "./(tabs)/AssetsScreens/get-asset-accounts-details";

import GetTradesScreen from "./(tabs)/TradeScreen/get-trades";
import GetTradeDetailsScreen from "./(tabs)/TradeScreen/get-trade-details";

import GetTradeQuotesScreen from "./(tabs)/TradeQuoteScreens/get-trade-quotes";
import GetTradeQuotesDetailsScreen from "./(tabs)/TradeQuoteScreens/get-trade-quote-details";
import {
  LinkedAccountStatusRef,
  Trade,
  TradeAssetKind,
} from "react-native-candle";

const Stack = createNativeStackNavigator();
const AssetStack = createNativeStackNavigator();
const TradesStack = createNativeStackNavigator();
const TradeQuotesStack = createNativeStackNavigator();

function TradeQuotesListStack() {
  return (
    <TradeQuotesStack.Navigator screenOptions={{ headerShown: false }}>
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
        options={{ headerShown: true, title: "Trade Quote Details" }}
      />
    </TradeQuotesStack.Navigator>
  );
}

function TradesListStack() {
  return (
    <TradesStack.Navigator screenOptions={{ headerShown: false }}>
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
        options={{ headerShown: true, title: "Get Trade Quotes" }}
      />
    </TradesStack.Navigator>
  );
}

function AssetAccountsStack() {
  return (
    <AssetStack.Navigator screenOptions={{ headerShown: false }}>
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
        options={{ headerShown: true, title: "Asset Account Details" }}
      />
    </AssetStack.Navigator>
  );
}

export default function Index() {
  return (
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
        options={{ presentation: "card", headerShown: true }}
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
  );
}

async function foo() {
  const x: {
    trades: Trade<TradeAssetKind, TradeAssetKind>[];
    linkedAccounts: LinkedAccountStatusRef[];
  } = {
    linkedAccounts: [
      {
        linkedAccountID: "...",
        service: "uber",
        serviceUserID: "...",
        state: "active",
      },
      {
        linkedAccountID: "...",
        service: "robinhood",
        serviceUserID: "...",
        state: "active",
      },
      {
        linkedAccountID: "...",
        service: "apple",
        serviceUserID: "...",
        state: "active",
      },
    ],
    trades: [
      {
        dateTime: "2026-01-01T12:10:00.000-05:00",
        state: "success",
        counterparty: {
          kind: "service",
          service: "robinhood",
        },
        lost: {
          assetKind: "stock",
          serviceAccountID: "...",
          serviceAssetID: "...",
          symbol: "AAPL",
          amount: 1.856,
          serviceTradeID: "...",
          linkedAccountID: "...",
          service: "sandbox",
          name: "Apple",
          color: "#000000",
          logoURL: "https://example.com/aapl.png",
        },
        gained: {
          assetKind: "fiat",
          serviceAccountID: "...",
          currencyCode: "USD",
          amount: 500,
          linkedAccountID: "...",
          service: "robinhood",
        },
      },
      {
        dateTime: "2026-01-01T12:00:00.000-05:00",
        state: "success",
        counterparty: {
          kind: "user",
          legalName: "John Doe",
          avatarURL: "https://example.com/johndoe.png",
          username: "jdoe",
        },
        lost: {
          assetKind: "fiat",
          serviceAccountID: "...",
          currencyCode: "USD",
          amount: 22.05,
          linkedAccountID: "...",
          service: "uber",
        },
        gained: {
          assetKind: "transport",
          serviceTradeID: "...",
          serviceAssetID: "...",
          serviceAccountID: "...",
          name: "UberXL",
          description: "Honda Civic",
          imageURL: "https://example.com/uberxl.png",
          originCoordinates: {
            latitude: 37.778457,
            longitude: -122.389238,
          },
          originAddress: {
            value: "565 Clay St, San Francisco, CA 94111, United States",
          },
          destinationCoordinates: {
            latitude: 37.794652,
            longitude: -122.402706,
          },
          destinationAddress: {
            value:
              "24 Willie Mays Plaza, San Francisco, CA 94107, United States",
          },
          seats: 6,
          departureDateTime: "2026-01-01T12:05:00.000-05:00",
          arrivalDateTime: "2026-09-14T12:15:00.000-05:00",
          linkedAccountID: "...",
          service: "uber",
        },
      },
      {
        dateTime: "2026-01-01T11:30:00.000-05:00",
        state: "success",
        counterparty: {
          kind: "merchant",
          name: "Starbucks",
          logoURL: "https://example.com/starbucks.png",
          location: {
            countryCode: "US",
            countrySubdivisionCode: "CA",
            localityName: "San Francisco",
          },
        },
        lost: {
          assetKind: "fiat",
          serviceAccountID: "...",
          currencyCode: "USD",
          amount: 6.99,
          linkedAccountID: "...",
          service: "apple",
        },
        gained: {
          assetKind: "other",
        },
      },
    ],
  };

  const y: Trade<TradeAssetKind, TradeAssetKind> = {
    dateTime: "2026-01-01T12:00:00.000-05:00",
    state: "inProgress",
    counterparty: {
      kind: "user",
      legalName: "John Doe",
      avatarURL: "https://example.com/johndoe.png",
      username: "jdoe",
    },
    lost: {
      assetKind: "fiat",
      serviceAccountID: "...",
      currencyCode: "USD",
      amount: 22.05,
      linkedAccountID: "...",
      service: "uber",
    },
    gained: {
      assetKind: "transport",
      serviceTradeID: "...",
      serviceAssetID: "...",
      serviceAccountID: "...",
      name: "UberXL",
      description: "Honda Civic",
      imageURL: "https://example.com/uberxl.png",
      originCoordinates: {
        latitude: 37.778457,
        longitude: -122.389238,
      },
      originAddress: {
        value: "565 Clay St, San Francisco, CA 94111, United States",
      },
      destinationCoordinates: {
        latitude: 37.794652,
        longitude: -122.402706,
      },
      destinationAddress: {
        value: "24 Willie Mays Plaza, San Francisco, CA 94107, United States",
      },
      seats: 6,
      departureDateTime: "2026-01-01T12:05:00.000-05:00",
      arrivalDateTime: "2026-09-14T12:15:00.000-05:00",
      linkedAccountID: "...",
      service: "uber",
    },
  };
}
