import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCandleClient } from "../Context/candle-context";

export default function TabOneScreen() {
  const candleClient = useCandleClient();

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={{
          padding: 16,
          backgroundColor: "red",
          margin: 10,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 28,
        }}
        onPress={() => {
          candleClient.presentCandleLinkSheet({
            services: ["lyft", "uber", "venmo", "cash_app", "robinhood"],
            onSuccess: (linkedAccount) => {
              Alert.alert("Account linked:", linkedAccount.service);
            },
            customerName: "Akme Inc.",
            presentationStyle: "sheet",
            presentationBackground: "blur",
          });
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          Link Account
        </Text>
      </TouchableOpacity>
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
