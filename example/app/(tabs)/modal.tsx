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
import { useCandleClient } from "../Context/candle-context";

export default function TabOneScreen() {
  const [tradeQuote, setTradeQuote] = useState<
    TradeQuote<AssetKind, AssetKind> | undefined
  >(undefined);

  const candleClient = useCandleClient();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={[styles.container]}>
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
          candleClient.presentCandleTradeExecutionSheet({
            tradeQuote: {
              context: "",
              expirationDateTime: "",
              gained: { assetKind: "nothing" },
              lost: { assetKind: "nothing" },
            },
            presentationBackground: "blur",
            completion: (result) => {
              if (result.kind === "success") {
                setTradeQuote(undefined);
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
