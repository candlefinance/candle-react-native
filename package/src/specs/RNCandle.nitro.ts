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

export type FiatMarketAccountKind =
  | "individual"
  | "joint"
  | "traditionalIRA"
  | "rothIRA"
  | "business";

export type TransportAccountKind = "individual" | "joint" | "business";

type FiatAccount = {
  assetKind: string; // fiat
  serviceAccountID: string;
  accountKind: FiatMarketAccountKind;
  nickname: string;
  currencyCode: string;
  balance?: number;
  ach?: ACHDetails;
  wire?: WireDetails;
  linkedAccountID: string;
  service: Service;
};

type MarketAccount = {
  assetKind: string; // "stock" | "crypto"
  serviceAccountID: string;
  accountKind: FiatMarketAccountKind;
  nickname: string;
  linkedAccountID: string;
  service: Service;
};

type TransportAccount = {
  assetKind: string; // "transport"
  serviceAccountID: string;
  accountKind: TransportAccountKind;
  nickname: string;
  linkedAccountID: string;
  service: Service;
};

export type AssetAccount = {
  fiatAccount?: FiatAccount;
  marketAccount?: MarketAccount;
  transportAccount?: TransportAccount;
};

type AssetAccountKind = "fiat" | "stock" | "crypto" | "transport";

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

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Address = {
  value: string;
};

export type TransportAsset = {
  assetKind: string; // "transport"
  serviceTradeID: string;
  serviceAssetID: string;
  serviceAccountID: string;
  name: string;
  description: string;
  // FIXME: use URL type for url fields
  imageURL: string;
  originCoordinates: Coordinates;
  originAddress: Address;
  destinationCoordinates: Coordinates;
  destinationAddress: Address;
  seats: number;
  departureDateTime: string;
  arrivalDateTime: string;
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
  // FIXME: To match the API this should be earliestDateTime
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
  serviceAccountID?: string;
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
  lost: TradeAssetQuoteRequest;
};

export type ExecuteTradeRequest = {
  linkedAccountID: string;
  context: string;
};

export type TradeQuote = {
  lost: TradeAsset;
  gained: TradeAsset;
  context: string;
  expirationDateTime: string;
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
  assetKind: string; // "fiat" | "stock" | "crypto" | "transport"
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

export type StatePayload = "active" | "inactive" | "unavailable";

export type LinkedAccountStatusRef = {
  linkedAccountID: string;
  service: Service;
  serviceUserID: string;
  state: StatePayload;
};

export type AssetAccountsResponse = {
  linkedAccounts: LinkedAccountStatusRef[];
  assetAccounts: AssetAccount[];
};

export type TradesResponse = {
  linkedAccounts: LinkedAccountStatusRef[];
  trades: Trade[];
};

export type TradeQuotesResponse = {
  linkedAccounts: LinkedAccountStatusRef[];
  tradeQuotes: TradeQuote[];
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
  initialize(appUser: AppUser, accessGroup: string | undefined): void;
  getLinkedAccounts(): Promise<LinkedAccount[]>;
  getLinkedAccount(ref: LinkedAccountRef): Promise<LinkedAccount>;
  unlinkAccount(ref: LinkedAccountRef): Promise<void>;
  getAssetAccounts(query: AssetAccountQuery): Promise<AssetAccountsResponse>;
  getAssetAccount(ref: AssetAccountRef): Promise<AssetAccount>;
  getTrades(query: TradeQuery): Promise<TradesResponse>;
  getTrade(ref: TradeRef): Promise<Trade>;
  getTradeQuotes(request: TradeQuoteRequest): Promise<TradeQuotesResponse>;
  deleteUser(): Promise<void>;
  // FIXME: The return type should be a more specific type based on the actual tool calls available.
  getAvailableTools(): Promise<Array<AnyMap>>;
  executeTool(tool: ToolCall): Promise<string>;
}
