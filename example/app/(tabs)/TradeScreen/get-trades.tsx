import {
  RefreshControl,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Text,
  Button,
  Platform,
  View,
} from "react-native";
import { useCandleClient } from "../../Context/candle-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import {
  LinkedAccountStatusRef,
  Trade,
  useCandleClient,
} from "react-native-candle";
import { SharedListRow } from "../SharedComponents/shared-list-row";
import { useNavigation } from "@react-navigation/native";
import { getLogo } from "@/app/Utils";
import { MenuView, MenuComponentRef } from "@react-native-menu/menu";

export default function GetTradesScreen() {
  const menuRef = useRef<MenuComponentRef>(null);

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
    navigation.setOptions({
      headerRight: () => (
        <MenuView
          ref={menuRef}
          title="Menu Title"
          onPressAction={({ nativeEvent }) => {
            console.warn(JSON.stringify(nativeEvent));
          }}
          actions={[
            {
              id: "add",
              title: "Add",
              titleColor: "#2367A2",
              image: Platform.select({
                ios: "plus",
                android: "ic_menu_add",
              }),
              imageColor: "#2367A2",
              subactions: [
                {
                  id: "nested1",
                  title: "Nested action",
                  titleColor: "rgba(250,180,100,0.5)",
                  subtitle: "State is mixed",
                  image: Platform.select({
                    ios: "heart.fill",
                    android: "ic_menu_today",
                  }),
                  imageColor: "rgba(100,200,250,0.3)",
                  state: "mixed",
                },
                {
                  id: "nestedDestructive",
                  title: "Destructive Action",
                  attributes: {
                    destructive: true,
                  },
                  image: Platform.select({
                    ios: "trash",
                    android: "ic_menu_delete",
                  }),
                },
              ],
            },
            {
              id: "share",
              title: "Share Action",
              titleColor: "#46F289",
              subtitle: "Share action on SNS",
              image: Platform.select({
                ios: "square.and.arrow.up",
                android: "ic_menu_share",
              }),
              imageColor: "#46F289",
              state: "on",
            },
            {
              id: "destructive",
              title: "Destructive Action",
              attributes: {
                destructive: true,
              },
              image: Platform.select({
                ios: "trash",
                android: "ic_menu_delete",
              }),
            },
          ]}
          shouldOpenOnLongPress={false}
        >
          <View>
            <Text>Test Menu</Text>
          </View>
        </MenuView>
      ),
    });
  }, []);

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
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            paddingHorizontal: 20,
            marginVertical: 20,
          }}
        >
          {trades?.linkedAccounts == undefined ? "" : "Linked Accounts"}
        </Text>
        {trades?.linkedAccounts.map((account, index) => (
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
          {trades?.linkedAccounts == undefined ? "" : "Trades"}
        </Text>
        {trades?.trades.map((trade, index) => (
          <SharedListRow
            title={
              trade.lost.assetKind == "transport"
                ? trade.lost.name
                : trade.state
            }
            subtitle={trade.dateTime}
            uri={
              trade.counterparty.kind == "user"
                ? trade.counterparty.avatarURL
                : ""
            }
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
