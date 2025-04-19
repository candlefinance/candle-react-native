import type { AnyMap, HybridObject } from "react-native-nitro-modules";

export type AppUser = {
  appKey: string;
  appSecret: string;
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
  getFiatAccounts(): Promise<string>;
  getActivity(span: string | undefined): Promise<string>;
  deleteUser(): Promise<void>;
  // FIXME: The return type should be a more specific type based on the actual tool calls available.
  getAvailableTools(): Promise<Array<AnyMap>>;
  executeTool(tool: ToolCall): Promise<string>;
}
