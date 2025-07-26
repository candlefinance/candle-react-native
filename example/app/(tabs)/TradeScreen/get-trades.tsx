import {
  RefreshControl,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Text,
  View,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useCandleClient } from "../../Context/candle-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  LinkedAccountStatusRef,
  Trade,
  TradeAsset,
  Counterparty,
  TradeQuery,
} from "react-native-candle";
import { SharedListRow } from "../SharedComponents/shared-list-row";
import { useNavigation } from "@react-navigation/native";
import { getLogo } from "@/app/Utils";
import { Ionicons } from "@expo/vector-icons";
import { MenuView, MenuComponentRef } from "@react-native-menu/menu";

const SUPPORTED_SPANS = [
  { id: "PT3H", title: "3 Hours" },
  { id: "PT6H", title: "6 Hours" },
  { id: "PT12H", title: "12 Hours" },
  { id: "P1D", title: "1 Day" },
  { id: "P7D", title: "7 Days" },
  { id: "P1M", title: "1 Month" },
  { id: "P6M", title: "6 Months" },
  { id: "P1Y", title: "1 Year" },
  { id: "none", title: "No Span" },
] as const;

const FILTER_CONFIG = [
  {
    key: "dateTimeSpan",
    title: "Date/Time Span",
    options: SUPPORTED_SPANS.map((s) => ({
      value: s.id,
      label: s.title,
    })),
  },
  {
    key: "lostAssetKind",
    title: "Lost Asset Kind",
    options: ["cash", "crypto", "stock", "transport", "nothing", "other"].map(
      (k) => ({
        value: k,
        label: k,
      })
    ),
  },
  {
    key: "gainedAssetKind",
    title: "Gained Asset Kind",
    options: ["cash", "crypto", "stock", "transport", "nothing", "other"].map(
      (k) => ({
        value: k,
        label: k,
      })
    ),
  },
  {
    key: "counterpartyKind",
    title: "Counterparty Kind",
    options: ["merchant", "user", "service"].map((k) => ({
      value: k,
      label: k,
    })),
  },
] as const;

const assetDisplayName = (asset: TradeAsset): string => {
  switch (asset.assetKind) {
    case "transport":
      return asset.name;
    case "stock":
      return asset.name;
    case "nothing":
      return asset.assetKind;
    case "other":
      return asset.assetKind;
    case "crypto":
      return asset.name;
    case "fiat":
      return asset.currencyCode;
  }
};

const counterpartyDisplayName = (cp: Counterparty): string => {
  switch (cp.kind) {
    case "merchant":
      return cp.name;
    case "user":
      return cp.username;
    case "service":
      return cp.service;
  }
};

export default function GetTradesScreen() {
  const menuRef = useRef<MenuComponentRef>(null);

  const candleClient = useCandleClient();

  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);

  const [{ linkedAccounts, trades }, setTrades] = useState<{
    trades: Trade[];
    linkedAccounts: LinkedAccountStatusRef[];
  }>({ trades: [], linkedAccounts: [] });
  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState<TradeQuery>({
    dateTimeSpan: undefined,
    lostAssetKind: undefined,
    gainedAssetKind: undefined,
    counterpartyKind: undefined,
    linkedAccountIDs: undefined,
  });

  const fetchTrades = async () => {
    try {
      console.log("Fetching trades with filters:", filters);
      setIsLoading(true);
      const result = await candleClient.getTrades({
        linkedAccountIDs: filters.linkedAccountIDs,
        dateTimeSpan:
          filters.dateTimeSpan === "none" ? undefined : filters.dateTimeSpan,
        gainedAssetKind: filters.gainedAssetKind,
        lostAssetKind: filters.lostAssetKind,
        counterpartyKind: filters.counterpartyKind,
      });
      setTrades(result);
    } catch (error) {
      Alert.alert(`Failed to fetch trades: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Search by asset or counterparty",
        hideWhenScrolling: false,
        onChangeText: (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
          setSearchText(e.nativeEvent.text);
        },
      },
      headerRight: () => (
        <MenuView
          ref={menuRef}
          title="Select Filter"
          onPressAction={({ nativeEvent }) => {
            const [key, value] = nativeEvent.event.split("|") as [
              keyof TradeQuery,
              string
            ];
            setFilters((prev) => {
              return {
                ...prev,
                [key]: value,
              };
            });
          }}
          actions={FILTER_CONFIG.map((f) => ({
            id: f.key,
            title: f.title,
            subactions: f.options.map((opt) => ({
              id: `${f.key}|${opt.value}`,
              title: opt.label,
              state: (filters as any)[f.key] === opt.value ? "on" : "off",
            })),
          }))}
          shouldOpenOnLongPress={false}
        >
          <View>
            <Ionicons
              name="ellipsis-horizontal-circle-outline"
              size={28}
              color="black"
            />
          </View>
        </MenuView>
      ),
    });
  }, [filters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTrades();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const filteredTrades = useMemo(() => {
    if (searchText.length === 0) return trades;

    const q = searchText.toLowerCase();
    return trades.filter((t) => {
      const tokens = [
        assetDisplayName(t.lost),
        assetDisplayName(t.gained),
        counterpartyDisplayName(t.counterparty),
        t.state,
      ];
      return tokens.some((tok) => tok.toLowerCase().includes(q));
    });
  }, [trades, searchText]);

  return (
    <SafeAreaView edges={["bottom"]} style={[styles.container]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setIsLoading(true);
              fetchTrades().finally(() => {
                setIsLoading(false);
              });
            }}
          />
        }
        contentInsetAdjustmentBehavior={"always"}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            paddingHorizontal: 20,
            marginVertical: 20,
          }}
        >
          {linkedAccounts.length === 0 ? "" : "Linked Accounts"}
        </Text>
        {linkedAccounts.map((account) => (
          <SharedListRow
            key={account.linkedAccountID}
            title={account.service}
            subtitle={account.state}
            uri={getLogo(account.service)}
          />
        ))}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            paddingHorizontal: 20,
            marginVertical: 20,
          }}
        >
          {linkedAccounts.length === 0 ? "" : "Trades"}
        </Text>
        {filteredTrades.map((trade, index) => (
          <SharedListRow
            title={assetDisplayName(trade.lost) || trade.state}
            subtitle={trade.dateTime}
            uri={
              trade.counterparty.kind === "user"
                ? trade.counterparty.avatarURL
                : ""
            }
            onTouchEnd={() => {
              navigation.navigate("Get Trade Detail Screen", {
                trade,
              });
            }}
            key={`trade-${index}`}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
