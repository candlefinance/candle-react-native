import { getLogo } from "@/app/Utils";
import { Ionicons } from "@expo/vector-icons";
import { MenuComponentRef, MenuView } from "@react-native-menu/menu";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  NativeSyntheticEvent,
  SectionList,
  StyleSheet,
  Text,
  TextInputChangeEventData,
  View,
} from "react-native";
import { GetTradesResponse, TradeQuery } from "react-native-candle";
import { useCandleClient } from "../../Context/candle-context";
import { SharedListRow } from "../SharedComponents/shared-list-row";
import {
  assetDisplayName,
  counterpartyDisplayName,
  FILTER_CONFIG,
  SectionItem,
} from "./models";
import { toggleLinkedAccountIDs } from "../AssetsScreens/models";

export default function GetTradesScreen() {
  const menuRef = useRef<MenuComponentRef>(null);
  const candleClient = useCandleClient();
  const navigation = useNavigation<any>();

  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<TradeQuery>({});
  const [{ linkedAccounts, trades }, setTrades] = useState<GetTradesResponse>({
    trades: [],
    linkedAccounts: [],
  });

  const fetchTrades = async (filters: TradeQuery) => {
    try {
      setIsLoading(true);
      const result = await candleClient.getTrades(filters);
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
            switch (key) {
              case "linkedAccountIDs":
                setFilters((prev) => {
                  return {
                    ...prev,
                    [key]: toggleLinkedAccountIDs(prev.linkedAccountIDs, value),
                  };
                });
                break;
              default:
                setFilters((prev) => {
                  return {
                    ...prev,
                    [key]: value,
                  };
                });
            }
          }}
          actions={FILTER_CONFIG.map((f) =>
            f.key === "linkedAccountIDs"
              ? {
                  id: f.key,
                  title: f.title,
                  subactions:
                    linkedAccounts.map((acc) => ({
                      id: `linkedAccountIDs|${acc.linkedAccountID}`,
                      title: acc.service,
                      state: filters.linkedAccountIDs
                        ? filters.linkedAccountIDs
                            .split(",")
                            .includes(acc.linkedAccountID)
                          ? ("on" as const)
                          : ("off" as const)
                        : ("off" as const),
                    })) ?? [],
                }
              : {
                  id: f.key,
                  title: f.title,
                  subactions: f.options.map((opt) => ({
                    id: `${f.key}|${opt.value}`,
                    title: opt.label,
                    state: filters[f.key] === opt.value ? "on" : "off",
                  })),
                }
          )}
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
