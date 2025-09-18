import { Slot } from "expo-router";
import { CandleProvider } from "react-native-candle";

export default function RootLayout() {
  const appKey = process.env.EXPO_PUBLIC_CANDLE_APP_KEY;
  const appSecret = process.env.EXPO_PUBLIC_CANDLE_APP_SECRET;
  if (!appKey || !appSecret) {
    throw new Error(
      "EXPO_PUBLIC_CANDLE_APP_KEY and EXPO_PUBLIC_CANDLE_APP_SECRET must be set in .env file"
    );
  }

  return (
    <CandleProvider appKey={appKey} appSecret={appSecret}>
      <Slot />
    </CandleProvider>
  );
}
