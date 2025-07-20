import {
  RefreshControl,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useCandleClient } from "../Context/candle-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { LinkedAccountStatusRef, Trade } from "react-native-candle";
import { SharedListRow } from "./shared/shared-list-row";
import { useNavigation } from "@react-navigation/native";

export default function GetTradesScreen() {
  const [trades, setTrades] = useState<{
    trades: Trade[];
    linkedAccounts: LinkedAccountStatusRef[];
  }>();
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(true);
  const candleClient = useCandleClient();

  const fetchTrades = async () => {
    try {
      const accounts = await candleClient.getTrades();
      setTrades(accounts);
    } catch (error) {
      Alert.alert(`Failed to fetch trades: ${error}`);
    }
  };

  useEffect(() => {
    if (trades) return;
    fetchTrades().finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <SafeAreaView edges={["bottom"]} style={[styles.container]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setIsLoading(true);
              fetchTrades().finally(() => {
                setIsLoading(false);
              });
            }}
          />
        }
        contentInsetAdjustmentBehavior={"always"}
      >
        {trades?.trades.map((trade, index) => (
          <SharedListRow
            title={
              trade.lost.assetKind == "transport"
                ? trade.lost.name
                : trade.state
            }
            subtitle={trade.dateTime}
            uri={trade.lost.assetKind == "transport" ? trade.lost.imageURL : ""}
            onTouchEnd={() => {
              navigation.navigate("Get Trade Detail Screen", {
                trade,
              });
            }}
            key={`trade-${index}`}
          />
        ))}
        <ActivityIndicator
          animating={isLoading}
          size="large"
          color="black"
          style={{ marginTop: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
