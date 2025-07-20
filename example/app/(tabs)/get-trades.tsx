import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { useCandleClient } from "../Context/candle-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { LinkedAccountStatusRef, Trade } from "react-native-candle";

export default function GetTradesScreen() {
  const [trades, setTrades] = useState<{
    trades: Trade[];
    linkedAccounts: LinkedAccountStatusRef[];
  }>();
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
    <SafeAreaView style={[styles.container]}>
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
          <View
            key={`trade-${index}`}
            style={{
              padding: 20,
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
              backgroundColor: "white",
            }}
          >
            <Text>
              {trade.counterparty.kind} - {trade.dateTime} - {trade.state}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
