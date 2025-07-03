import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  View,
} from "react-native";
import { CandleClient, TradeQuote } from "react-native-candle";

export default function TabOneScreen() {
  const [tradeQuote, setTradeQuote] = useState<TradeQuote | undefined>(
    undefined
  );
  const candleClient = useMemo(() => {
    return new CandleClient({
      appKey: "",
      appSecret: "",
    });
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={[styles.container]}>
      <ActivityIndicator animating={isLoading} />
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
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error unlinking user:", error);
              setIsLoading(false);
            });
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
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error deleting user:", error);
              setIsLoading(false);
            });
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
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching available tools:", error);
              setIsLoading(false);
            });
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
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error executing tool:", error);
              setIsLoading(false);
            });
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
              setIsLoading(false);
            })
            .catch((error) => {
              setIsLoading(false);
              console.error("Error fetching linked accounts:", error);
              Alert.alert("Error", `${error}`);
            });
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
            .then((quote) => {
              console.log("Trade quotes:", quote.linkedAccounts);
              quote.tradeQuotes.forEach((quotes) => {
                console.log("Trade quote:", quotes);
              });
              setIsLoading(false);
            })
            .catch((error) => {
              setIsLoading(false);
              console.error("Error fetching trade quotes:", error);
              Alert.alert("Error", `${error}`);
            });
        }}
      />
      <Button
        title="Show Candle Sheet"
        onPress={() => {
          candleClient.presentCandleLinkSheet({
            services: ["venmo"], // optional, defaults to all supported
            onSuccess: (linkedAccount) => {
              console.log("Account selected:", linkedAccount);
            },
            customerName: "Akme Inc.",
            presentationStyle: "fullScreen",
            presentationBackground: "blur",
          });
        }}
      />
      <Button
        title="Show Trade Execution Sheet"
        onPress={() => {
          if (!tradeQuote) {
            Alert.alert("Error", "Trade quote is not set.");
            return;
          }
          candleClient
            .executeTrade({
              tradeQuote,
              presentationBackground: "blur",
            })
            .then((resultTrade) => {
              console.log("Trade executed successfully:", resultTrade);
            })
            .catch((error) => {
              console.error("Error executing trade:", error);
              Alert.alert("Error", `${error}`);
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
