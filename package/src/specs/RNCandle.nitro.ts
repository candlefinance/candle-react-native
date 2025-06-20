import type { AnyMap, HybridObject } from "react-native-nitro-modules";

export type AppUser = {
  appKey: string;
  appSecret: string;
  appUserID?: string;
};

type ACHAccountKind = "checking" | "savings";

export type ACHDetails = {
  accountNumber: string;
  routingNumber: string;
  accountKind: ACHAccountKind;
};

export type WireDetails = {
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

type AssetAccountDetails = {
  fiatAccountDetails?: FiatAccountDetails;
  marketAccountDetails?: MarketAccountDetails;
};

export type LegalAccountKind =
  | "individual"
  | "joint"
  | "traditionalIra"
  | "rothIra";

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

export type FiatAsset = {
  assetKind: string; // fiat
  serviceTradeID?: string;
  serviceAccountID: string;
  currencyCode: string;
  amount: number;
  linkedAccountID: string;
  service: Service;
};

export type MarketTradeAsset = {
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
  service: Service;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

type Address = {
  value: string;
};

export type TransportAsset = {
  assetKind: string; // "transport"
  serviceTradeID: string;
  serviceAssetID: string;
  name: string;
  description: string;
  // FIXME: use URL type for url fields
  imageURL: string;
  originCoordinates: Coordinates;
  originAddress: Address;
  destinationCoordinates: Coordinates;
  destinationAddress: Address;
  seats: number;
  linkedAccountID: string;
  service: Service;
};

export type OtherAsset = {
  assetKind: string; // "other"
};

export type NothingAsset = {
  assetKind: string; // "nothing"
};

export type TradeAsset = {
  fiatAsset?: FiatAsset;
  marketTradeAsset?: MarketTradeAsset;
  transportAsset?: TransportAsset;
  otherAsset?: OtherAsset;
  nothingAsset?: NothingAsset;
};

type MerchantLocation = {
  countryCode: string;
  countrySubdivisionCode: string;
  localityName: string;
};

export type MerchantCounterparty = {
  kind: string; // "merchant";
  name: string;
  logoURL: string;
  location?: MerchantLocation;
};

export type UserCounterparty = {
  kind: string; // "user"
  legalName: string;
  avatarURL: string;
  username: string;
};

export type ServiceCounterparty = {
  kind: string; // "service"
  service: Service;
};

export type Counterparty = {
  merchantCounterparty?: MerchantCounterparty;
  userCounterparty?: UserCounterparty;
  serviceCounterparty?: ServiceCounterparty;
};

export type TradeState = "success" | "inProgress" | "failure";

export type Trade = {
  dateTime: string;
  state: TradeState;
  counterparty: Counterparty;
  lost: TradeAsset;
  gained: TradeAsset;
};

export type TradeQuery = {
  linkedAccountIDs?: string;
  dateTimeSpan?: string;
  // FIXME: define enum here rather than in JS wrapper layer
  gainedAssetKind?: string; // "fiat" | "stock" | "crypto" | "transport" | "other" | "nothing"
  lostAssetKind?: string; // "fiat" | "stock" | "crypto" | "transport" | "other" | "nothing"
  counterpartyKind?: string; // "merchant" | "user" | "service"
};

export type FiatAssetQuoteRequest = {
  assetKind: string; // fiat
  serviceAccountID?: string;
  currencyCode?: string;
  amount?: number;
};

export type MarketAssetQuoteRequest = {
  assetKind: string; // "stock" | "crypto"
  serviceAccountID?: string;
  serviceAssetID?: string;
  symbol?: string;
  amount?: number;
};

export type TransportAssetQuoteRequest = {
  assetKind: string; // "transport"
  serviceAssetID?: string;
  originCoordinates?: Coordinates;
  originAddress?: Address;
  destinationCoordinates?: Coordinates;
  destinationAddress?: Address;
  seats?: number;
};

export type NothingAssetQuoteRequest = {
  assetKind: string; // "nothing"
};

export type TradeAssetQuoteRequest = {
  fiatAssetQuoteRequest?: FiatAssetQuoteRequest;
  marketAssetQuoteRequest?: MarketAssetQuoteRequest;
  transportAssetQuoteRequest?: TransportAssetQuoteRequest;
  nothingAssetQuoteRequest?: NothingAssetQuoteRequest;
};

export type TradeQuoteRequest = {
  linkedAccountIDs?: string;
  gained: TradeAssetQuoteRequest;
};

export type ExecuteTradeRequest = {
  linkedAccountID: string;
  context: string;
};

export type TradeQuote = {
  lost: TradeAsset;
  gained: TradeAsset;
  context: string;
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

export type ActiveLinkedAccountDetails = {
  state: string; // "active"
  accountOpened?: string;
  username?: string;
  emailAddress?: string;
  legalName: string;
};

export type InactiveLinkedAccountDetails = {
  state: string; // "inactive"
};

export type UnavailableLinkedAccountDetails = {
  state: string; // "unavailable"
};

export type LinkedAccountDetails = {
  activeLinkedAccountDetails?: ActiveLinkedAccountDetails;
  inactiveLinkedAccountDetails?: InactiveLinkedAccountDetails;
  unavailableLinkedAccountDetails?: UnavailableLinkedAccountDetails;
};

export type LinkedAccount = {
  linkedAccountID: string;
  service: Service;
  serviceUserID: string;
  details: LinkedAccountDetails;
};

export type ToolCall = {
  name: string;
  arguments: string;
};

export type LinkedAccountRef = {
  linkedAccountID: string;
};

export type AssetAccountRef = {
  linkedAccountID: string;
  assetKind: string; // "fiat" | "stock" | "crypto"
  serviceAccountID: string;
};

export type FiatAssetRef = {
  assetKind: string; // fiat
  serviceTradeID?: string;
  linkedAccountID: string;
};

export type MarketTradeAssetRef = {
  assetKind: string; // "stock" | "crypto"
  serviceTradeID: string;
  linkedAccountID: string;
};

export type TransportAssetRef = {
  assetKind: string; // "transport"
  serviceTradeID: string;
  linkedAccountID: string;
};

export type OtherAssetRef = {
  assetKind: string; // "other"
};

export type NothingAssetRef = {
  assetKind: string; // "nothing"
};

export type TradeAssetRef = {
  fiatAssetRef?: FiatAssetRef;
  marketTradeAssetRef?: MarketTradeAssetRef;
  transportAssetRef?: TransportAssetRef;
  otherAssetRef?: OtherAssetRef;
  nothingAssetRef?: NothingAssetRef;
};

export type TradeRef = {
  lost: TradeAssetRef;
  gained: TradeAssetRef;
};

export type TradeExecutionResult = {
  trade?: Trade;
  error?: string;
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
  candleTradeExecutionSheet(
    tradeQuote: TradeQuote,
    presentationBackground: PresentationBackground,
    completion: (result: TradeExecutionResult) => void
  ): void;
  initialize(appUser: AppUser): void;
  getLinkedAccounts(): Promise<LinkedAccount[]>;
  getLinkedAccount(ref: LinkedAccountRef): Promise<LinkedAccount>;
  unlinkAccount(ref: LinkedAccountRef): Promise<void>;
  getAssetAccounts(query: AssetAccountQuery): Promise<AssetAccount[]>;
  getAssetAccount(ref: AssetAccountRef): Promise<AssetAccount>;
  getTrades(query: TradeQuery): Promise<Trade[]>;
  getTrade(ref: TradeRef): Promise<Trade>;
  getTradeQuotes(request: TradeQuoteRequest): Promise<TradeQuote[]>;
  deleteUser(): Promise<void>;
  // FIXME: The return type should be a more specific type based on the actual tool calls available.
  getAvailableTools(): Promise<Array<AnyMap>>;
  executeTool(tool: ToolCall): Promise<string>;
}
