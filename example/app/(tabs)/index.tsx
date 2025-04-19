import { useMemo, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import { CandleClient } from "react-native-candle";

export default function TabOneScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const candleClient = useMemo(() => {
    const appKey = ""; // Replace with your actual app key
    const appSecret = ""; // Replace with your actual app secret
    return new CandleClient({ appKey, appSecret });
  }, []);

  return (
    <View style={[styles.container]}>
      <ActivityIndicator animating={isLoading} />
      <Button
        title="Unlink Account"
        onPress={() => {
          setIsLoading(true);
          candleClient
            .unlinkAccount("linkedAccountID") // Replace with actual linked account ID
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
              if (accounts.length > 0) {
                console.log("Linked accounts:", accounts[0].details);
              } else {
                console.log("Linked accounts:", accounts);
              }
              setIsLoading(false);
            })
            .catch((error) => {
              setIsLoading(false);
              console.error("Error fetching linked accounts:", error);
            });
        }}
      />
      <Button
        title="Show Candle Sheet"
        onPress={() => {
          candleClient.presentCandleLinkSheet({
            onSuccess: (linkedAccount) => {
              console.log("Account selected:", linkedAccount);
            },
            customerName: "Akme Inc.",
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
