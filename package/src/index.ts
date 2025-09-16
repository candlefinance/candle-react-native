import { NitroModules } from "react-native-nitro-modules";
import type {
  ACHDetails,
  ActiveLinkedAccountDetails,
  Address,
  AppUser,
  AssetAccountQuery,
  AssetAccountRef,
  Coordinates,
  FiatAsset,
  FiatAssetQuoteRequest,
  FiatAssetRef,
  FiatMarketAccountKind,
  AssetAccount as InternalAssetAccount,
  Counterparty as InternalCounterparty,
  TradeAsset as InternalTradeAsset,
  TradeAssetRef as InternalTradeAssetRef,
  TradeQuery as InternalTradeQuery,
  TradeQuote as InternalTradeQuote,
  LinkedAccount,
  LinkedAccountRef,
  LinkedAccountStatusRef,
  MarketAssetQuoteRequest,
  MarketTradeAsset,
  MarketTradeAssetRef,
  MerchantCounterparty,
  NothingAsset,
  NothingAssetQuoteRequest,
  NothingAssetRef,
  OtherAsset,
  OtherAssetRef,
  PresentationBackground,
  PresentationStyle,
  RNCandle,
  Service,
  ServiceCounterparty,
  TradeAssetQuoteRequest,
  TradeState,
  TransportAccountKind,
  TransportAsset,
  TransportAssetQuoteRequest,
  TransportAssetRef,
  UserCounterparty,
  WireDetails,
} from "./specs/RNCandle.nitro";

let _candle: RNCandle | undefined;
const getCandle = (): RNCandle => {
  if (_candle === undefined) {
    throw Error(
      `Candle has not been initialized. In your app's launch handler (e.g. in index.ts before AppRegistry.registerComponent), call \`candle.initialize({ appKey: ..., appSecret: ... })\``
    );
  }
  return _candle;
};

export const candle = {
  initialize: (input: {
    appKey: string;
    appSecret: string;
    accessGroup?: string;
  }): void => {
    if (_candle === undefined) {
      _candle = NitroModules.createHybridObject<RNCandle>("RNCandle");
    }

    _candle.initialize(input.appKey, input.appSecret, input.accessGroup);
  },

  presentCandleTradeExecutionSheet: <
    GainedAssetKind extends AssetKind,
    LostAssetKind extends AssetKind
  >(input: {
    tradeQuote: TradeQuote<GainedAssetKind, LostAssetKind>;
    presentationBackground?: PresentationBackground;
    completion?: (
      result:
        | (Trade & {
            kind: "success";
            gained: { assetKind: GainedAssetKind };
            lost: { assetKind: LostAssetKind };
          })
        | { kind: "failure"; error: Error }
    ) => void;
  }): void => {
    const quote = convertTradeQuote(input.tradeQuote);
    getCandle().candleTradeExecutionSheet(
      quote,
      input.presentationBackground ?? "default",
      (result) => {
        if (input.completion === undefined) {
          return;
        }
        if (result.trade !== undefined) {
          input.completion({
            kind: "success",
            ...result.trade,
            counterparty: convertToCounterparty(result.trade.counterparty),
            lost: assertTradeAsset({
              tradeAsset: convertTradeAsset(result.trade.lost),
              expectedAssetKind: input.tradeQuote.lost.assetKind,
            }),
            gained: assertTradeAsset({
              tradeAsset: convertTradeAsset(result.trade.gained),
              expectedAssetKind: input.tradeQuote.gained.assetKind,
            }),
          });
        } else {
          if (result.error === undefined) {
            throw new Error(
              "Internal Candle Error: corrupted trade execution result."
            );
          } else {
            const error = new Error(result.error);
            input.completion({ kind: "failure", error });
          }
        }
      }
    );
  },

  presentCandleLinkSheet: ({
    services = undefined,
    cornerRadius = 24,
    customerName,
    showDynamicLoading = true,
    presentationBackground = "default",
    presentationStyle = "fullScreen",
    onSuccess,
  }: {
    services?: Service[];
    cornerRadius?: number;
    customerName?: string;
    showSandbox?: boolean;
    showDynamicLoading?: boolean;
    presentationBackground?: PresentationBackground;
    presentationStyle?: PresentationStyle;
    onSuccess: (account: LinkedAccount) => void;
  }): void => {
    getCandle().candleLinkSheet(
      true,
      services,
      cornerRadius,
      customerName,
      showDynamicLoading,
      presentationBackground,
      presentationStyle,
      onSuccess
    );
  },

  getLinkedAccounts: async (): Promise<LinkedAccountDetail[]> => {
    const accounts = await getCandle().getLinkedAccounts();
    return accounts.map((account) => {
      if (account.details.activeLinkedAccountDetails !== undefined) {
        return {
          ...account,
          details: {
            ...account.details.activeLinkedAccountDetails,
            state: "active",
          },
        };
      } else if (account.details.inactiveLinkedAccountDetails !== undefined) {
        return {
          ...account,
          details: {
            ...account.details.inactiveLinkedAccountDetails,
            state: "inactive",
          },
        };
      } else if (
        account.details.unavailableLinkedAccountDetails !== undefined
      ) {
        return {
          ...account,
          details: {
            ...account.details.unavailableLinkedAccountDetails,
            state: "unavailable",
          },
        };
      } else {
        throw new Error("Internal Candle Error: corrupted linked account.");
      }
    });
  },

  getLinkedAccount: async (ref: LinkedAccountRef): Promise<LinkedAccount> =>
    getCandle().getLinkedAccount(ref),

  unlinkAccount: async (ref: LinkedAccountRef): Promise<void> =>
    getCandle().unlinkAccount(ref),

  createUser: async (input: { appUserID: string }): Promise<void> => {
    await getCandle().createUser(input.appUserID);
  },

  deleteUser: async (): Promise<void> => getCandle().deleteUser(),

  getAssetAccounts: async (
    query: AssetAccountQuery = {}
  ): Promise<{
    assetAccounts: AssetAccount[];
    linkedAccounts: LinkedAccountStatusRef[];
  }> => {
    const { assetAccounts, linkedAccounts } =
      await getCandle().getAssetAccounts(query);
    return {
      assetAccounts: assetAccounts.map((account) =>
        convertToAssetAccount(account)
      ),
      linkedAccounts,
    };
  },

  getAssetAccount: async (ref: AssetAccountRef): Promise<AssetAccount> => {
    const account = await getCandle().getAssetAccount(ref);
    return convertToAssetAccount(account);
  },

  getTrades: async (
    query: TradeQuery = {}
  ): Promise<{
    trades: Trade[];
    linkedAccounts: LinkedAccountStatusRef[];
  }> => {
    const { trades, linkedAccounts } = await getCandle().getTrades(query);
    return {
      trades: trades.map(({ dateTime, counterparty, gained, lost, state }) => ({
        dateTime,
        state,
        counterparty: convertToCounterparty(counterparty),
        lost: convertTradeAsset(lost),
        gained: convertTradeAsset(gained),
      })),
      linkedAccounts,
    };
  },

  getTrade: async (input: {
    lost: TradeAssetRef;
    gained: TradeAssetRef;
  }): Promise<Trade> => {
    const trade = await getCandle().getTrade({
      lost: convertTradeAssetRef(input.lost),
      gained: convertTradeAssetRef(input.gained),
    });
    return {
      dateTime: trade.dateTime,
      state: trade.state,
      counterparty: convertToCounterparty(trade.counterparty),
      lost: convertTradeAsset(trade.lost),
      gained: convertTradeAsset(trade.gained),
    };
  },

  getTradeQuotes: async <
    GainedAssetKind extends AssetKind,
    LostAssetKind extends AssetKind
  >(request: {
    linkedAccountIDs?: string;
    gained: { assetKind: GainedAssetKind } & AssetQuoteRequest;
    lost: { assetKind: LostAssetKind } & AssetQuoteRequest;
  }): Promise<{
    tradeQuotes: TradeQuote<GainedAssetKind, LostAssetKind>[];
    linkedAccounts: LinkedAccountStatusRef[];
  }> => {
    let gainedRequest: TradeAssetQuoteRequest;

    switch (request.gained.assetKind) {
      case "fiat":
        gainedRequest = { fiatAssetQuoteRequest: request.gained };
        break;
      case "stock":
      case "crypto":
        gainedRequest = { marketAssetQuoteRequest: request.gained };
        break;
      case "transport":
        gainedRequest = { transportAssetQuoteRequest: request.gained };
        break;
      case "nothing":
        gainedRequest = { nothingAssetQuoteRequest: request.gained };
        break;
    }

    let lostRequest: TradeAssetQuoteRequest;

    switch (request.lost.assetKind) {
      case "fiat":
        lostRequest = { fiatAssetQuoteRequest: request.lost };
        break;
      case "stock":
      case "crypto":
        lostRequest = { marketAssetQuoteRequest: request.lost };
        break;
      case "transport":
        lostRequest = { transportAssetQuoteRequest: request.lost };
        break;
      case "nothing":
        lostRequest = { nothingAssetQuoteRequest: request.lost };
        break;
    }

    const { linkedAccounts, tradeQuotes } = await getCandle().getTradeQuotes({
      linkedAccountIDs: request.linkedAccountIDs,
      gained: gainedRequest,
      lost: lostRequest,
    });

    return {
      tradeQuotes: tradeQuotes.map((quote) => {
        return {
          gained: assertTradeAsset({
            tradeAsset: convertTradeAsset(quote.gained),
            expectedAssetKind: request.gained.assetKind,
          }),
          lost: assertTradeAsset({
            tradeAsset: convertTradeAsset(quote.lost),
            expectedAssetKind: request.lost.assetKind,
          }),
          context: quote.context,
          expirationDateTime: quote.expirationDateTime,
        };
      }),
      linkedAccounts,
    };
  },
};

const convertTradeAssetRef = (
  tradeAssetRef: TradeAssetRef
): InternalTradeAssetRef => {
  switch (tradeAssetRef.assetKind) {
    case "fiat":
      return {
        fiatAssetRef: {
          assetKind: "fiat",
          linkedAccountID: tradeAssetRef.linkedAccountID,
          serviceTradeID: tradeAssetRef.serviceTradeID,
        },
      };
    case "stock":
    case "crypto":
      return {
        marketTradeAssetRef: {
          assetKind: tradeAssetRef.assetKind,
          linkedAccountID: tradeAssetRef.linkedAccountID,
          serviceTradeID: tradeAssetRef.serviceTradeID,
        },
      };
    case "transport":
      return {
        transportAssetRef: {
          assetKind: "transport",
          linkedAccountID: tradeAssetRef.linkedAccountID,
          serviceTradeID: tradeAssetRef.serviceTradeID,
        },
      };
    case "other":
      return {
        otherAssetRef: {
          assetKind: "other",
        },
      };
    case "nothing":
      return {
        nothingAssetRef: {
          assetKind: "nothing",
        },
      };
  }
};

const toInternalTradeAsset = (asset: TradeAsset): InternalTradeAsset => {
  switch (asset.assetKind) {
    case "fiat":
      return { fiatAsset: asset };
    case "stock":
    case "crypto":
      return {
        marketTradeAsset: {
          ...asset,
          assetKind: asset.assetKind,
        },
      };
    case "transport":
      return { transportAsset: asset };
    case "other":
      return { otherAsset: asset };
    case "nothing":
      return { nothingAsset: asset };
  }
};

const convertTradeQuote = (
  tradeQuote: TradeQuote<AssetKind, AssetKind>
): InternalTradeQuote => {
  const { context, gained, lost } = tradeQuote;
  return {
    context,
    gained: toInternalTradeAsset(gained),
    lost: toInternalTradeAsset(lost),
    expirationDateTime: tradeQuote.expirationDateTime,
  };
};

const convertTradeAsset = (tradeAsset: InternalTradeAsset): TradeAsset => {
  if (tradeAsset.fiatAsset !== undefined) {
    return {
      ...tradeAsset.fiatAsset,
      assetKind: "fiat",
    };
  } else if (tradeAsset.marketTradeAsset !== undefined) {
    assertMarketAssetKind(tradeAsset.marketTradeAsset.assetKind);
    return {
      ...tradeAsset.marketTradeAsset,
      assetKind: assertMarketAssetKind(tradeAsset.marketTradeAsset.assetKind),
    };
  } else if (tradeAsset.transportAsset !== undefined) {
    return {
      ...tradeAsset.transportAsset,
      assetKind: "transport",
    };
  } else if (tradeAsset.otherAsset !== undefined) {
    return { assetKind: "other" };
  } else if (tradeAsset.nothingAsset !== undefined) {
    return { assetKind: "nothing" };
  } else {
    throw new Error("Internal Candle Error: corrupted trade asset.");
  }
};

const assertTradeAsset = <ExpectedAssetKind extends AssetKind>(input: {
  tradeAsset: TradeAsset;
  expectedAssetKind: ExpectedAssetKind;
}): TradeAsset & {
  assetKind: ExpectedAssetKind;
} => {
  if (input.tradeAsset.assetKind === input.expectedAssetKind) {
    // NOTE: This cast is due to a typescript generics limitation and should be cleaned up when possible
    return input.tradeAsset as TradeAsset & {
      assetKind: ExpectedAssetKind;
    };
  } else {
    throw new Error("Internal Candle Error: asset kind mismatch.");
  }
};

const convertToCounterparty = (
  counterparty: InternalCounterparty
): Counterparty => {
  if (counterparty.merchantCounterparty !== undefined) {
    return {
      ...counterparty.merchantCounterparty,
      kind: "merchant",
    };
  } else if (counterparty.userCounterparty !== undefined) {
    return {
      ...counterparty.userCounterparty,
      kind: "user",
    };
  } else if (counterparty.serviceCounterparty !== undefined) {
    return {
      ...counterparty.serviceCounterparty,
      kind: "service",
    };
  } else {
    throw new Error("Unknown counterparty kind");
  }
};

const assertFiatAssetKind = (kind: string): "fiat" => {
  if (kind !== "fiat") {
    throw new Error("Internal Candle Error: corrupted market account.");
  } else {
    return kind;
  }
};

const assertMarketAssetKind = (kind: string): "stock" | "crypto" => {
  if (kind !== "stock" && kind !== "crypto") {
    throw new Error("Internal Candle Error: corrupted market account.");
  } else {
    return kind;
  }
};

const assertTransportAssetKind = (kind: string): "transport" => {
  if (kind !== "transport") {
    throw new Error("Internal Candle Error: corrupted market account.");
  } else {
    return kind;
  }
};

const convertToAssetAccount = (account: InternalAssetAccount): AssetAccount => {
  const { fiatAccount, marketAccount, transportAccount } = account;

  if (fiatAccount !== undefined) {
    return {
      ...fiatAccount,
      assetKind: assertFiatAssetKind(fiatAccount.assetKind),
    };
  } else if (marketAccount !== undefined) {
    return {
      ...marketAccount,
      assetKind: assertMarketAssetKind(marketAccount.assetKind),
    };
  } else if (transportAccount !== undefined) {
    return {
      ...transportAccount,
      assetKind: assertTransportAssetKind(transportAccount.assetKind),
    };
  } else {
    throw new Error("Internal Candle Error: corrupted asset account.");
  }
};

type AssetKind = "nothing" | "transport" | "fiat" | "stock" | "crypto";

type AssetQuoteRequest =
  | ({
      assetKind: "nothing";
    } & NothingAssetQuoteRequest)
  | ({ assetKind: "transport" } & TransportAssetQuoteRequest)
  | ({ assetKind: "fiat" } & FiatAssetQuoteRequest)
  | ({ assetKind: "stock" | "crypto" } & MarketAssetQuoteRequest);

type TradeAsset =
  | ({
      assetKind: "nothing";
    } & NothingAsset)
  | ({
      assetKind: "other";
    } & OtherAsset)
  | ({ assetKind: "transport" } & TransportAsset)
  | ({ assetKind: "fiat" } & FiatAsset)
  | ({ assetKind: "stock" | "crypto" } & MarketTradeAsset);

type Counterparty =
  | ({ kind: "merchant" } & MerchantCounterparty)
  | ({
      kind: "user";
    } & UserCounterparty)
  | ({
      kind: "service";
    } & ServiceCounterparty);

type TradeQuery = {
  gainedAssetKind?: TradeQueryAssetKind;
  lostAssetKind?: TradeQueryAssetKind;
  counterpartyKind?: "merchant" | "user" | "service";
} & InternalTradeQuery;

type TradeQuote<
  GainedAssetKind extends AssetKind,
  LostAssetKind extends AssetKind
> = {
  gained: TradeAsset & { assetKind: GainedAssetKind };
  lost: TradeAsset & { assetKind: LostAssetKind };
  context: string;
  expirationDateTime: string;
};

type TradeQueryAssetKind =
  | "fiat"
  | "stock"
  | "crypto"
  | "transport"
  | "other"
  | "nothing";

type AssetAccount = {
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

type Trade = {
  dateTime: string;
  state: TradeState;
  counterparty: Counterparty;
  lost: TradeAsset;
  gained: TradeAsset;
};

type TradeAssetRef =
  | ({ assetKind: "transport" } & TransportAssetRef)
  | ({ assetKind: "nothing" } & NothingAssetRef)
  | ({ assetKind: "other" } & OtherAssetRef)
  | ({ assetKind: "fiat" } & FiatAssetRef)
  | ({ assetKind: "stock" | "crypto" } & MarketTradeAssetRef);

type LinkedAccountDetail =
  | (LinkedAccount & {
      details: { state: "active" } & ActiveLinkedAccountDetails;
    })
  | (LinkedAccount & {
      details: { state: "inactive" | "unavailable" };
    });

export type {
  Address,
  AppUser,
  AssetAccount,
  AssetAccountRef,
  AssetKind,
  Coordinates,
  Counterparty,
  LinkedAccount,
  LinkedAccountDetail,
  LinkedAccountRef,
  LinkedAccountStatusRef,
  Service,
  Trade,
  TradeAsset,
  TradeAssetRef,
  TradeQuery,
  TradeQuote,
  TradeState,
};
