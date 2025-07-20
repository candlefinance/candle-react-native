import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinkedAccountStatusRef, Trade } from "react-native-candle";
import { RouteProp, useRoute } from "@react-navigation/native";
import { flattenObject } from "../../Utils";
import { DetailScrollView } from "../SharedComponents/detail-scroll-view";

type TabParamList = {
  GetTradeDetailsScreen: {
    trade: {
      trades: Trade;
      linkedAccounts: LinkedAccountStatusRef;
    };
  };
};

type GetTradeDetailsRouteProp = RouteProp<
  TabParamList,
  "GetTradeDetailsScreen"
>;

export default function GetTradeDetailsScreen() {
  const {
    params: { trade },
  } = useRoute<GetTradeDetailsRouteProp>();

  const flattened = flattenObject(trade);

  return (
    <SafeAreaView style={[styles.container]} edges={["bottom"]}>
      <DetailScrollView flattened={flattened} />
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
});
