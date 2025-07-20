import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  View,
} from "react-native";
import { AssetKind, TradeQuote } from "react-native-candle";
import { useNavigation } from "@react-navigation/native";
import { useCandleClient } from "../Context/candle-context";

export default function TabOneScreen() {
  const [tradeQuote, setTradeQuote] = useState<
    TradeQuote<AssetKind, AssetKind> | undefined
  >(undefined);

  const candleClient = useCandleClient();

  const navigation = useNavigation<any>();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={[styles.container]}>
      <ActivityIndicator animating={isLoading} />
      <Button
        title="Present Modal"
        onPress={() => {
          navigation.navigate("ScreenTwo");
        }}
      />
      <Button
        title="Unlink Account"
        onPress={() => {
          setIsLoading(true);
          candleClient
            .unlinkAccount({
              linkedAccountID: "linkedAccountID", // Replace with actual linked account ID
            })
            .then(() => {
              console.log("User unlinked successfully.");
            })
            .catch((error) => {
              console.error("Error unlinking user:", error);
            })
            .finally(() => setIsLoading(false));
        }}
      />
      <Button
        title="Delete User"
        onPress={() => {
          setIsLoading(true);
          candleClient
            .deleteUser()
            .then(() => {
              console.log("User deleted successfully.");
            })
            .catch((error) => {
              console.error("Error deleting user:", error);
            })
            .finally(() => setIsLoading(false));
        }}
      />
      <Button
        title="Get Available Tools"
        onPress={() => {
          setIsLoading(true);
          candleClient
            .getAvailableTools()
            .then((tools) => {
              console.log("Available tools:", tools);
            })
            .catch((error) => {
              console.error("Error fetching available tools:", error);
            })
            .finally(() => setIsLoading(false));
        }}
      />
      <Button
        title="Execute Tool"
        onPress={() => {
          setIsLoading(true);
          candleClient
            .executeTool({
              arguments: "{}",
              name: "get_linked_accounts",
            })
            .then((result) => {
              console.log("Tool executed successfully:", result);
            })
            .catch((error) => {
              console.error("Error executing tool:", error);
            })
            .finally(() => setIsLoading(false));
        }}
      />
      <Button
        title="Get Linked Accounts"
        onPress={() => {
          setIsLoading(true);
          candleClient
            .getLinkedAccounts()
            .then((accounts) => {
              accounts.forEach((account) => {
                switch (account.details.state) {
                  case "active":
                    console.log(
                      `${account.service} is active`,
                      JSON.stringify(account, null, 2)
                    );
                    break;
                  case "inactive":
                    console.log(
                      `${account.service} is inactive`,
                      JSON.stringify(account, null, 2)
                    );
                    break;
                  case "unavailable":
                    console.log(
                      `${account.service} is unavailable`,
                      JSON.stringify(account, null, 2)
                    );
                    break;
                }
              });
            })
            .catch((error) => {
              console.error("Error fetching linked accounts:", error);
              Alert.alert("Error", `${error}`);
            })
            .finally(() => setIsLoading(false));
        }}
      />
      <Button
        title="Get Trade Quotes"
        onPress={() => {
          setIsLoading(true);
          candleClient
            .getTradeQuotes({
              gained: {
                assetKind: "transport",
                originCoordinates: {
                  latitude: 40.7265,
                  longitude: -73.9814,
                },
                destinationCoordinates: {
                  latitude: 40.7128,
                  longitude: -74.006,
                },
              },
              lost: {
                assetKind: "fiat",
              },
            })
            .then(({ linkedAccounts, tradeQuotes }) => {
              console.log("Linked accounts:", linkedAccounts);
              tradeQuotes.forEach((tradeQuote) => {
                console.log("Trade quote:", tradeQuote);
              });
              // The returned tradeQuote is automatically type-narrowed to the request asset kinds
              const firstRide = tradeQuotes.find(
                ({ gained }) => gained.seats >= 1
              );
              if (firstRide !== undefined) {
                setTradeQuote(firstRide);
                console.log(
                  `Set ${firstRide.gained.name} quote as default for execution.`
                );
              }
            })
            .catch((error) => {
              console.error("Error fetching trade quotes:", error);
              Alert.alert("Error", `${error}`);
            })
            .finally(() => setIsLoading(false));
        }}
      />
      <Button
        title="Show Candle Sheet"
        onPress={() => {
          candleClient.presentCandleLinkSheet({
            services: ["lyft"], // optional, defaults to all supported
            onSuccess: (linkedAccount) => {
              console.log("Account linked:", linkedAccount);
            },
            customerName: "Akme Inc.",
            presentationStyle: "fullScreen",
            presentationBackground: "blur",
          });
        }}
      />
      <Button
        title="Execute Trade"
        onPress={() => {
          if (!tradeQuote) {
            Alert.alert("Error", "Trade quote is not set.");
            return;
          }
          setIsLoading(true);
          candleClient.presentCandleTradeExecutionSheet({
            tradeQuote,
            presentationBackground: "blur",
            completion(result) {
              if (result.kind === "success") {
                setTradeQuote(undefined);
                console.log("Trade executed successfully:", result);
              } else {
                Alert.alert("Error", `${result.error}`);
              }
            },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
