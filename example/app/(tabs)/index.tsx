import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinkedAccountDetails } from "react-native-candle";
import { useNavigation } from "@react-navigation/native";
import { useCandleClient } from "../Context/candle-context";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabOneScreen() {
  const candleClient = useCandleClient();

  const navigation = useNavigation<any>();

  const [isLoading, setIsLoading] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccountDetails[]>(
    []
  );

  useEffect(() => {
    if (linkedAccounts.length > 0) return;
    onRefresh();
  }, []);

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

  const unlink = async (accountId: string) => {
    setIsLoading(true);
    try {
      await candleClient.unlinkAccount({
        linkedAccountID: accountId,
      });
      setLinkedAccounts((prev) =>
        prev.filter((account) => account.linkedAccountID !== accountId)
      );
    } catch (error) {
      console.error("Failed to unlink account:", error);
      Alert.alert("Error", "Failed to unlink account.");
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
          <View
            style={{
              padding: 20,
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
              backgroundColor: "white",
            }}
            onTouchEnd={() => {
              Alert.alert(
                `Unlink Account`,
                `Are you sure you want to unlink ${account.service}?`,
                [
                  {
                    text: "Unlink",
                    style: "destructive",
                    onPress: () => {
                      unlink(account.linkedAccountID);
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
            key={account.linkedAccountID}
          >
            <Image
              source={{
                uri: `https://institution-logos.s3.us-east-1.amazonaws.com/${account.service}.png`,
                width: 50,
                height: 50,
              }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {account.service}
              </Text>
              <Text style={{ color: "gray" }}>{account.details.state}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={{ gap: 10 }}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            candleClient.presentCandleLinkSheet({
              services: ["lyft", "uber", "venmo", "cash_app", "robinhood"],
              onSuccess: (linkedAccount) => {
                onRefresh();
              },
              customerName: "Akme Inc.",
              presentationStyle: "fullScreen",
              presentationBackground: "blur",
            });
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Link Account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("Modal Screen");
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Show Modal Link Sheet
          </Text>
        </TouchableOpacity>
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
                      Alert.alert("User deleted successfully.");
                      setLinkedAccounts([]);
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
    padding: 14,
    backgroundColor: "red",
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
  },
  button: {
    padding: 14,
    borderWidth: 2,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
  },
});
