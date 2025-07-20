import { KV } from "@/app/Utils";
import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

export function DetailScrollView({ flattened }: { flattened: KV[] }) {
  return (
    <ScrollView>
      <View style={styles.section}>
        {flattened.map((kv) => (
          <View key={kv.path} style={styles.accountRow}>
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
