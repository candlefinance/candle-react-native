import { Image, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export function SharedListRow({
  onTouchEnd,
  uri,
  title,
  subtitle,
}: {
  onTouchEnd: () => void;
  uri: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View
      style={{
        padding: 20,
        alignItems: "center",
        flexDirection: "row",
        gap: 16,
        backgroundColor: "white",
      }}
      onTouchEnd={() => {
        onTouchEnd();
      }}
    >
      <Image
        source={{
          uri: uri,
          width: 50,
          height: 50,
        }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
      <View style={{ flex: 1, gap: 4 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          {title}
        </Text>
        <Text style={{ color: "gray" }}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={24} color="gray" />
    </View>
  );
}
