import type { AnyMap, HybridObject } from "react-native-nitro-modules";

export type AppUser = {
  appKey: string;
  appSecret: string;
  appUserID?: string;
};

type ACHAccountKind = "checking" | "savings";

type ACHDetails = {
  accountNumber: string;
  routingNumber: string;
  accountKind: ACHAccountKind;
};

type WireDetails = {
  accountNumber: string;
  routingNumber: string;
};

type FiatAccountDetails = {
  assetKind: string; // fiat
  serviceAccountID: string;
  currencyCode: string;
  balance?: number;
  ach?: ACHDetails;
  wire?: WireDetails;
  linkedAccountID: string;
  service: Service;
};

type MarketAccountDetails = {
  assetKind: string; // "stock" | "crypto"
  serviceAccountID: string;
  linkedAccountID: string;
  service: Service;
};

type AssetAccountDetails = FiatAccountDetails | MarketAccountDetails;

type LegalAccountKind = "individual" | "joint" | "traditionalIra" | "rothIra";

export type AssetAccount = {
  legalAccountKind: LegalAccountKind;
  nickname: string;
  details: AssetAccountDetails;
};

type AssetAccountKind = "fiat" | "stock" | "crypto";

export type AssetAccountQuery = {
  linkedAccountIDs?: string;
  assetKind?: AssetAccountKind;
};

type FiatAsset = {
  assetKind: string; // fiat
  serviceTradeID?: string;
  serviceAccountID: string;
  currencyCode: string;
  amount: number;
  linkedAccountID: string;
  service: Service;
};

type MarketTradeAsset = {
  assetKind: string; // "stock" | "crypto"
  serviceAccountID: string;
  serviceAssetID: string;
  symbol: string;
  amount: number;
  serviceTradeID: string;
  linkedAccountID: string;
  name: string;
  color: string;
  logoURL: string;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

type Address = {
  value: string;
};

type TransportAsset = {
  assetKind: string; // "transport"
  serviceTradeID: string;
  serviceAssetID: string;
  name: string;
  description: string;
  imageURL: string;
  originCoordinates: Coordinates;
  originAddress: Address;
  destinationCoordinates: Coordinates;
  destinationAddress: Address;
  seats: number;
  linkedAccountID: string;
  logoURL: string;
};

type OtherAsset = {
  assetKind: string; // "other"
};

type NothingAsset = {
  assetKind: string; // "nothing"
};

type TradeAsset =
  | FiatAsset
  | MarketTradeAsset
  | TransportAsset
  | OtherAsset
  | NothingAsset;

type MerchantLocation = {
  countryCode: string;
  countrySubdivisionCode: string;
  localityName: string;
};

type MerchantCounterparty = {
  kind: string; // "merchant";
  name: string;
  logoURL: string;
  location: MerchantLocation;
};

type UserCounterparty = {
  kind: string; // "user"
  legalName: string;
  avatarURL: string;
  username: string;
};

type ServiceCounterparty = {
  kind: string; // "service"
  service: Service;
};

type Counterparty =
  | MerchantCounterparty
  | UserCounterparty
  | ServiceCounterparty;

type TradeState = "success" | "inProgress" | "failure";

export type Trade = {
  dateTime: string;
  state: TradeState;
  counterparty: Counterparty;
  lost: TradeAsset;
  gained: TradeAsset;
};

type AssetKind =
  | "fiat"
  | "stock"
  | "crypto"
  | "transport"
  | "other"
  | "nothing";

type CounterpartyKind = "merchant" | "user" | "service";

export type TradeQuery = {
  linkedAccountIDs?: string;
  dateTimeSpan?: string;
  gainedAssetKind?: AssetKind; // "fiat" | "stock" | "crypto" | "transport" | "other" | "nothing"
  lostAssetKind?: AssetKind; // "fiat" | "stock" | "crypto" | "transport" | "other" | "nothing"
  counterpartyKind?: CounterpartyKind; // "merchant" | "user" | "service"
};

type FiatAssetQuoteRequest = {
  assetKind?: string; // fiat
  serviceAccountID?: string;
  currencyCode?: string;
  amount?: number;
};

type MarketAssetKind = "stock" | "crypto";

type MarketAssetQuoteRequest = {
  assetKind?: MarketAssetKind;
  serviceAccountID?: string;
  serviceAssetID?: string;
  symbol?: string;
  amount?: number;
};

type TransportAssetQuoteRequest = {
  assetKind?: string; // "transport"
  serviceAssetID?: string;
  originCoordinates?: Coordinates;
  originAddress?: Address;
  destinationCoordinates?: Coordinates;
  destinationAddress?: Address;
  seats?: number;
};

type NothingAssetQuoteRequest = {
  assetKind?: string; // "nothing"
};

type TradeAssetQuoteRequest =
  | FiatAssetQuoteRequest
  | MarketAssetQuoteRequest
  | TransportAssetQuoteRequest
  | NothingAssetQuoteRequest;

export type TradeQuoteRequest = {
  linkedAccountIDs?: string;
  gained: TradeAssetQuoteRequest;
};

export type TradeQuote = {
  lost: TradeAsset;
  gained: TradeAsset;
};

export type Service =
  | "robinhood"
  | "cash_app"
  | "venmo"
  | "apple"
  | "sandbox"
  | "uber"
  | "lyft"
  | "chime"
  | "paypal"
  | "coinbase"
  | "discover"
  | "american_express"
  | "jpmorgan_chase"
  | "bank_of_america"
  | "capital_one"
  | "citibank"
  | "vanguard"
  | "wells_fargo"
  | "charles_schwab"
  | "kalshi"
  | "experian"
  | "waymo"
  | "revel"
  | "turo"
  | "getaround"
  | "zipcar"
  | "airbnb"
  | "american_airlines"
  | "delta"
  | "united"
  | "jetblue"
  | "southwest"
  | "hawaiian"
  | "hotels"
  | "geico"
  | "progressive"
  | "aaa"
  | "state_farm"
  | "hertz"
  | "avis"
  | "tesla"
  | "doordash"
  | "uber_eats"
  | "grubhub"
  | "resy"
  | "opentable"
  | "starbucks"
  | "blue_bottle"
  | "costco"
  | "amazon"
  | "walmart"
  | "whole_foods"
  | "mcdonalds"
  | "chipotle"
  | "sweetgreen"
  | "snapchat"
  | "x"
  | "facebook"
  | "instagram"
  | "signal"
  | "whatsapp"
  | "messenger"
  | "linkedin"
  | "discord"
  | "messages"
  | "telegram"
  | "reddit"
  | "pinterest"
  | "new_york_times"
  | "washington_post"
  | "wall_street_journal"
  | "cnn"
  | "yahoo"
  | "fox"
  | "perplexity"
  | "openai"
  | "polymarket"
  | "espn"
  | "youtube"
  | "netflix";

export type PresentationBackground = "default" | "blur";
export type PresentationStyle = "sheet" | "fullScreen";

export type State = "active" | "inactive";

export type Details = {
  state: State;
  username: string | undefined;
  legalName: string;
  accountOpened: string | undefined;
};

export type LinkedAccount = {
  serviceUserID: string;
  details: Details | undefined;
  linkedAccountID: string;
  service: Service;
};

export type ToolCall = {
  name: string;
  arguments: string;
};

export interface RNCandle extends HybridObject<{ ios: "swift" }> {
  candleLinkSheet(
    isPresented: boolean,
    services: Service[] | undefined,
    cornerRadius: number,
    customerName: string | undefined,
    showDynamicLoading: boolean,
    presentationBackground: PresentationBackground,
    presentationStyle: PresentationStyle,
    onSuccess: (account: LinkedAccount) => void
  ): void;
  initialize(appUser: AppUser): void;
  getLinkedAccounts(): Promise<LinkedAccount[]>;
  unlinkAccount(linkedAccountID: string): Promise<void>;
  // FIXME: Make this type safe
  getAssetAccounts(query: AssetAccountQuery): Promise<AssetAccount[]>;
  getTrades(query: TradeQuery): Promise<Trade[]>;
  getTradeQuotes(request: TradeQuoteRequest): Promise<TradeQuote[]>;
  deleteUser(): Promise<void>;
  // FIXME: The return type should be a more specific type based on the actual tool calls available.
  getAvailableTools(): Promise<Array<AnyMap>>;
  executeTool(tool: ToolCall): Promise<string>;
}
