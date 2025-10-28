import { createContext, useContext } from "react";
import type {
  AssetAccount,
  AssetAccountsQuery,
  AssetAccountRef,
  TradeQuoteAssetKind,
  LinkedAccount,
  LinkedAccountRef,
  LinkedAccountStatusRef,
  PresentationBackground,
  PresentationStyle,
  Service,
  Trade,
  TradeRef,
  TradesQuery,
  TradeQuote,
  TradeQuotesRequest,
  TradeAssetKind,
} from "./types";

export type CandleContextValue = {
  presentCandleTradeExecutionSheet: <
    GainedAssetKind extends TradeQuoteAssetKind,
    LostAssetKind extends TradeQuoteAssetKind
  >(input: {
    tradeQuote: TradeQuote<GainedAssetKind, LostAssetKind>;
    presentationBackground?: PresentationBackground;
    completion?: (
      result:
        | ({ kind: "success" } & Trade<GainedAssetKind, LostAssetKind>)
        | { kind: "failure"; error: Error }
    ) => void;
  }) => void;

  presentCandleLinkSheet: (input: {
    services?: Service[];
    cornerRadius?: number;
    customerName?: string;
    showSandbox?: boolean;
    showDynamicLoading?: boolean;
    presentationBackground?: PresentationBackground;
    presentationStyle?: PresentationStyle;
    onSuccess: (account: LinkedAccount) => void;
  }) => void;

  getLinkedAccounts: () => Promise<LinkedAccount[]>;
  getLinkedAccount: (ref: LinkedAccountRef) => Promise<LinkedAccount>;
  unlinkAccount: (ref: LinkedAccountRef) => Promise<void>;

  createUser: (input: { appUserID: string }) => Promise<void>;
  deleteUser: () => Promise<void>;

  getAssetAccounts: (query?: AssetAccountsQuery) => Promise<{
    assetAccounts: AssetAccount[];
    linkedAccounts: LinkedAccountStatusRef[];
  }>;
  getAssetAccount: (ref: AssetAccountRef) => Promise<AssetAccount>;

  getTrades: (query?: TradesQuery) => Promise<{
    trades: Trade<TradeAssetKind, TradeAssetKind>[];
    linkedAccounts: LinkedAccountStatusRef[];
  }>;
  getTrade: (input: TradeRef) => Promise<Trade<TradeAssetKind, TradeAssetKind>>;

  getTradeQuotes: <
    GainedAssetKind extends TradeQuoteAssetKind,
    LostAssetKind extends TradeQuoteAssetKind
  >(
    request: TradeQuotesRequest<GainedAssetKind, LostAssetKind>
  ) => Promise<{
    tradeQuotes: TradeQuote<GainedAssetKind, LostAssetKind>[];
    linkedAccounts: LinkedAccountStatusRef[];
  }>;
  executeTrade: <
    GainedAssetKind extends TradeQuoteAssetKind,
    LostAssetKind extends TradeQuoteAssetKind
  >(
    tradeQuote: TradeQuote<GainedAssetKind, LostAssetKind>
  ) => Promise<Trade<GainedAssetKind, LostAssetKind>>;
};

export const CandleContext = createContext<CandleContextValue | null>(null);

export const useCandle = () => {
  const ctx = useContext(CandleContext);
  if (ctx === null) {
    throw new Error(
      "`useCandle` must be used within a <CandleProvider>. Wrap your app's root with <CandleProvider appKey={...} appSecret={...}>."
    );
  }
  return ctx;
};
