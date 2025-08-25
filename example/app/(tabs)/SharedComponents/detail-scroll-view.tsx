import { KV } from "@/app/Utils";
import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";

export function DetailScrollView({ flattened }: { flattened: KV[] }) {
  return (
    <ScrollView>
      <View style={styles.section}>
        {flattened.map((kv) => (
          <View
            key={kv.path}
            style={styles.accountRow}
            onTouchEnd={() => {
              Clipboard.setStringAsync(kv.value).then(() => {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
              });
            }}
          >
            <Text style={styles.kvKey}>{kv.path}</Text>
            <Text style={styles.kvValue}>{kv.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
    gap: 12,
  },
  accountRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
  },
  kvKey: {
    fontSize: 12,
    fontWeight: "600",
    color: "#222",
  },
  kvValue: {
    fontSize: 12,
    color: "#444",
    marginTop: 2,
  },
});
