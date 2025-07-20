import { createContext, useContext } from "react";
import { CandleClient } from "react-native-candle";

export const CandleClientContext = createContext<CandleClient | null>(null);

export function useCandleClient() {
  const ctx = useContext(CandleClientContext);
  if (ctx === null) {
    throw new Error(
      "useCandleClient must be used within a CandleClientContext provider"
    );
  }
  return ctx;
}
