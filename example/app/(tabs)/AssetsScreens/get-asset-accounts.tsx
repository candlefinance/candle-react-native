import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useCandleClient } from "../../Context/candle-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { AssetAccount, LinkedAccountStatusRef } from "react-native-candle";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getLogo } from "../../Utils";
import { SharedListRow } from "../SharedComponents/shared-list-row";

export default function GetAssetAccountsScreen() {
  const [assetAccounts, setAssetAccounts] = useState<{
    assetAccounts: AssetAccount[];
    linkedAccounts: LinkedAccountStatusRef[];
  }>();
  const navigation = useNavigation<any>();
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
          <SharedListRow
            title={account.nickname}
            subtitle={account.legalAccountKind}
            uri={getLogo(account.details.service)}
            onTouchEnd={() => {
              navigation.navigate("Get Asset Accounts Details Screen", {
                assetAccount: account,
              });
            }}
            key={account.details.serviceAccountID}
          />
        ))}
        <ActivityIndicator
          animating={isLoading}
          size="large"
          color="black"
          style={{ marginTop: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
