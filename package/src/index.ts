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
    query: AssetAccountQuery = {
      linkedAccountIDs: undefined,
      assetKind: undefined,
    }
  ): Promise<AssetAccount[]> {
    const accounts = await this.candle.getAssetAccounts(query);
    return accounts.map(this.convertToAssetAccount);
  }

  public async getTrades(
    query: {
      gainedAssetKind?: TradeQueryAssetKind;
      lostAssetKind?: TradeQueryAssetKind;
      counterpartyKind?: "merchant" | "user" | "service";
    } & TradeQuery = {
      counterpartyKind: undefined,
      gainedAssetKind: undefined,
      lostAssetKind: undefined,
      linkedAccountIDs: undefined,
      dateTimeSpan: undefined,
    }
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
    return trades.map((t) => ({
      dateTime: t.dateTime,
      state: t.state,
      counterparty: this.convertToCounterparty(t.counterparty),
      lost: this.convertTradeAsset(t.lost)!,
      gained: this.convertTradeAsset(t.gained)!,
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
      gained?: TradeAsset;
      lost?: TradeAsset;
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

  private convertTradeAsset(
    tradeAsset: InternalTradeAsset
  ): TradeAsset | undefined {
    if (tradeAsset.fiatAsset !== undefined) {
      return {
        assetKind: "fiat",
        amount: tradeAsset.fiatAsset.amount,
        currencyCode: tradeAsset.fiatAsset.currencyCode,
        linkedAccountID: tradeAsset.fiatAsset.linkedAccountID,
        serviceAccountID: tradeAsset.fiatAsset.serviceAccountID,
        service: tradeAsset.fiatAsset.service,
        serviceTradeID: tradeAsset.fiatAsset.serviceTradeID,
      };
    } else if (tradeAsset.marketTradeAsset !== undefined) {
      return {
        assetKind: tradeAsset.marketTradeAsset.assetKind as "stock" | "crypto",
        amount: tradeAsset.marketTradeAsset.amount,
        symbol: tradeAsset.marketTradeAsset.symbol,
        color: tradeAsset.marketTradeAsset.color,
        linkedAccountID: tradeAsset.marketTradeAsset.linkedAccountID,
        serviceAccountID: tradeAsset.marketTradeAsset.serviceAccountID,
        logoURL: tradeAsset.marketTradeAsset.logoURL,
        name: tradeAsset.marketTradeAsset.name,
        serviceAssetID: tradeAsset.marketTradeAsset.serviceAssetID,
        serviceTradeID: tradeAsset.marketTradeAsset.serviceTradeID,
      };
    } else if (tradeAsset.transportAsset !== undefined) {
      return {
        assetKind: "transport",
        description: tradeAsset.transportAsset.description,
        imageURL: tradeAsset.transportAsset.imageURL,
        name: tradeAsset.transportAsset.name,
        originAddress: {
          value: tradeAsset.transportAsset.originAddress.value,
        },
        destinationAddress: {
          value: tradeAsset.transportAsset.destinationAddress.value,
        },
        originCoordinates: {
          latitude: tradeAsset.transportAsset.originCoordinates.latitude,
          longitude: tradeAsset.transportAsset.originCoordinates.longitude,
        },
        destinationCoordinates: {
          latitude: tradeAsset.transportAsset.destinationCoordinates.latitude,
          longitude: tradeAsset.transportAsset.destinationCoordinates.longitude,
        },
        seats: tradeAsset.transportAsset.seats,
        linkedAccountID: tradeAsset.transportAsset.linkedAccountID,
        serviceAssetID: tradeAsset.transportAsset.serviceAssetID,
        serviceTradeID: tradeAsset.transportAsset.serviceTradeID,
      };
    } else if (tradeAsset.otherAsset !== undefined) {
      return { assetKind: "other" };
    } else if (tradeAsset.nothingAsset !== undefined) {
      return { assetKind: "nothing" };
    } else {
      return undefined;
    }
  }

  private convertToCounterparty(
    counterparty: InternalCounterparty
  ): Counterparty {
    if (counterparty.merchantCounterparty !== undefined) {
      return {
        kind: "merchant",
        name: counterparty.merchantCounterparty.name,
        logoURL: counterparty.merchantCounterparty.logoURL,
        location: counterparty.merchantCounterparty.location,
      };
    } else if (counterparty.userCounterparty !== undefined) {
      return {
        kind: "user",
        avatarURL: counterparty.userCounterparty.avatarURL,
        legalName: counterparty.userCounterparty.legalName,
        username: counterparty.userCounterparty.username,
      };
    } else if (counterparty.serviceCounterparty !== undefined) {
      return {
        kind: "service",
        service: counterparty.serviceCounterparty.service,
      };
    } else {
      throw new Error("Unknown counterparty kind");
    }
  }

  private convertToAssetAccount(account: NitroAssetAccount): AssetAccount {
    if (account.details.fiatAccountDetails !== undefined) {
      const d = account.details.fiatAccountDetails;
      return {
        assetKind: "fiat",
        legalAccountKind: account.legalAccountKind,
        nickname: account.nickname,
        serviceAccountID: d.serviceAccountID,
        currencyCode: d.currencyCode,
        balance: d.balance,
        linkedAccountID: d.linkedAccountID,
        service: d.service,
        ach: d.ach,
        wire: d.wire,
      };
    } else if (account.details.marketAccountDetails !== undefined) {
      const d = account.details.marketAccountDetails;
      return {
        assetKind: d.assetKind as "stock" | "crypto",
        legalAccountKind: account.legalAccountKind,
        nickname: account.nickname,
        serviceAccountID: d.serviceAccountID,
        linkedAccountID: d.linkedAccountID,
        service: d.service,
      };
    } else {
      throw new Error("Unknown asset account kind");
    }
  }
}

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

export type AssetAccount =
  | {
      assetKind: "fiat";
      legalAccountKind: LegalAccountKind;
      nickname: string;
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
      legalAccountKind: LegalAccountKind;
      nickname: string;
      serviceAccountID: string;
      linkedAccountID: string;
      service: Service;
    };

export type { LinkedAccount, AppUser };
