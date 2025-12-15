import type {
  ACHDetails,
  ActiveLinkedAccountDetails,
  FiatAsset,
  FiatAssetQuoteRequest,
  FiatAssetRef,
  FiatMarketAccountKind,
  LinkedAccount as _LinkedAccount,
  MarketAssetQuoteRequest,
  MarketTradeAsset,
  MarketTradeAssetRef,
  MerchantCounterparty,
  NothingAsset,
  NothingAssetQuoteRequest,
  NothingAssetRef,
  OtherAsset,
  OtherAssetRef,
  OtherAssetQuoteRequest,
  Service,
  ServiceCounterparty,
  TradeState,
  TransportAccountKind,
  TransportAsset,
  TransportAssetQuoteRequest,
  TransportAssetRef,
  UserCounterparty,
  WireDetails,
  Trade as _Trade,
  TradeQuotesRequest as _TradeQuotesRequest,
  LinkedAccountDetails as _LinkedAccountDetails,
  AssetAccount as _AssetAccount,
  TradeRef as _TradeRef,
  TradeAssetRef as _TradeAssetRef,
  TradeAsset as _TradeAsset,
  TradeQuote as _TradeQuote,
  Counterparty as _Counterparty,
  CounterpartyQuoteRequest as _CounterpartyQuoteRequest,
  TradeAssetQuoteRequest as _TradeAssetQuoteRequest,
  InactiveLinkedAccountDetails,
  UnavailableLinkedAccountDetails,
  TradeAssetKind,
  MerchantCounterpartyQuoteRequest,
  ServiceCounterpartyQuoteRequest,
  UserCounterpartyQuoteRequest,
} from "./specs/RNCandle.nitro";

export type {
  ACHDetails,
  ActiveLinkedAccountDetails,
  FiatAsset,
  FiatAssetQuoteRequest,
  FiatAssetRef,
  FiatMarketAccountKind,
  MarketAssetQuoteRequest,
  UserCounterpartyQuoteRequest,
  OtherAssetQuoteRequest,
  MerchantCounterpartyQuoteRequest,
  ServiceCounterpartyQuoteRequest,
  MarketTradeAsset,
  MarketTradeAssetRef,
  MerchantCounterparty,
  NothingAsset,
  NothingAssetQuoteRequest,
  NothingAssetRef,
  OtherAsset,
  OtherAssetRef,
  Service,
  ServiceCounterparty,
  TradeState,
  TransportAccountKind,
  TransportAsset,
  TradesQuery,
  TransportAssetQuoteRequest,
  TransportAssetRef,
  UserCounterparty,
  WireDetails,
  PresentationBackground,
  PresentationStyle,
  LinkedAccountRef,
  AssetAccountsQuery,
  AssetAccountRef,
  TradeAssetKind,
  LinkedAccountStatusRef,
} from "./specs/RNCandle.nitro";

export type TradeQuoteAssetKind =
  | "nothing"
  | "transport"
  | "fiat"
  | "stock"
  | "crypto";

// Discriminated unions

export type TradeAssetQuoteRequest =
  | ({
      assetKind: "nothing";
    } & NothingAssetQuoteRequest)
  | ({ assetKind: "transport" } & TransportAssetQuoteRequest)
  | ({ assetKind: "fiat" } & FiatAssetQuoteRequest)
  | ({ assetKind: "stock" | "crypto" } & MarketAssetQuoteRequest)
  | ({ assetKind: "other" } & OtherAssetQuoteRequest);

export type CounterpartyQuoteRequest =
  | ({
      kind: "user";
    } & UserCounterpartyQuoteRequest)
  | ({ kind: "merchant" } & MerchantCounterpartyQuoteRequest)
  | ({ kind: "service" } & ServiceCounterpartyQuoteRequest);

export type TradeAsset =
  | ({
      assetKind: "nothing";
    } & NothingAsset)
  | ({
      assetKind: "other";
    } & OtherAsset)
  | ({ assetKind: "transport" } & TransportAsset)
  | ({ assetKind: "fiat" } & FiatAsset)
  | ({ assetKind: "stock" | "crypto" } & MarketTradeAsset);

export type Counterparty =
  | ({ kind: "merchant" } & MerchantCounterparty)
  | ({
      kind: "user";
    } & UserCounterparty)
  | ({
      kind: "service";
    } & ServiceCounterparty);

export type AssetAccount = {
  serviceAccountID: string;
  nickname: string;
  linkedAccountID: string;
  service: Service;
} & (
  | {
      assetKind: "fiat";
      accountKind: FiatMarketAccountKind;
      currencyCode: string;
      balance?: number;
      ach?: ACHDetails;
      wire?: WireDetails;
    }
  | {
      assetKind: "stock" | "crypto";
      accountKind: FiatMarketAccountKind;
    }
  | {
      assetKind: "transport";
      accountKind: TransportAccountKind;
    }
);

export type TradeAssetRef =
  | ({ assetKind: "transport" } & TransportAssetRef)
  | ({ assetKind: "nothing" } & NothingAssetRef)
  | ({ assetKind: "other" } & OtherAssetRef)
  | ({ assetKind: "fiat" } & FiatAssetRef)
  | ({ assetKind: "stock" | "crypto" } & MarketTradeAssetRef);

export type LinkedAccountDetails =
  | ({ state: "active" } & ActiveLinkedAccountDetails)
  | ({ state: "inactive" } & InactiveLinkedAccountDetails)
  | ({ state: "unavailable" } & UnavailableLinkedAccountDetails);

// Composite types

export type TradeQuotesRequest<
  GainedAssetKind extends TradeQuoteAssetKind,
  LostAssetKind extends TradeQuoteAssetKind
> = {
  linkedAccountIDs?: string;
  gained: TradeAssetQuoteRequest & { assetKind: GainedAssetKind };
  lost: TradeAssetQuoteRequest & { assetKind: LostAssetKind };
  counterparty?: CounterpartyQuoteRequest;
};

export type TradeRef = {
  lost: TradeAssetRef;
  gained: TradeAssetRef;
};

export type TradeQuote<
  GainedAssetKind extends TradeQuoteAssetKind,
  LostAssetKind extends TradeQuoteAssetKind
> = {
  gained: TradeAsset & { assetKind: GainedAssetKind };
  lost: TradeAsset & { assetKind: LostAssetKind };
  counterparty: Counterparty;
  context: string;
  expirationDateTime: string;
};

export type Trade<
  GainedAssetKind extends TradeAssetKind,
  LostAssetKind extends TradeAssetKind
> = {
  dateTime: string;
  state: TradeState;
  counterparty: Counterparty;
  gained: TradeAsset & { assetKind: GainedAssetKind };
  lost: TradeAsset & { assetKind: LostAssetKind };
};

export type LinkedAccount = Omit<_LinkedAccount, "details"> & {
  details: LinkedAccountDetails;
};

// TO discriminated unions

export const toNativeTradeAssetRef = (
  tradeAssetRef: TradeAssetRef
): _TradeAssetRef => {
  switch (tradeAssetRef.assetKind) {
    case "fiat":
      return { fiatAssetRef: tradeAssetRef };
    case "stock":
    case "crypto":
      return { marketTradeAssetRef: tradeAssetRef };
    case "transport":
      return { transportAssetRef: tradeAssetRef };
    case "other":
      return { otherAssetRef: tradeAssetRef };
    case "nothing":
      return { nothingAssetRef: tradeAssetRef };
  }
};

export const toNativeTradeAsset = (tradeAsset: TradeAsset): _TradeAsset => {
  switch (tradeAsset.assetKind) {
    case "fiat":
      return { fiatAsset: tradeAsset };
    case "stock":
    case "crypto":
      return { marketTradeAsset: tradeAsset };
    case "transport":
      return { transportAsset: tradeAsset };
    case "other":
      return { otherAsset: tradeAsset };
    case "nothing":
      return { nothingAsset: tradeAsset };
  }
};

export const toNativeCounterparty = (
  counterparty: Counterparty
): _Counterparty => {
  switch (counterparty.kind) {
    case "user":
      return { userCounterparty: counterparty };
    case "merchant":
      return { merchantCounterparty: counterparty };
    case "service":
      return { serviceCounterparty: counterparty };
  }
};

export const toNativeTradeAssetQuoteRequest = (
  tradeAssetQuoteRequest: TradeAssetQuoteRequest
): _TradeAssetQuoteRequest => {
  switch (tradeAssetQuoteRequest.assetKind) {
    case "fiat":
      return { fiatAssetQuoteRequest: tradeAssetQuoteRequest };
    case "stock":
    case "crypto":
      return { marketAssetQuoteRequest: tradeAssetQuoteRequest };
    case "transport":
      return { transportAssetQuoteRequest: tradeAssetQuoteRequest };
    case "other":
      return { otherAssetQuoteRequest: tradeAssetQuoteRequest };
    case "nothing":
      return { nothingAssetQuoteRequest: tradeAssetQuoteRequest };
  }
};

export const toNativeCounterpartyQuoteRequest = (
  counterpartyQuoteRequest: CounterpartyQuoteRequest
): _CounterpartyQuoteRequest => {
  switch (counterpartyQuoteRequest.kind) {
    case "user":
      return { userCounterpartyQuoteRequest: counterpartyQuoteRequest };
    case "merchant":
      return { merchantCounterpartyQuoteRequest: counterpartyQuoteRequest };
    case "service":
      return { serviceCounterpartyQuoteRequest: counterpartyQuoteRequest };
  }
};

// TO composite types

export const toNativeTradeQuote = (
  tradeQuote: TradeQuote<TradeQuoteAssetKind, TradeQuoteAssetKind>
): _TradeQuote => ({
  ...tradeQuote,
  gained: toNativeTradeAsset(tradeQuote.gained),
  lost: toNativeTradeAsset(tradeQuote.lost),
  counterparty: toNativeCounterparty(tradeQuote.counterparty),
});

export const toNativeTradeQuoteRequest = (
  tradeQuoteRequest: TradeQuotesRequest<
    TradeQuoteAssetKind,
    TradeQuoteAssetKind
  >
): _TradeQuotesRequest => ({
  ...tradeQuoteRequest,
  gained: toNativeTradeAssetQuoteRequest(tradeQuoteRequest.gained),
  lost: toNativeTradeAssetQuoteRequest(tradeQuoteRequest.lost),
  counterparty:
    tradeQuoteRequest.counterparty === undefined
      ? undefined
      : toNativeCounterpartyQuoteRequest(tradeQuoteRequest.counterparty),
});

export const toNativeTradeRef = (tradeRef: TradeRef): _TradeRef => ({
  gained: toNativeTradeAssetRef(tradeRef.gained),
  lost: toNativeTradeAssetRef(tradeRef.lost),
});

// FROM discriminated unions

export const fromNativeTradeAsset = (
  nativeTradeAsset: _TradeAsset
): TradeAsset => {
  const {
    fiatAsset,
    marketTradeAsset,
    transportAsset,
    otherAsset,
    nothingAsset,
  } = nativeTradeAsset;

  if (fiatAsset !== undefined) {
    return {
      ...fiatAsset,
      assetKind: "fiat",
    };
  } else if (marketTradeAsset !== undefined) {
    return {
      ...marketTradeAsset,
      assetKind: marketTradeAsset.assetKind,
    };
  } else if (transportAsset !== undefined) {
    return {
      ...transportAsset,
      assetKind: "transport",
    };
  } else if (otherAsset !== undefined) {
    return { assetKind: "other" };
  } else if (nothingAsset !== undefined) {
    return { assetKind: "nothing" };
  } else {
    throw new Error("Internal Candle Error: corrupted trade asset.");
  }
};

export const fromNativeCounterparty = (
  nativeCounterparty: _Counterparty
): Counterparty => {
  const { merchantCounterparty, userCounterparty, serviceCounterparty } =
    nativeCounterparty;

  if (merchantCounterparty !== undefined) {
    return {
      ...merchantCounterparty,
      kind: "merchant",
    };
  } else if (userCounterparty !== undefined) {
    return {
      ...userCounterparty,
      kind: "user",
    };
  } else if (serviceCounterparty !== undefined) {
    return {
      ...serviceCounterparty,
      kind: "service",
    };
  } else {
    throw new Error("Internal Candle Error: corrupted counterparty.");
  }
};

export const fromNativeAssetAccount = (
  nativeAssetAccount: _AssetAccount
): AssetAccount => {
  const { fiatAccount, marketAccount, transportAccount } = nativeAssetAccount;

  if (fiatAccount !== undefined) {
    return {
      ...fiatAccount,
      assetKind: "fiat",
    };
  } else if (marketAccount !== undefined) {
    return {
      ...marketAccount,
      assetKind: marketAccount.assetKind,
    };
  } else if (transportAccount !== undefined) {
    return {
      ...transportAccount,
      assetKind: "transport",
    };
  } else {
    throw new Error("Internal Candle Error: corrupted asset account.");
  }
};

export const fromNativeLinkedAccountDetails = (
  nativeLinkedAccountDetails: _LinkedAccountDetails
): LinkedAccountDetails => {
  const {
    activeLinkedAccountDetails,
    inactiveLinkedAccountDetails,
    unavailableLinkedAccountDetails,
  } = nativeLinkedAccountDetails;

  if (activeLinkedAccountDetails !== undefined) {
    return {
      ...activeLinkedAccountDetails,
      state: "active",
    };
  } else if (inactiveLinkedAccountDetails !== undefined) {
    return {
      ...inactiveLinkedAccountDetails,
      state: "inactive",
    };
  } else if (unavailableLinkedAccountDetails !== undefined) {
    return {
      ...unavailableLinkedAccountDetails,
      state: "unavailable",
    };
  } else {
    throw new Error("Internal Candle Error: corrupted linked account details");
  }
};

// FROM composite types

export const fromNativeLinkedAccount = (
  nativeLinkedAccount: _LinkedAccount
): LinkedAccount => ({
  ...nativeLinkedAccount,
  details: fromNativeLinkedAccountDetails(nativeLinkedAccount.details),
});

export const fromNativeTrade = (
  nativeTrade: _Trade
): Trade<TradeAssetKind, TradeAssetKind> => ({
  ...nativeTrade,
  counterparty: fromNativeCounterparty(nativeTrade.counterparty),
  lost: fromNativeTradeAsset(nativeTrade.lost),
  gained: fromNativeTradeAsset(nativeTrade.gained),
});

export const fromNativeTradeAndQuote =
  <
    GainedAssetKind extends TradeQuoteAssetKind,
    LostAssetKind extends TradeQuoteAssetKind
  >(
    tradeQuote: TradeQuote<GainedAssetKind, LostAssetKind>
  ) =>
  (nativeTrade: _Trade): Trade<GainedAssetKind, LostAssetKind> => ({
    ...nativeTrade,
    counterparty: fromNativeCounterparty(nativeTrade.counterparty),
    gained: assertTradeAsset({
      tradeAsset: fromNativeTradeAsset(nativeTrade.gained),
      expectedAssetKind: tradeQuote.gained.assetKind,
    }),
    lost: assertTradeAsset({
      tradeAsset: fromNativeTradeAsset(nativeTrade.lost),
      expectedAssetKind: tradeQuote.lost.assetKind,
    }),
  });

export const fromNativeTradeQuoteAndRequest =
  <
    GainedAssetKind extends TradeQuoteAssetKind,
    LostAssetKind extends TradeQuoteAssetKind
  >(
    tradeQuoteRequest: TradeQuotesRequest<GainedAssetKind, LostAssetKind>
  ) =>
  (
    nativeTradeQuote: _TradeQuote
  ): TradeQuote<GainedAssetKind, LostAssetKind> => ({
    ...nativeTradeQuote,
    gained: assertTradeAsset({
      tradeAsset: fromNativeTradeAsset(nativeTradeQuote.gained),
      expectedAssetKind: tradeQuoteRequest.gained.assetKind,
    }),
    lost: assertTradeAsset({
      tradeAsset: fromNativeTradeAsset(nativeTradeQuote.lost),
      expectedAssetKind: tradeQuoteRequest.lost.assetKind,
    }),
    counterparty: fromNativeCounterparty(nativeTradeQuote.counterparty),
  });

// Generics assertions

export const assertTradeAsset = <
  ExpectedAssetKind extends TradeQuoteAssetKind
>(input: {
  tradeAsset: TradeAsset;
  expectedAssetKind: ExpectedAssetKind;
}): TradeAsset & {
  assetKind: ExpectedAssetKind;
} => {
  if (input.tradeAsset.assetKind !== input.expectedAssetKind) {
    throw new Error("Internal Candle Error: unexpected trade asset kind.");
  }
  // NOTE: This cast is due to a TypeScript generics limitation and should be cleaned up when possible
  return input.tradeAsset as TradeAsset & {
    assetKind: ExpectedAssetKind;
  };
};
