import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinkedAccountStatusRef, TradeQuote } from "react-native-candle";
import { RouteProp, useRoute } from "@react-navigation/native";
import { flattenObject } from "../../Utils";
import { DetailScrollView } from "../SharedComponents/detail-scroll-view";
import { useCandleClient } from "@/app/Context/candle-context";

type TabParamList = {
  GetTradeQuoteDetailsScreen: {
    quote: {
      tradeQuotes: TradeQuote<"transport", "fiat">;
      linkedAccounts: LinkedAccountStatusRef;
    };
  };
};

type GetTradeQuoteDetailsRouteProp = RouteProp<
  TabParamList,
  "GetTradeQuoteDetailsScreen"
>;

export default function GetTradeQuoteDetailsScreen() {
  const candleClient = useCandleClient();
  const {
    params: { quote },
  } = useRoute<GetTradeQuoteDetailsRouteProp>();
  const flattened = flattenObject(quote);

  return (
    <SafeAreaView style={[styles.container]} edges={["bottom"]}>
      <DetailScrollView flattened={flattened} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          candleClient.presentCandleTradeExecutionSheet({
            presentationBackground: "blur",
            tradeQuote: quote.tradeQuotes,
            completion: (trade) => {},
          });
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 18,
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          Execute Trade
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    padding: 12,
    borderWidth: 2,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    marginTop: 20,
  },
});
