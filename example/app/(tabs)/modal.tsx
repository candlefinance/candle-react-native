import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AssetKind, CandleClient, TradeQuote } from "react-native-candle";

export default function TabOneScreen() {
  const [tradeQuote, setTradeQuote] = useState<
    TradeQuote<AssetKind, AssetKind> | undefined
  >(undefined);

  const candleClient = useMemo(() => {
    return new CandleClient({
      appKey: "",
      appSecret: "",
    });
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={[styles.container]}>
      <Text>Unlink Account</Text>
      <Button
        title="Show Candle Sheet"
        onPress={() => {
          candleClient.presentCandleLinkSheet({
            services: ["lyft"], // optional, defaults to all supported
            onSuccess: (linkedAccount) => {
              console.log("Account linked:", linkedAccount);
            },
            customerName: "Akme Inc.",
            presentationStyle: "sheet",
            presentationBackground: "default",
          });
        }}
      />
      <Button
        title="Execute Trade"
        onPress={() => {
          setIsLoading(true);
          candleClient
            .executeTrade({
              tradeQuote: {
                context: "",
                expirationDateTime: "",
                gained: { assetKind: "nothing" },
                lost: { assetKind: "nothing" },
              },
              presentationBackground: "blur",
            })
            .then((resultTrade) => {
              setTradeQuote(undefined);
              console.log("Trade executed successfully:", resultTrade);
            })
            .catch((error) => {
              console.error("Error executing trade:", error);
              Alert.alert("Error", `${error}`);
            })
            .finally(() => setIsLoading(false));
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
