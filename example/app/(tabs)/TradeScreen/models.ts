import {
  Counterparty,
  TradeAsset,
  LinkedAccountStatusRef,
  Trade,
} from "react-native-candle";

const SUPPORTED_SPANS = [
  { id: "PT3H", title: "3 Hours" },
  { id: "PT6H", title: "6 Hours" },
  { id: "PT12H", title: "12 Hours" },
  { id: "P1D", title: "1 Day" },
  { id: "P7D", title: "7 Days" },
  { id: "P1M", title: "1 Month" },
  { id: "P6M", title: "6 Months" },
  { id: "P1Y", title: "1 Year" },
  { id: "none", title: "No Span" },
] as const;

type SectionItem =
  | { kind: "account"; value: LinkedAccountStatusRef }
  | { kind: "trade"; value: Trade };

const FILTER_CONFIG = [
  {
    key: "dateTimeSpan",
    title: "Date/Time Span",
    options: SUPPORTED_SPANS.map((s) => ({
      value: s.id,
      label: s.title,
    })),
  },
  {
    key: "lostAssetKind",
    title: "Lost Asset Kind",
    options: ["cash", "crypto", "stock", "transport", "nothing", "other"].map(
      (k) => ({
        value: k,
        label: k,
      })
    ),
  },
  {
    key: "gainedAssetKind",
    title: "Gained Asset Kind",
    options: ["cash", "crypto", "stock", "transport", "nothing", "other"].map(
      (k) => ({
        value: k,
        label: k,
      })
    ),
  },
  {
    key: "counterpartyKind",
    title: "Counterparty Kind",
    options: ["merchant", "user", "service"].map((k) => ({
      value: k,
      label: k,
    })),
  },
] as const;

const assetDisplayName = (asset: TradeAsset): string => {
  switch (asset.assetKind) {
    case "transport":
      return asset.name;
    case "stock":
      return asset.name;
    case "nothing":
      return asset.assetKind;
    case "other":
      return asset.assetKind;
    case "crypto":
      return asset.name;
    case "fiat":
      return asset.currencyCode;
  }
};

const counterpartyDisplayName = (cp: Counterparty): string => {
  switch (cp.kind) {
    case "merchant":
      return cp.name;
    case "user":
      return cp.username;
    case "service":
      return cp.service;
  }
};

export {
  SUPPORTED_SPANS,
  FILTER_CONFIG,
  assetDisplayName,
  counterpartyDisplayName,
  SectionItem,
};
