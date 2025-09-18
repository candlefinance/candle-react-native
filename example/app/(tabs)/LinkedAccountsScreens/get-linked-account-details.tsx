import {
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useCandle } from "react-native-candle";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { LinkedAccount } from "react-native-candle";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { flattenObject } from "../../Utils";
import { DetailScrollView } from "../SharedComponents/detail-scroll-view";

type TabParamList = {
  GetLinkedAccountDetails: {
    account: LinkedAccount;
    onUnlinked?: () => void;
  };
};

type GetLinkedAccountDetailsRouteProp = RouteProp<
  TabParamList,
  "GetLinkedAccountDetails"
>;

export default function GetLinkedAccountDetailsScreen() {
  const candle = useCandle();
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const {
    params: { account, onUnlinked },
  } = useRoute<GetLinkedAccountDetailsRouteProp>();

  const flattened = flattenObject(account);

  const unlink = async (accountId: string) => {
    try {
      setIsLoading(true);
      await candle.unlinkAccount({
        linkedAccountID: accountId,
      });
      if (onUnlinked) {
        onUnlinked();
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Unlink Account Error", `${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container]} edges={["bottom"]}>
      <DetailScrollView flattened={flattened} />
      <TouchableOpacity
        disabled={isLoading}
        style={styles.button}
        onPress={() => {
          Alert.alert(
            `Unlink Account`,
            `Are you sure you want to unlink ${account.service}?`,
            [
              {
                text: "Unlink",
                style: "destructive",
                onPress: () => {
                  unlink(account.linkedAccountID);
                },
              },
              {
                text: "Cancel",
                style: "cancel",
              },
            ]
          );
        }}
      >
        <ActivityIndicator
          animating={isLoading}
          color="black"
          style={{
            position: "absolute",
            left: 16,
          }}
        />
        <Text
          style={{
            color: "black",
            fontSize: 18,
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          Unlink {account.service}
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
  },
});
