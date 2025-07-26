import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { AssetAccount, LinkedAccountStatusRef } from "react-native-candle";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCandleClient } from "../../Context/candle-context";
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
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            paddingHorizontal: 20,
            marginVertical: 20,
          }}
        >
          {assetAccounts?.linkedAccounts == undefined ? "" : "Linked Accounts"}
        </Text>
        {assetAccounts?.linkedAccounts.map((account, index) => (
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
          {assetAccounts?.assetAccounts == undefined ? "" : "Asset Accounts"}
        </Text>
        {assetAccounts?.assetAccounts.map((account) => (
          <SharedListRow
            title={account.nickname}
            subtitle={account.accountKind}
            uri={getLogo(account.service)}
            onTouchEnd={() => {
              navigation.navigate("Get Asset Accounts Details Screen", {
                assetAccount: account,
              });
            }}
            key={account.serviceAccountID}
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
