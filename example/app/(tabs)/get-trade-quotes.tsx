import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useCandleClient } from "../Context/candle-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { LinkedAccountStatusRef, TradeQuote } from "react-native-candle";

export default function GetTradeQuotesScreen() {
  const [quotes, setQuotes] = useState<{
    tradeQuotes: TradeQuote<"transport", "fiat">[];
    linkedAccounts: LinkedAccountStatusRef[];
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState<{ latitude: string; longitude: string }>(
    {
      latitude: "40.7223",
      longitude: "-73.9754",
    }
  );
  const [destination, setDestination] = useState<{
    latitude: string;
    longitude: string;
  }>({
    latitude: "40.7505",
    longitude: "-73.9935",
  });
  const candleClient = useCandleClient();

  const fetchTradeQuotes = async () => {
    try {
      const accounts = await candleClient.getTradeQuotes({
        lost: {
          assetKind: "fiat",
        },
        gained: {
          originCoordinates: {
            latitude: parseFloat(origin.latitude) || 0,
            longitude: parseFloat(origin.longitude) || 0,
          },
          destinationCoordinates: {
            latitude: parseFloat(destination.latitude) || 0,
            longitude: parseFloat(destination.longitude) || 0,
          },
          assetKind: "transport",
        },
      });
      setQuotes(accounts);
    } catch (error) {
      Alert.alert(`Failed to fetch trades: ${error}`);
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView contentInsetAdjustmentBehavior={"always"}>
        <View style={{ padding: 16, gap: 12 }}>
          <Text style={{ fontWeight: "600" }}>Origin Coordinates</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              style={styles.input}
              placeholder="Latitude"
              value={origin.latitude}
              onChangeText={(text) =>
                setOrigin((prev) => ({ ...prev, latitude: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Longitude"
              value={origin.longitude}
              onChangeText={(text) =>
                setOrigin((prev) => ({ ...prev, longitude: text }))
              }
            />
          </View>
          <Text style={{ fontWeight: "600" }}>Destination Coordinates</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              style={styles.input}
              placeholder="Latitude"
              value={destination.latitude}
              onChangeText={(text) =>
                setDestination((prev) => ({ ...prev, latitude: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Longitude"
              value={destination.longitude}
              onChangeText={(text) =>
                setDestination((prev) => ({ ...prev, longitude: text }))
              }
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#222",
              borderRadius: 6,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              padding: 12,
            }}
            onPress={() => {
              setIsLoading(true);
              fetchTradeQuotes().finally(() => setIsLoading(false));
            }}
            disabled={isLoading}
          >
            <ActivityIndicator
              animating={isLoading}
              color="white"
              style={{
                position: "absolute",
                left: 16,
              }}
            />
            <Text style={{ color: "white", fontWeight: "600" }}>
              Fetch Quotes
            </Text>
          </TouchableOpacity>
        </View>
        {quotes?.tradeQuotes.map((quote, index) => (
          <View
            key={`quote-${index}`}
            style={{
              padding: 20,
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
              backgroundColor: "white",
            }}
            onTouchEnd={() => {
              candleClient.presentCandleTradeExecutionSheet({
                tradeQuote: quote,
                presentationBackground: "blur",
                completion: (result) => {
                  switch (result.kind) {
                    case "success":
                      break;
                    case "failure":
                      Alert.alert(
                        "Trade execution failed",
                        result.error.message
                      );
                      break;
                  }
                },
              });
            }}
          >
            <Image
              source={{ uri: quote.gained.imageURL }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
              resizeMode="contain"
            />
            <View>
              <Text>
                {quote.gained.name} - ${quote.lost.amount.toFixed(2)}
              </Text>
              <Text style={{ color: "gray", flex: 1 }}>
                {quote.gained.description}
              </Text>
            </View>
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
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
