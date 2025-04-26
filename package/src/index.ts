import { NitroModules } from "react-native-nitro-modules";
import type {
  AppUser,
  AssetAccount,
  AssetAccountQuery,
  LinkedAccount,
  PresentationBackground,
  PresentationStyle,
  RNCandle,
  Service,
  // Trade,
  // TradeQuery,
  // TradeQuote,
  // TradeQuoteRequest,
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

  public async getLinkedAccounts(): Promise<LinkedAccount[]> {
    return this.candle.getLinkedAccounts();
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
    query: AssetAccountQuery
  ): Promise<AssetAccount[]> {
    return this.candle.getAssetAccounts(query);
  }

  // public async getTrades(query: TradeQuery): Promise<Trade[]> {
  //   return this.candle.getTrades(query);
  // }

  // public async getTradeQuotes(
  //   request: TradeQuoteRequest
  // ): Promise<TradeQuote[]> {
  //   return this.candle.getTradeQuotes(request);
  // }
}

export type { LinkedAccount, AppUser };
