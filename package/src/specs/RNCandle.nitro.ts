import type { HybridObject } from "react-native-nitro-modules";

export type Service =
  | "robinhood"
  | "cash_app"
  | "venmo"
  | "apple"
  | "demo"
  | "default";

export type PresentationBackground = "default" | "blur";
export type PresentationStyle = "sheet" | "fullScreen";

export type ToolCall = {
  name: string;
  arguments: string;
};

export interface RNCandle extends HybridObject<{ ios: "swift" }> {
  candleLinkSheet(
    isPresented: boolean,
    service: Service,
    cornerRadius: number,
    customerName: string | undefined,
    showSandbox: boolean,
    showDynamicLoading: boolean,
    presentationBackground: PresentationBackground,
    presentationStyle: PresentationStyle,
    onSuccess: (account: string) => void
  ): void;
  getLinkedAccounts(): Promise<string>;
  unlinkAccount(linkedAccountID: string): Promise<void>;
  getFiatAccounts(): Promise<string>;
  getActivity(span: string | undefined): Promise<string>;
  deleteUser(): Promise<void>;
  // FIXME: The return type should be a more specific type based on the actual tool calls available.
  getAvailableTools(): Promise<string>;
  executeTool(tool: ToolCall): Promise<string>;
}
