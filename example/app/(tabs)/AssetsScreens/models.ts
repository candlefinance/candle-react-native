import {
  AssetAccount,
  AssetAccountQuery,
  LinkedAccountStatusRef,
} from "react-native-candle";

export const FILTER_CONFIG = [
  {
    key: "assetKind",
    title: "Asset Kind",
    options: [
      { value: "crypto", label: "Crypto" },
      { value: "stock", label: "Stock" },
      { value: "fiat", label: "Fiat" },
      { value: "transport", label: "Transport" },
    ],
  },
] as const;

export function toggleLinkedAccountIDs(
  current: string | undefined,
  id: string
): string | undefined {
  const arr = current ? current.split(",") : [];
  const index = arr.indexOf(id);
  if (index >= 0) {
    arr.splice(index, 1);
  } else {
    arr.push(id);
  }
  return arr.length ? arr.join(",") : undefined;
}

export function updateFilters(
  prev: AssetAccountQuery,
  key: "assetKind" | "linkedAccountIDs",
  value: string
): AssetAccountQuery {
  switch (key) {
    case "assetKind":
      return {
        ...prev,
        assetKind:
          prev.assetKind === value
            ? undefined
            : (value as AssetAccountQuery["assetKind"]),
      };
    case "linkedAccountIDs":
      return {
        ...prev,
        linkedAccountIDs: toggleLinkedAccountIDs(prev.linkedAccountIDs, value),
      };
  }
}

export type SectionItem =
  | { kind: "account"; value: LinkedAccountStatusRef }
  | { kind: "assetAccount"; value: AssetAccount };
