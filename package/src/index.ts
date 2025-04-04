import { NitroModules } from "react-native-nitro-modules";
import type {
  PresentationBackground,
  PresentationStyle,
  RNCandle,
  Service,
} from "./specs/RNCandle.nitro";

const CandleHybridObject =
  NitroModules.createHybridObject<RNCandle>("RNCandle");

export function presentCandleLinkSheet({
  service = "default",
  cornerRadius = 24,
  customerName,
  showSandbox = false,
  showDynamicLoading = true,
  presentationBackground = "default",
  presentationStyle = "sheet",
  onSuccess,
}: {
  service?: Service;
  cornerRadius?: number;
  customerName?: string;
  showSandbox?: boolean;
  showDynamicLoading?: boolean;
  presentationBackground?: PresentationBackground;
  presentationStyle?: PresentationStyle;
  onSuccess: (account: string) => void;
}): void {
  CandleHybridObject.candleLinkSheet(
    true,
    service,
    cornerRadius,
    customerName,
    showSandbox,
    showDynamicLoading,
    presentationBackground,
    presentationStyle,
    onSuccess
  );
}

export async function unlinkAccount(linkedAccountID: string): Promise<void> {
  await CandleHybridObject.unlinkAccount(linkedAccountID);
}

export async function getLinkedAccounts(): Promise<string> {
  return await CandleHybridObject.getLinkedAccounts();
}

export async function getFiatAccounts(): Promise<string> {
  return await CandleHybridObject.getFiatAccounts();
}

export async function getActivity(span?: string): Promise<string> {
  return await CandleHybridObject.getActivity(span);
}

export async function deleteUser(): Promise<void> {
  await CandleHybridObject.deleteUser();
}

export async function getAvailableTools(): Promise<string> {
  return await CandleHybridObject.getAvailableTools();
}

export async function executeTool(tool: {
  name: string;
  arguments: string;
}): Promise<string> {
  return await CandleHybridObject.executeTool(tool);
}
