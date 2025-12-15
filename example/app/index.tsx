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
  AssetAccount,
  LinkedAccountStatusRef,
  Trade,
  TradeAssetKind,
  useCandle,
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

async function t() {
  // import { useCandle } from "react-native-candle";

  const candle = useCandle();

  (await candle.getAssetAccounts()) satisfies AssetAccountsResponse;

  // import { useCandle } from "react-native-candle";

  // const candle = useCandle();

  (await candle.getAssetAccounts({
    assetKind: "transport",
  })) satisfies AssetAccountsResponse;

  //   import { useCandle } from "react-native-candle"

  // const candle = useCandle()

  // TIP: Store important IDs for future use
  let robinhoodIDs = (await candle.getLinkedAccounts())
    .filter(({ service }) => service == "robinhood")
    .map(({ linkedAccountID }) => linkedAccountID)
    .join();

  (await candle.getAssetAccounts({
    linkedAccountIDs: robinhoodIDs,
  })) satisfies AssetAccountsResponse;

  //   import { useCandle } from "react-native-candle"
  // const candle = useCandle()

  // TIP: Store important refs for future use
  const accountRef = (await candle.getAssetAccounts()).assetAccounts[0];

  (await candle.getAssetAccount(accountRef)) satisfies AssetAccount;

  // import { useCandle } from "react-native-candle";

  // const candle = useCandle();

  (await candle.getTrades()) satisfies TradesResponse;

  // import { useCandle } from "react-native-candle";

  // const candle = useCandle();

  (await candle.getTrades({
    gainedAssetKind: "transport",
  })) satisfies TradesResponse;

  //   import { useCandle } from "react-native-candle"

  // const candle = useCandle()

  (await candle.getTrades({
    lostAssetKind: "stock",
  })) satisfies TradesResponse;

  //   import { useCandle } from "react-native-candle"

  // const candle = useCandle()

  (await candle.getTrades({
    counterpartyKind: "merchant",
  })) satisfies TradesResponse;

  // import { useCandle } from "react-native-candle";

  // const candle = useCandle();

  (await candle.getTrades({
    dateTimeSpan: "P1W",
  })) satisfies TradesResponse;

  type AssetAccountsResponse = {
    assetAccounts: AssetAccount[];
    linkedAccounts: LinkedAccountStatusRef[];
  };

  //   import { useCandle } from "react-native-candle"

  // const candle = useCandle()

  // TIP: Store important IDs for future use
  // let robinhoodIDs = (await candle.getLinkedAccounts())
  //   .filter(({ service }) => service == "robinhood")
  //   .map(({ linkedAccountID }) => linkedAccountID)
  //   .join();

  (await candle.getTrades({
    linkedAccountIDs: robinhoodIDs,
  })) satisfies TradesResponse;

  //   import { useCandle } from "react-native-candle"

  // const candle = useCandle()

  // TIP: Store important refs for future use
  const tradeRef = (await candle.getTrades()).trades[0];

  (await candle.getTrade(tradeRef)) satisfies Trade<
    TradeAssetKind,
    TradeAssetKind
  >;

  type TradesResponse = {
    trades: Trade<TradeAssetKind, TradeAssetKind>[];
    linkedAccounts: LinkedAccountStatusRef[];
  };

  const _1: AssetAccountsResponse = {
    assetAccounts: [
      {
        assetKind: "fiat",
        accountKind: "individual",
        nickname: "Apple Card",
        currencyCode: "USD",
        balance: -1245.06,
        serviceAccountID: "...",
        linkedAccountID: "...",
        service: "apple",
      },
      {
        assetKind: "stock",
        accountKind: "joint",
        nickname: "Joint Investing",
        serviceAccountID: "...",
        linkedAccountID: "...",
        service: "robinhood",
      },
      {
        assetKind: "transport",
        accountKind: "business",
        nickname: "Acme Inc",
        serviceAccountID: "...",
        linkedAccountID: "...",
        service: "uber",
      },
    ],
    linkedAccounts: [
      {
        service: "uber",
        state: "active",
        serviceUserID: "...",
        linkedAccountID: "...",
      },
      {
        service: "robinhood",
        state: "active",
        linkedAccountID: "...",
        serviceUserID: "...",
      },
      {
        service: "apple",
        state: "active",
        linkedAccountID: "...",
        serviceUserID: "...",
      },
    ],
  };

  const _2: AssetAccountsResponse = {
    assetAccounts: [
      {
        assetKind: "transport",
        accountKind: "business",
        nickname: "Acme Inc",
        serviceAccountID: "...",
        linkedAccountID: "...",
        service: "uber",
      },
    ],
    linkedAccounts: [
      {
        service: "uber",
        state: "active",
        serviceUserID: "...",
        linkedAccountID: "...",
      },
      {
        service: "robinhood",
        state: "active",
        linkedAccountID: "...",
        serviceUserID: "...",
      },
      {
        service: "apple",
        state: "active",
        linkedAccountID: "...",
        serviceUserID: "...",
      },
    ],
  };

  const _3: AssetAccountsResponse = {
    assetAccounts: [
      {
        assetKind: "stock",
        accountKind: "joint",
        nickname: "Joint Investing",
        serviceAccountID: "...",
        linkedAccountID: "...",
        service: "robinhood",
      },
    ],
    linkedAccounts: [
      {
        service: "robinhood",
        state: "active",
        linkedAccountID: "...",
        serviceUserID: "...",
      },
    ],
  };

  const _4: AssetAccount = {
    assetKind: "fiat",
    accountKind: "individual",
    nickname: "Apple Card",
    currencyCode: "USD",
    balance: -1245.06,
    serviceAccountID: "...",
    linkedAccountID: "...",
    service: "apple",
  };
}
