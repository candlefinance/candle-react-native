import { Ionicons } from "@expo/vector-icons";
import type { NativeActionEvent } from "@react-native-menu/menu";
import { MenuComponentRef, MenuView } from "@react-native-menu/menu";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Alert, SectionList, StyleSheet, Text, View } from "react-native";
import {
  AssetAccount,
  AssetAccountQuery,
  LinkedAccountStatusRef,
} from "react-native-candle";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCandleClient } from "../../Context/candle-context";
import { getLogo } from "../../Utils";
import { SharedListRow } from "../SharedComponents/shared-list-row";
import { FILTER_CONFIG, SectionItem, updateFilters } from "./models";

export default function GetAssetAccountsScreen() {
  const menuRef = useRef<MenuComponentRef>(null);
  const candleClient = useCandleClient();
  const navigation = useNavigation<any>();

  const [filters, setFilters] = useState<AssetAccountQuery>({
    assetKind: undefined,
    linkedAccountIDs: undefined,
  });

  const [assetAccounts, setAssetAccounts] = useState<{
    assetAccounts: AssetAccount[];
    linkedAccounts: LinkedAccountStatusRef[];
  }>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssetAccounts = async (queryFilters: AssetAccountQuery) => {
    try {
      setIsLoading(true);
      const result = await candleClient.getAssetAccounts(queryFilters);
      setAssetAccounts(result);
    } catch (error) {
      Alert.alert(`Failed to fetch asset accounts: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetAccounts(filters);
  }, [filters]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isLoading ? "Loading..." : "Asset Accounts",
      headerRight: () => (
        <MenuView
          ref={menuRef}
          title="Select Filter"
          onPressAction={({ nativeEvent }: NativeActionEvent) => {
            const [key, value] = nativeEvent.event.split("|") as [
              "assetKind" | "linkedAccountIDs",
              string
            ];
            setFilters((prev) => updateFilters(prev, key, value));
          }}
          actions={[
            ...FILTER_CONFIG.map((f) => ({
              id: f.key,
              title: f.title,
              subactions: f.options.map((opt) => ({
                id: `${f.key}|${opt.value}`,
                title: opt.label,
                state:
                  filters.assetKind === opt.value
                    ? ("on" as const)
                    : ("off" as const),
              })),
            })),
            {
              id: "linkedAccountIDs",
              title: "Linked Accounts",
              subactions:
                assetAccounts?.linkedAccounts.map((acc) => ({
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
            },
          ]}
          shouldOpenOnLongPress={false}
        >
          <Ionicons
            name="ellipsis-horizontal-circle-outline"
            size={28}
            color="black"
          />
        </MenuView>
      ),
    });
  }, [filters, assetAccounts, isLoading]);

  return (
    <SafeAreaView style={[styles.container]}>
      <SectionList<SectionItem>
        sections={[
          {
            title: "Linked Accounts",
            data:
              assetAccounts?.linkedAccounts.map((a) => ({
                kind: "account",
                value: a,
              })) ?? [],
          },
          {
            title: "Asset Accounts",
            data:
              assetAccounts?.assetAccounts.map((a) => ({
                kind: "assetAccount",
                value: a,
              })) ?? [],
          },
        ]}
        keyExtractor={(item) =>
          item.kind === "account"
            ? item.value.linkedAccountID
            : item.value.serviceAccountID
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
              title={item.value.nickname}
              subtitle={item.value.accountKind}
              uri={getLogo(item.value.service)}
              onTouchEnd={() =>
                navigation.navigate("Get Asset Accounts Details Screen", {
                  assetAccount: item.value,
                })
              }
            />
          )
        }
        renderSectionHeader={({ section: { title, data } }) => (
          <Text style={styles.headerText}>{data.length > 0 ? title : ""}</Text>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No asset accounts found.</Text>
          </View>
        }
        refreshing={isLoading}
        onRefresh={() => {
          fetchAssetAccounts(filters);
        }}
        contentInsetAdjustmentBehavior="always"
      />
    </SafeAreaView>
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
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
});
