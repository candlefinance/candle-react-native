# react-native-candle

---

## Installation

```
npm install react-native-candle react-native-nitro-modules
```

```
yarn add react-native-candle react-native-nitro-modules
```

```
bun add react-native-candle react-native-nitro-modules
```

If you are using Expo add the plugin to your `app.json`

```json
"plugins": [
  // other plugins
  "react-native-candle",
  [
    "expo-build-properties",
    {
      "ios": {
        "deploymentTarget": "17.0",
        "useFrameworks": "dynamic"
      }
    }
  ]
],
```

## Usage

#### Public API

```ts
import { useState } from "react";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import {
  deleteUser,
  unlinkAccount,
  executeTool,
  getAvailableTools,
  getFiatAccounts,
  getActivity,
  getLinkedAccounts,
  presentCandleLinkSheet,
} from "react-native-candle";

export default function TabOneScreen() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View style={[styles.container]}>
      <ActivityIndicator animating={isLoading} />
      <Button
        title="Unlink Account"
        onPress={() => {
          setIsLoading(true);
          unlinkAccount("linkedAccountID") // Replace with actual linked account ID
            .then(() => {
              console.log("User unlinked successfully.");
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error unlinking user:", error);
              setIsLoading(false);
            });
        }}
      />
      <Button
        title="Delete User"
        onPress={() => {
          setIsLoading(true);
          deleteUser()
            .then(() => {
              console.log("User deleted successfully.");
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error deleting user:", error);
              setIsLoading(false);
            });
        }}
      />
      <Button
        title="Get Available Tools"
        onPress={() => {
          setIsLoading(true);
          getAvailableTools()
            .then((tools) => {
              console.log("Available tools:", tools);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching available tools:", error);
              setIsLoading(false);
            });
        }}
      />
      <Button
        title="Execute Tool"
        onPress={() => {
          setIsLoading(true);
          executeTool({ arguments: "", name: "get_linked_accounts" })
            .then((result) => {
              console.log("Tool executed successfully:", result);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error executing tool:", error);
              setIsLoading(false);
            });
        }}
      />
      <Button
        title="Get Fiat Accounts"
        onPress={() => {
          setIsLoading(true);
          getFiatAccounts()
            .then((accounts) => {
              console.log("Fiat accounts:", accounts);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching fiat accounts:", error);
              setIsLoading(false);
            });
        }}
      />
      <Button
        title="Get Activity"
        onPress={() => {
          setIsLoading(true);
          getActivity("P1D")
            .then((activity) => {
              console.log("Activity:", activity);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching activity:", error);
              setIsLoading(false);
            });
        }}
      />
      <Button
        title="Get Linked Accounts"
        onPress={() => {
          setIsLoading(true);
          getLinkedAccounts()
            .then((accounts) => {
              console.log("Linked accounts:", accounts);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching linked accounts:", error);
            });
        }}
      />
      <Button
        title="Show Candle Sheet"
        onPress={() => {
          presentCandleLinkSheet({
            onSuccess: (linkedAccount) => {
              console.log("Account selected:", linkedAccount);
            },
            customerName: "Akme Inc.",
            presentationStyle: "fullScreen",
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
```
