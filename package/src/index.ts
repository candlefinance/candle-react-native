import { NitroModules } from "react-native-nitro-modules";
import type {
  AppUser,
  AssetAccount as NitroAssetAccount,
  AssetAccountQuery,
  FiatAsset,
  FiatAssetQuoteRequest,
  LinkedAccount,
  MarketAssetQuoteRequest,
  MarketTradeAsset,
  NothingAsset,
  NothingAssetQuoteRequest,
  OtherAsset,
  PresentationBackground,
  PresentationStyle,
  RNCandle,
  Service,
  TradeAsset as InternalTradeAsset,
  TradeAssetQuoteRequest,
  TradeQuery,
  TransportAsset,
  TransportAssetQuoteRequest,
  LegalAccountKind,
  WireDetails,
  ACHDetails,
  TradeState,
  MerchantCounterparty,
  UserCounterparty,
  ServiceCounterparty,
  Counterparty as InternalCounterparty,
} from "./specs/RNCandle.nitro";

export class CandleClient {
  private candle: RNCandle;

  constructor(appUser: AppUser) {
    const CandleHybridObject =
      NitroModules.createHybridObject<RNCandle>("RNCandle");
    this.candle = CandleHybridObject;
    this.candle.initialize(appUser);
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

  public async getLinkedAccounts(): Promise<
    (
      | (LinkedAccount & { state: "active" })
      | ({ state: "inactive" } & Pick<
          LinkedAccount,
          "linkedAccountID" | "service"
        >)
    )[]
  > {
    const accounts = await this.candle.getLinkedAccounts();
    return accounts.map((account) => {
      if (account.state === "active") {
        return {
          ...account,
          state: "active",
        };
      } else {
        return {
          state: "inactive",
          linkedAccountID: account.linkedAccountID,
          service: account.service,
        };
      }
    });
  }

  public async unlinkAccount(linkedAccountID: string): Promise<void> {
    await this.candle.unlinkAccount(linkedAccountID);
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

  public async getAssetAccounts(
    query: AssetAccountQuery = {}
  ): Promise<AssetAccount[]> {
    const accounts = await this.candle.getAssetAccounts(query);
    return accounts.map((account) => this.convertToAssetAccount(account));
  }

  public async getTrades(
    query: {
      gainedAssetKind?: TradeQueryAssetKind;
      lostAssetKind?: TradeQueryAssetKind;
      counterpartyKind?: "merchant" | "user" | "service";
    } & TradeQuery = {}
  ): Promise<
    {
      dateTime: string;
      state: TradeState;
      counterparty: Counterparty;
      lost: TradeAsset;
      gained: TradeAsset;
    }[]
  > {
    const trades = await this.candle.getTrades(query);
    return trades.map(({ dateTime, counterparty, gained, lost, state }) => ({
      dateTime,
      state,
      counterparty: this.convertToCounterparty(counterparty),
      lost: this.convertTradeAsset(lost),
      gained: this.convertTradeAsset(gained),
    }));
  }

  public async getTradeQuotes(request: {
    linkedAccountIDs?: string;
    gained:
      | ({
          assetKind: "nothing";
        } & NothingAssetQuoteRequest)
      | ({ assetKind: "transport" } & TransportAssetQuoteRequest)
      | ({ assetKind: "fiat" } & FiatAssetQuoteRequest)
      | ({ assetKind: "stock" | "crypto" } & MarketAssetQuoteRequest);
  }): Promise<
    {
      gained: TradeAsset;
      lost: TradeAsset;
    }[]
  > {
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

    const quotes = await this.candle.getTradeQuotes({
      linkedAccountIDs: request.linkedAccountIDs,
      gained: gainedRequest,
    });

    return quotes.map((quote) => {
      return {
        gained: this.convertTradeAsset(quote.gained),
        lost: this.convertTradeAsset(quote.lost),
      };
    });
  }

  private convertTradeAsset(tradeAsset: InternalTradeAsset): TradeAsset {
    if (tradeAsset.fiatAsset !== undefined) {
      return {
        ...tradeAsset.fiatAsset,
        assetKind: "fiat",
      };
    } else if (tradeAsset.marketTradeAsset !== undefined) {
      return {
        ...tradeAsset.marketTradeAsset,
        assetKind: tradeAsset.marketTradeAsset.assetKind as "stock" | "crypto",
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

  private convertToAssetAccount(account: NitroAssetAccount): AssetAccount {
    const { legalAccountKind, nickname } = account;
    const { fiatAccountDetails, marketAccountDetails } = account.details;

    if (fiatAccountDetails !== undefined) {
      return {
        legalAccountKind,
        nickname,
        details: {
          ...fiatAccountDetails,
          assetKind: "fiat",
        },
      };
    } else if (marketAccountDetails !== undefined) {
      return {
        legalAccountKind,
        nickname,
        details: {
          ...marketAccountDetails,
          assetKind: marketAccountDetails.assetKind as "stock" | "crypto",
        },
      };
    } else {
      throw new Error("Internal Candle Error: corrupted asset account.");
    }
  }
}

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

type TradeQueryAssetKind =
  | "fiat"
  | "stock"
  | "crypto"
  | "transport"
  | "other"
  | "nothing";

type AssetAccount = {
  legalAccountKind: LegalAccountKind;
  nickname: string;
  details:
    | {
        assetKind: "fiat";
        serviceAccountID: string;
        currencyCode: string;
        balance?: number;
        linkedAccountID: string;
        service: Service;
        ach?: ACHDetails;
        wire?: WireDetails;
      }
    | {
        assetKind: "stock" | "crypto";
        serviceAccountID: string;
        linkedAccountID: string;
        service: Service;
      };
};

export type { LinkedAccount, AppUser, Service, TradeState, TradeAsset };
