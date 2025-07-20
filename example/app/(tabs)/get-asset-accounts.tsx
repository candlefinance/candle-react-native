import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { useCandleClient } from "../Context/candle-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { AssetAccount, LinkedAccountStatusRef } from "react-native-candle";

export default function GetAssetAccountsScreen() {
  const [assetAccounts, setAssetAccounts] = useState<{
    assetAccounts: AssetAccount[];
    linkedAccounts: LinkedAccountStatusRef[];
  }>();
  const [isLoading, setIsLoading] = useState(true);
  const candleClient = useCandleClient();

  const fetchAssetAccounts = async () => {
    try {
      const accounts = await candleClient.getAssetAccounts();
      console.log("Asset Accounts:", accounts);
      setAssetAccounts(accounts);
    } catch (error) {
      Alert.alert(`Failed to fetch asset accounts: ${error}`);
    }
  };

  useEffect(() => {
    if (assetAccounts) return;
    fetchAssetAccounts().finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setIsLoading(true);
              fetchAssetAccounts().finally(() => {
                setIsLoading(false);
              });
            }}
          />
        }
        contentInsetAdjustmentBehavior={"always"}
      >
        {assetAccounts?.assetAccounts.map((account) => (
          <View
            style={{
              padding: 20,
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
              backgroundColor: "white",
            }}
            key={account.details.serviceAccountID}
          >
            <Text>
              {account.nickname} - {account.legalAccountKind}
            </Text>
          </View>
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
