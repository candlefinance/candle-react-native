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

export class CandleClient {
  private candle: RNCandle;

  constructor(appUser: AppUser, accessGroup?: string) {
    const CandleHybridObject =
      NitroModules.createHybridObject<RNCandle>("RNCandle");
    this.candle = CandleHybridObject;
    this.candle.initialize(appUser, accessGroup);
  }

  public presentCandleTradeExecutionSheet<
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
  }): void {
    const quote = this.convertTradeQuote(input.tradeQuote);
    this.candle.candleTradeExecutionSheet(
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
            counterparty: this.convertToCounterparty(result.trade.counterparty),
            lost: this.assertTradeAsset({
              tradeAsset: this.convertTradeAsset(result.trade.lost),
              expectedAssetKind: input.tradeQuote.lost.assetKind,
            }),
            gained: this.assertTradeAsset({
              tradeAsset: this.convertTradeAsset(result.trade.gained),
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
  }

  public presentCandleLinkSheet({
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
  }): void {
    this.candle.candleLinkSheet(
      true,
      services,
      cornerRadius,
      customerName,
      showDynamicLoading,
      presentationBackground,
      presentationStyle,
      onSuccess
    );
  }

  public async getLinkedAccounts(): Promise<LinkedAccountDetail[]> {
    const accounts = await this.candle.getLinkedAccounts();
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
  }

  public async getLinkedAccount(ref: LinkedAccountRef): Promise<LinkedAccount> {
    return this.candle.getLinkedAccount(ref);
  }

  public async unlinkAccount(path: LinkedAccountRef): Promise<void> {
    await this.candle.unlinkAccount(path);
  }

  public async deleteUser(): Promise<void> {
    await this.candle.deleteUser();
  }

  public async getAvailableTools(): Promise<Array<Record<string, any>>> {
    return this.candle.getAvailableTools();
  }

  public async executeTool(tool: {
    name: string;
    arguments: string;
  }): Promise<string> {
    return this.candle.executeTool(tool);
  }

  public async getAssetAccounts(query: AssetAccountQuery = {}): Promise<{
    assetAccounts: AssetAccount[];
    linkedAccounts: LinkedAccountStatusRef[];
  }> {
    const { assetAccounts, linkedAccounts } =
      await this.candle.getAssetAccounts(query);
    return {
      assetAccounts: assetAccounts.map((account) =>
        this.convertToAssetAccount(account)
      ),
      linkedAccounts,
    };
  }

  public async getAssetAccount(ref: AssetAccountRef): Promise<AssetAccount> {
    const account = await this.candle.getAssetAccount(ref);
    return this.convertToAssetAccount(account);
  }

  public async getTrades(query: TradeQuery = {}): Promise<{
    trades: Trade[];
    linkedAccounts: LinkedAccountStatusRef[];
  }> {
    const { trades, linkedAccounts } = await this.candle.getTrades(query);
    return {
      trades: trades.map(({ dateTime, counterparty, gained, lost, state }) => ({
        dateTime,
        state,
        counterparty: this.convertToCounterparty(counterparty),
        lost: this.convertTradeAsset(lost),
        gained: this.convertTradeAsset(gained),
      })),
      linkedAccounts,
    };
  }

  public async getTrade(input: {
    lost: TradeAssetRef;
    gained: TradeAssetRef;
  }): Promise<Trade> {
    const trade = await this.candle.getTrade({
      lost: this.convertTradeAssetRef(input.lost),
      gained: this.convertTradeAssetRef(input.gained),
    });
    return {
      dateTime: trade.dateTime,
      state: trade.state,
      counterparty: this.convertToCounterparty(trade.counterparty),
      lost: this.convertTradeAsset(trade.lost),
      gained: this.convertTradeAsset(trade.gained),
    };
  }

  public async getTradeQuotes<
    GainedAssetKind extends AssetKind,
    LostAssetKind extends AssetKind
  >(request: {
    linkedAccountIDs?: string;
    gained: { assetKind: GainedAssetKind } & AssetQuoteRequest;
    lost: { assetKind: LostAssetKind } & AssetQuoteRequest;
  }): Promise<{
    tradeQuotes: TradeQuote<GainedAssetKind, LostAssetKind>[];
    linkedAccounts: LinkedAccountStatusRef[];
  }> {
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

    const { linkedAccounts, tradeQuotes } = await this.candle.getTradeQuotes({
      linkedAccountIDs: request.linkedAccountIDs,
      gained: gainedRequest,
      lost: lostRequest,
    });

    return {
      tradeQuotes: tradeQuotes.map((quote) => {
        return {
          gained: this.assertTradeAsset({
            tradeAsset: this.convertTradeAsset(quote.gained),
            expectedAssetKind: request.gained.assetKind,
          }),
          lost: this.assertTradeAsset({
            tradeAsset: this.convertTradeAsset(quote.lost),
            expectedAssetKind: request.lost.assetKind,
          }),
          context: quote.context,
          expirationDateTime: quote.expirationDateTime,
        };
      }),
      linkedAccounts,
    };
  }

  private convertTradeAssetRef(
    tradeAssetRef: TradeAssetRef
  ): InternalTradeAssetRef {
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
  }

  private toInternalTradeAsset(asset: TradeAsset): InternalTradeAsset {
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
  }

  private convertTradeQuote(
    tradeQuote: TradeQuote<AssetKind, AssetKind>
  ): InternalTradeQuote {
    const { context, gained, lost } = tradeQuote;
    return {
      context,
      gained: this.toInternalTradeAsset(gained),
      lost: this.toInternalTradeAsset(lost),
      expirationDateTime: tradeQuote.expirationDateTime,
    };
  }

  private convertTradeAsset(tradeAsset: InternalTradeAsset): TradeAsset {
    if (tradeAsset.fiatAsset !== undefined) {
      return {
        ...tradeAsset.fiatAsset,
        assetKind: "fiat",
      };
    } else if (tradeAsset.marketTradeAsset !== undefined) {
      this.assertMarketAssetKind(tradeAsset.marketTradeAsset.assetKind);
      return {
        ...tradeAsset.marketTradeAsset,
        assetKind: this.assertMarketAssetKind(
          tradeAsset.marketTradeAsset.assetKind
        ),
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
  }

  private assertTradeAsset<ExpectedAssetKind extends AssetKind>(input: {
    tradeAsset: TradeAsset;
    expectedAssetKind: ExpectedAssetKind;
  }): TradeAsset & {
    assetKind: ExpectedAssetKind;
  } {
    if (input.tradeAsset.assetKind === input.expectedAssetKind) {
      // NOTE: This cast is due to a typescript generics limitation and should be cleaned up when possible
      return input.tradeAsset as TradeAsset & {
        assetKind: ExpectedAssetKind;
      };
    } else {
      throw new Error("Internal Candle Error: asset kind mismatch.");
    }
  }

  private convertToCounterparty(
    counterparty: InternalCounterparty
  ): Counterparty {
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
  }

  private assertFiatAssetKind(kind: string): "fiat" {
    if (kind !== "fiat") {
      throw new Error("Internal Candle Error: corrupted market account.");
    } else {
      return kind;
    }
  }

  private assertMarketAssetKind(kind: string): "stock" | "crypto" {
    if (kind !== "stock" && kind !== "crypto") {
      throw new Error("Internal Candle Error: corrupted market account.");
    } else {
      return kind;
    }
  }

  private assertTransportAssetKind(kind: string): "transport" {
    if (kind !== "transport") {
      throw new Error("Internal Candle Error: corrupted market account.");
    } else {
      return kind;
    }
  }

  private convertToAssetAccount(account: InternalAssetAccount): AssetAccount {
    const { fiatAccount, marketAccount, transportAccount } = account;

    if (fiatAccount !== undefined) {
      return {
        ...fiatAccount,
        assetKind: this.assertFiatAssetKind(fiatAccount.assetKind),
      };
    } else if (marketAccount !== undefined) {
      return {
        ...marketAccount,
        assetKind: this.assertMarketAssetKind(marketAccount.assetKind),
      };
    } else if (transportAccount !== undefined) {
      return {
        ...transportAccount,
        assetKind: this.assertTransportAssetKind(transportAccount.assetKind),
      };
    } else {
      throw new Error("Internal Candle Error: corrupted asset account.");
    }
  }
}

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
  AssetAccountQuery,
};
