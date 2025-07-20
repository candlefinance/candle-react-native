import { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinkedAccountDetail } from "react-native-candle";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useCandleClient } from "../../Context/candle-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLogo } from "../../Utils";
import { SharedListRow } from "../SharedComponents/shared-list-row";

type TabParamList = {
  "Get Linked Accounts Screen": {
    shouldRefreshLinkedAccounts?: boolean;
  };
};

type GetLinkedAccountsRouteProp = RouteProp<
  TabParamList,
  "Get Linked Accounts Screen"
>;

export default function GetLinkedAccountsScreen() {
  const route = useRoute<GetLinkedAccountsRouteProp>();
  const candleClient = useCandleClient();

  const navigation = useNavigation<any>();

  const [isLoading, setIsLoading] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccountDetail[]>(
    []
  );

  useEffect(() => {
    if (linkedAccounts.length > 0) return;
    onRefresh();
  }, []);

  useEffect(() => {
    if (route.params?.shouldRefreshLinkedAccounts) {
      onRefresh();
    }
  }, [route.params?.shouldRefreshLinkedAccounts]);

  const onRefresh = async () => {
    setIsLoading(true);
    try {
      const accounts = await candleClient.getLinkedAccounts();
      setLinkedAccounts(accounts);
    } catch (error) {
      console.error("Failed to fetch linked accounts:", error);
      Alert.alert("Error", "Failed to fetch linked accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView
        contentInsetAdjustmentBehavior="always"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              onRefresh();
            }}
          />
        }
      >
        {linkedAccounts.map((account) => (
          <SharedListRow
            key={account.linkedAccountID}
            title={account.service}
            subtitle={
              account.details.state == "active"
                ? account.details.legalName
                : account.details.state
            }
            uri={getLogo(account.service)}
            onTouchEnd={() => {
              navigation.navigate("Get Linked Account Details Screen", {
                account: account,
                onUnlinked: onRefresh,
              });
            }}
          />
        ))}
      </ScrollView>
      <View style={{ gap: 10 }}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            candleClient.presentCandleLinkSheet({
              services: [
                "lyft",
                "uber",
                "venmo",
                "cash_app",
                "robinhood",
                "sandbox",
              ],
              onSuccess: (linkedAccount) => {
                onRefresh();
              },
              customerName: "Akme Inc.",
              presentationStyle: navigation.canGoBack()
                ? "sheet"
                : "fullScreen",
              presentationBackground: "blur",
            });
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Link Account
          </Text>
        </TouchableOpacity>
        {!navigation.canGoBack() && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("Get Linked Account Screen 2");
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Show Modal Link Sheet
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Alert.alert(
              "Delete User",
              "Are you sure you want to delete your user? This action cannot be undone.",
              [
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    setIsLoading(true);
                    try {
                      await candleClient.deleteUser();
                      setLinkedAccounts([]);
                      Alert.alert("User deleted successfully.");
                    } catch (error) {
                      Alert.alert("Error", `Failed to delete user: ${error}`);
                    } finally {
                      setIsLoading(false);
                    }
                  },
                },
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
              ]
            );
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Delete User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("Get Asset Accounts Screen");
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Get Asset Accounts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("Get Trades Screen");
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Get Trades</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("Get Trade Quotes Screen");
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Get Trade Quotes
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  primaryButton: {
    padding: 12,
    backgroundColor: "red",
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
  },
  button: {
    padding: 12,
    borderWidth: 2,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
  },
});
