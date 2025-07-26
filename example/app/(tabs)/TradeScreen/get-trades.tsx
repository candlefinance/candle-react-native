import {
  SectionList,
  StyleSheet,
  Alert,
  Text,
  View,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useCandleClient } from "../../Context/candle-context";
import { useEffect, useRef, useState, useMemo } from "react";
import { LinkedAccountStatusRef, Trade, TradeQuery } from "react-native-candle";
import { SharedListRow } from "../SharedComponents/shared-list-row";
import { useNavigation } from "@react-navigation/native";
import { getLogo } from "@/app/Utils";
import { Ionicons } from "@expo/vector-icons";
import { MenuView, MenuComponentRef } from "@react-native-menu/menu";
import {
  assetDisplayName,
  counterpartyDisplayName,
  FILTER_CONFIG,
  SectionItem,
} from "./models";

export default function GetTradesScreen() {
  const menuRef = useRef<MenuComponentRef>(null);
  const candleClient = useCandleClient();
  const navigation = useNavigation<any>();

  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<TradeQuery>({
    dateTimeSpan: undefined,
    lostAssetKind: undefined,
    gainedAssetKind: undefined,
    counterpartyKind: undefined,
    linkedAccountIDs: undefined,
  });
  const [{ linkedAccounts, trades }, setTrades] = useState<{
    trades: Trade[];
    linkedAccounts: LinkedAccountStatusRef[];
  }>({ trades: [], linkedAccounts: [] });

  const fetchTrades = async (filters: TradeQuery) => {
    try {
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
      headerTitle: isLoading ? "Loading..." : "Trades",
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
  }, [filters, isLoading]);

  useEffect(() => {
    fetchTrades(filters);
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
    <SectionList<SectionItem>
      sections={[
        {
          title: "Linked Accounts",
          data: linkedAccounts.map((a) => ({
            kind: "account",
            value: a,
          })),
        },
        {
          title: "Trades",
          data: filteredTrades.map((t) => ({
            kind: "trade",
            value: t,
          })),
        },
      ]}
      stickySectionHeadersEnabled
      keyExtractor={(item, index) =>
        item.kind === "account" ? item.value.linkedAccountID : `trade-${index}`
      }
      renderItem={({ item }) =>
        item.kind === "account" ? (
          <SharedListRow
            title={item.value.service}
            subtitle={item.value.state}
            uri={getLogo(item.value.service)}
          />
        ) : (
          <SharedListRow
            title={assetDisplayName(item.value.lost) || item.value.state}
            subtitle={item.value.dateTime}
            uri={
              item.value.counterparty.kind === "user"
                ? item.value.counterparty.avatarURL
                : item.value.counterparty.kind === "merchant"
                ? item.value.counterparty.logoURL
                : "https://institution-logos.s3.us-east-1.amazonaws.com/candle.png"
            }
            onTouchEnd={() =>
              navigation.navigate("Get Trade Detail Screen", {
                trade: item.value,
              })
            }
          />
        )
      }
      renderSectionHeader={({ section: { title, data } }) => (
        <Text style={styles.headerText}>{data.length > 0 ? title : ""}</Text>
      )}
      ListEmptyComponent={
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text>No trades found.</Text>
        </View>
      }
      refreshing={isLoading}
      onRefresh={() => fetchTrades(filters)}
      contentInsetAdjustmentBehavior="always"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
});
