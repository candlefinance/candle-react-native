import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useCandleClient } from "../../Context/candle-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { AssetKind, GetTradeQuotesResponse } from "react-native-candle";
import { SharedListRow } from "../SharedComponents/shared-list-row";
import { useNavigation } from "@react-navigation/native";
import { getLogo } from "@/app/Utils";

export default function GetTradeQuotesScreen() {
  const candleClient = useCandleClient();
  const navigation = useNavigation<any>();
  const [quotes, setQuotes] =
    useState<GetTradeQuotesResponse<AssetKind, AssetKind>>();
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
  const [serviceAccountID, setServiceAccountID] = useState("");

  const fetchTradeQuotes = async () => {
    try {
      const accounts = await candleClient.getTradeQuotes({
        lost: {
          assetKind: "fiat",
        },
        gained: {
          serviceAccountID: serviceAccountID,
          originCoordinates: {
            latitude: parseFloat(origin.latitude),
            longitude: parseFloat(origin.longitude),
          },
          destinationCoordinates: {
            latitude: parseFloat(destination.latitude),
            longitude: parseFloat(destination.longitude),
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
          <Text style={{ fontWeight: "600" }}>Service Account ID</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              style={styles.input}
              placeholder="Service Account ID"
              value={serviceAccountID}
              onChangeText={(text) => setServiceAccountID(text)}
            />
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
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
              {isLoading ? "Fetching Quotes" : "Fetch Quotes"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            paddingHorizontal: 20,
            marginVertical: 20,
          }}
        >
          {quotes?.linkedAccounts == undefined ? "" : "Linked Accounts"}
        </Text>
        {quotes?.linkedAccounts.map((account, index) => (
          <SharedListRow
            key={account.linkedAccountID}
            title={account.service}
            subtitle={account.state}
            uri={getLogo(account.service)}
          />
        ))}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            paddingHorizontal: 20,
            marginVertical: 20,
          }}
        >
          {quotes?.linkedAccounts == undefined ? "" : "Trade Quotes"}
        </Text>
        {quotes?.tradeQuotes.map((quote, index) =>
          quote.lost.assetKind === "fiat" &&
          quote.gained.assetKind === "transport" ? (
            <SharedListRow
              subtitle={quote.gained.name}
              title={`$${quote.lost.amount.toFixed(2)}`}
              uri={quote.gained.imageURL}
              onTouchEnd={() => {
                navigation.navigate("Get Trade Quotes Details Screen", {
                  quote: {
                    tradeQuotes: quote,
                    linkedAccounts: quotes.linkedAccounts[index],
                  },
                });
              }}
              key={`quote-${index}`}
            />
          ) : null
        )}
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
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  primaryButton: {
    padding: 12,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
  },
});
