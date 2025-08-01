import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  SectionList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MenuView } from "@react-native-menu/menu";

import { useCandleClient } from "../../Context/candle-context";
import {
  AssetKind,
  LinkedAccountDetail,
  LinkedAccountStatusRef,
  TradeQuoteQuery,
  TradeQuote,
} from "react-native-candle";

import { SharedListRow } from "../SharedComponents/shared-list-row";
import { getLogo } from "@/app/Utils";

type QuotePair = {
  tradeQuote: TradeQuote<AssetKind, AssetKind>;
  linkedAccount: LinkedAccountStatusRef;
};

type Filters = {
  gainedAssetKind?: AssetKind;
  lostAssetKind?: AssetKind;
  linkedAccountIDs?: string[];
};

const ASSET_KIND_OPTIONS: Array<{ label: string; value: AssetKind }> = [
  { label: "Fiat", value: "fiat" },
  { label: "Stock", value: "stock" },
  { label: "Crypto", value: "crypto" },
  { label: "Transport", value: "transport" },
];

export default function GetTradeQuotesScreen() {
  const navigation = useNavigation<any>();
  const candleClient = useCandleClient();

  const [filters, setFilters] = useState<Filters>({});
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccountDetail[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [gainedInputs, setGainedInputs] = useState<string[]>([
    "40.748237",
    "-73.984753",
    "40.750298",
    "-73.993324",
    "",
  ]);
  const [lostInputs, setLostInputs] = useState<string[]>(["", "", "", "", ""]);
  const [quotes, setQuotes] = useState<QuotePair[]>([]);

  const placeholderFor = (
    kind: AssetKind | undefined,
    index: number
  ): string | undefined => {
    if (!kind) return "Please Select Asset Kind";

    if (kind === "fiat") {
      return ["Currency Code", "Amount", "Service Account ID"][index];
    }
    if (kind === "stock" || kind === "crypto") {
      return ["Symbol", "Amount", "Service Account ID"][index];
    }
    if (kind === "transport") {
      return [
        "Origin Latitude",
        "Origin Longitude",
        "Destination Latitude",
        "Destination Longitude",
        "Service Account ID",
      ][index];
    }
    return undefined;
  };

  const buildQuoteRequest = (
    kind: AssetKind | undefined,
    inputs: string[]
  ): TradeQuoteQuery => {
    switch (kind) {
      case "transport":
        return {
          assetKind: "transport",
          originCoordinates:
            inputs[0] && inputs[1]
              ? {
                  latitude: parseFloat(inputs[0]),
                  longitude: parseFloat(inputs[1]),
                }
              : undefined,
          destinationCoordinates:
            inputs[2] && inputs[3]
              ? {
                  latitude: parseFloat(inputs[2]),
                  longitude: parseFloat(inputs[3]),
                }
              : undefined,
          serviceAccountID: inputs[4] || undefined,
        };
      case "fiat":
        return {
          assetKind: "fiat",
          currencyCode: inputs[0] || undefined,
          amount: inputs[1] ? parseFloat(inputs[1]) : undefined,
          serviceAccountID: inputs[2] || undefined,
        };
      case "stock":
      case "crypto":
        return {
          assetKind: kind,
          symbol: inputs[0] || undefined,
          amount: inputs[1] ? parseFloat(inputs[1]) : undefined,
          serviceAccountID: inputs[2] || undefined,
        };
      default:
        return { assetKind: "nothing" };
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const accounts = await candleClient.getLinkedAccounts();
        setLinkedAccounts(accounts);
      } catch (e) {
        console.error("Failed fetching linked accounts:", e);
      }
    })();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isLoading ? "Loading..." : "Trade Quotes",
      headerRight: () => (
        <MenuView
          title="Filters"
          onPressAction={({ nativeEvent }) => {
            const [key, value] = nativeEvent.event.split("|") as [
              "gainedAssetKind" | "lostAssetKind" | "linkedAccountIDs",
              string
            ];

            setFilters((prev) => {
              if (key === "linkedAccountIDs") {
                const current = prev.linkedAccountIDs ?? [];
                const exists = current.includes(value);
                return {
                  ...prev,
                  linkedAccountIDs: exists
                    ? current.filter((v) => v !== value)
                    : [...current, value],
                };
              }
              return { ...prev, [key]: value as AssetKind };
            });
          }}
          actions={[
            {
              id: "gainedAssetKind",
              title: "Gained Asset Kind",
              subactions: ASSET_KIND_OPTIONS.map((opt) => ({
                id: `gainedAssetKind|${opt.value}`,
                title: opt.label,
                state: filters.gainedAssetKind === opt.value ? "on" : "off",
              })),
            },
            {
              id: "lostAssetKind",
              title: "Lost Asset Kind",
              subactions: ASSET_KIND_OPTIONS.map((opt) => ({
                id: `lostAssetKind|${opt.value}`,
                title: opt.label,
                state: filters.lostAssetKind === opt.value ? "on" : "off",
              })),
            },
            {
              id: "linkedAccountIDs",
              title: "Linked Accounts",
              subactions: linkedAccounts.map((acc) => ({
                id: `linkedAccountIDs|${acc.linkedAccountID}`,
                title: acc.service,
                state: (filters.linkedAccountIDs ?? []).includes(
                  acc.linkedAccountID
                )
                  ? "on"
                  : "off",
              })),
            },
          ]}
        >
          <Ionicons
            name="ellipsis-horizontal-circle-outline"
            size={28}
            color="black"
          />
        </MenuView>
      ),
    });
  }, [filters, linkedAccounts, isLoading]);

  useEffect(() => {
    const fetchTradeQuotes = async () => {
      setIsLoading(true);
      try {
        const response = await candleClient.getTradeQuotes({
          linkedAccountIDs:
            filters.linkedAccountIDs?.length ?? 0
              ? filters.linkedAccountIDs!.join(",")
              : undefined,
          gained: buildQuoteRequest(
            filters.gainedAssetKind,
            gainedInputs
          ) as any,
          lost: buildQuoteRequest(filters.lostAssetKind, lostInputs) as any,
        });
        const pairs: QuotePair[] = response.tradeQuotes.map((quote, idx) => ({
          tradeQuote: quote,
          linkedAccount: response.linkedAccounts[idx],
        }));
        setQuotes(pairs);
      } catch (error) {
        Alert.alert("Error", String(error));
      } finally {
        setIsLoading(false);
      }
    };

    if (filters.gainedAssetKind || filters.lostAssetKind) {
      fetchTradeQuotes();
    }
  }, [filters]);

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const linkedAccountSection = {
    title: "Linked Accounts",
    data: quotes.map((q) => q.linkedAccount),
    renderItem: ({ item }: { item: LinkedAccountStatusRef }) => (
      <SharedListRow
        key={item.linkedAccountID}
        title={item.service}
        subtitle={item.state}
        uri={getLogo(item.service)}
      />
    ),
  };

  const tradeQuoteSection = {
    title: "Trade Quotes",
    data: quotes.map((q) => q.tradeQuote),
    renderItem: ({
      item,
      index,
    }: {
      item: TradeQuote<AssetKind, AssetKind>;
      index: number;
    }) => (
      <SharedListRow
        key={`quote-${index}`}
        title={`$${item.lost.amount.toFixed(2)}`}
        subtitle={item.gained.name}
        uri={item.gained.imageURL}
        onTouchEnd={() =>
          navigation.navigate("Get Trade Quotes Details Screen", {
            quote: {
              tradeQuotes: item,
              linkedAccounts: quotes[index].linkedAccount,
            },
          })
        }
      />
    ),
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="always">
        {/* INPUTS */}
        <View style={styles.inputContainer}>
          <Text style={styles.sectionLabel}>GAINED:</Text>
          {gainedInputs.map((value, idx) => {
            const placeholder = placeholderFor(filters.gainedAssetKind, idx);
            if (!placeholder) return null;
            return (
              <TextInput
                key={`gained-${idx}`}
                style={styles.textInput}
                placeholder={placeholder}
                value={value}
                onChangeText={(text) =>
                  setGainedInputs((prev) =>
                    prev.map((v, i) => (i === idx ? text : v))
                  )
                }
              />
            );
          })}

          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>LOST:</Text>
          {lostInputs.map((value, idx) => {
            const placeholder = placeholderFor(filters.lostAssetKind, idx);
            if (!placeholder) return null;
            return (
              <TextInput
                key={`lost-${idx}`}
                style={styles.textInput}
                placeholder={placeholder}
                value={value}
                onChangeText={(text) =>
                  setLostInputs((prev) =>
                    prev.map((v, i) => (i === idx ? text : v))
                  )
                }
              />
            );
          })}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setFilters((f) => ({ ...f }))}
            disabled={isLoading}
          >
            <ActivityIndicator
              animating={isLoading}
              color="white"
              style={styles.spinner}
            />
            <Text style={styles.primaryButtonText}>Fetch Quotes</Text>
          </TouchableOpacity>
        </View>

        {/* LIST */}
        <SectionList
          sections={[linkedAccountSection, tradeQuoteSection]}
          keyExtractor={(_, idx) => `${idx}`}
          renderItem={({ section, item, index }) =>
            section.renderItem({ item, index })
          }
          renderSectionHeader={({ section: { title } }) =>
            renderSectionHeader(title)
          }
          stickySectionHeadersEnabled
          ListEmptyComponent={
            !isLoading ? (
              <Text style={styles.emptyState}>No Trade Quotes</Text>
            ) : null
          }
          refreshing={isLoading}
          onRefresh={() => setFilters((f) => ({ ...f }))}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: { padding: 16, gap: 12 },
  sectionLabel: { fontWeight: "600" },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
  },
  primaryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
  },
  primaryButtonText: { color: "white", fontWeight: "600" },
  spinner: { position: "absolute", left: 16 },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  emptyState: { textAlign: "center", marginTop: 40 },
});
