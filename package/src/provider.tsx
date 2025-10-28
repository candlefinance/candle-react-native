import React, { useLayoutEffect, useMemo, useState } from "react";
import type { CandleContextValue } from "./context";
import { CandleContext } from "./context";
import {
  fromNativeAssetAccount,
  fromNativeLinkedAccount,
  fromNativeTrade,
  fromNativeTradeAndQuote,
  fromNativeTradeQuoteAndRequest,
  toNativeTradeQuote,
  toNativeTradeQuoteRequest,
  toNativeTradeRef,
} from "./types";
import { NitroModules } from "react-native-nitro-modules";
import type { RNCandle } from "./specs/RNCandle.nitro";

export const CandleProvider: React.FC<{
  children: React.ReactNode;
  appKey: string;
  appSecret: string;
  accessGroup?: string;
}> = ({ appKey, appSecret, accessGroup, children }) => {
  // NOTE: We only use useState here because useRef does not have a true lazy initializer
  const [nativeCandle] = useState<RNCandle>(() =>
    NitroModules.createHybridObject<RNCandle>("RNCandle")
  );

  useLayoutEffect(() => {
    nativeCandle.initialize(appKey, appSecret, accessGroup);
  }, [appKey, appSecret, accessGroup]);

  const value = useMemo(
    (): CandleContextValue => ({
      presentCandleTradeExecutionSheet: ({
        tradeQuote,
        presentationBackground,
        completion,
      }) => {
        const nativeTradeQuote = toNativeTradeQuote(tradeQuote);
        nativeCandle.candleTradeExecutionSheet(
          nativeTradeQuote,
          presentationBackground ?? "default",
          (result) => {
            if (completion === undefined) {
              return;
            }
            if (result.trade !== undefined) {
              const trade = fromNativeTradeAndQuote(tradeQuote)(result.trade);
              completion({
                ...trade,
                kind: "success" as const,
              });
            } else {
              if (result.error === undefined) {
                throw new Error(
                  "Internal Candle Error: corrupted trade execution result."
                );
              } else {
                const error = new Error(result.error);
                completion({ kind: "failure", error });
              }
            }
          }
        );
      },

      presentCandleLinkSheet: ({
        services,
        cornerRadius = 24,
        customerName,
        showDynamicLoading = true,
        presentationBackground = "default",
        presentationStyle = "fullScreen",
        onSuccess,
      }) =>
        nativeCandle.candleLinkSheet(
          true,
          services,
          cornerRadius,
          customerName,
          showDynamicLoading,
          presentationBackground,
          presentationStyle,
          (nativeLinkedAccount) => {
            const linkedAccount = fromNativeLinkedAccount(nativeLinkedAccount);
            onSuccess(linkedAccount);
          }
        ),

      getLinkedAccounts: async () => {
        const nativeLinkedAccounts = await nativeCandle.getLinkedAccounts();
        return nativeLinkedAccounts.map(fromNativeLinkedAccount);
      },
      getLinkedAccount: async (ref) => {
        const nativeLinkedAccount = await nativeCandle.getLinkedAccount(ref);
        return fromNativeLinkedAccount(nativeLinkedAccount);
      },
      unlinkAccount: (ref) => nativeCandle.unlinkAccount(ref),

      createUser: ({ appUserID }) => nativeCandle.createUser(appUserID),
      deleteUser: () => nativeCandle.deleteUser(),

      getAssetAccounts: async (query = {}) => {
        const nativeAssetAccountsResponse = await nativeCandle.getAssetAccounts(
          query
        );
        return {
          ...nativeAssetAccountsResponse,
          assetAccounts: nativeAssetAccountsResponse.assetAccounts.map(
            fromNativeAssetAccount
          ),
        };
      },
      getAssetAccount: async (ref) => {
        const nativeAssetAccount = await nativeCandle.getAssetAccount(ref);
        return fromNativeAssetAccount(nativeAssetAccount);
      },

      getTrades: async (query = {}) => {
        const nativeTradesResponse = await nativeCandle.getTrades(query);
        return {
          ...nativeTradesResponse,
          trades: nativeTradesResponse.trades.map(fromNativeTrade),
        };
      },

      getTrade: async (ref) => {
        const nativeRef = toNativeTradeRef(ref);
        const nativeTrade = await nativeCandle.getTrade(nativeRef);
        return fromNativeTrade(nativeTrade);
      },

      getTradeQuotes: async (request) => {
        const nativeRequest = toNativeTradeQuoteRequest(request);
        const nativeTradeQuotesResponse = await nativeCandle.getTradeQuotes(
          nativeRequest
        );
        return {
          ...nativeTradeQuotesResponse,
          tradeQuotes: nativeTradeQuotesResponse.tradeQuotes.map(
            fromNativeTradeQuoteAndRequest(request)
          ),
        };
      },

      executeTrade: async (quote) => {
        const nativeQuote = toNativeTradeQuote(quote);
        const nativeTrade = await nativeCandle.executeTrade(nativeQuote);
        return fromNativeTradeAndQuote(quote)(nativeTrade);
      },
    }),
    [nativeCandle]
  );

  return (
    <CandleContext.Provider value={value}>{children}</CandleContext.Provider>
  );
};
