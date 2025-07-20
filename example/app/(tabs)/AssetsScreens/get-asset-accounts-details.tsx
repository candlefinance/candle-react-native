import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AssetAccount, LinkedAccountStatusRef } from "react-native-candle";
import { RouteProp, useRoute } from "@react-navigation/native";
import { flattenObject } from "../../Utils";
import { DetailScrollView } from "../SharedComponents/detail-scroll-view";

type TabParamList = {
  GetAssetAccountDetailsScreen: {
    assetAccount: {
      assetAccounts: AssetAccount;
      linkedAccounts: LinkedAccountStatusRef;
    };
  };
};

type GetAssetAccountDetailsRouteProp = RouteProp<
  TabParamList,
  "GetAssetAccountDetailsScreen"
>;

export default function GetAssetAccountDetailsScreen() {
  const {
    params: { assetAccount },
  } = useRoute<GetAssetAccountDetailsRouteProp>();

  const flattened = flattenObject(assetAccount);

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
    padding: 12,
    backgroundColor: "red",
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
  },
});
