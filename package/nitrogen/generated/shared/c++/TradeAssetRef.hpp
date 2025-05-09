///
/// TradeAssetRef.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

#if __has_include(<NitroModules/JSIConverter.hpp>)
#include <NitroModules/JSIConverter.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif
#if __has_include(<NitroModules/NitroDefines.hpp>)
#include <NitroModules/NitroDefines.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif

// Forward declaration of `FiatAssetRef` to properly resolve imports.
namespace margelo::nitro::rncandle { struct FiatAssetRef; }
// Forward declaration of `MarketTradeAssetRef` to properly resolve imports.
namespace margelo::nitro::rncandle { struct MarketTradeAssetRef; }
// Forward declaration of `TransportAssetRef` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TransportAssetRef; }
// Forward declaration of `OtherAssetRef` to properly resolve imports.
namespace margelo::nitro::rncandle { struct OtherAssetRef; }
// Forward declaration of `NothingAssetRef` to properly resolve imports.
namespace margelo::nitro::rncandle { struct NothingAssetRef; }

#include <optional>
#include "FiatAssetRef.hpp"
#include "MarketTradeAssetRef.hpp"
#include "TransportAssetRef.hpp"
#include "OtherAssetRef.hpp"
#include "NothingAssetRef.hpp"

namespace margelo::nitro::rncandle {

  /**
   * A struct which can be represented as a JavaScript object (TradeAssetRef).
   */
  struct TradeAssetRef {
  public:
    std::optional<FiatAssetRef> fiatAssetRef     SWIFT_PRIVATE;
    std::optional<MarketTradeAssetRef> marketTradeAssetRef     SWIFT_PRIVATE;
    std::optional<TransportAssetRef> transportAssetRef     SWIFT_PRIVATE;
    std::optional<OtherAssetRef> otherAssetRef     SWIFT_PRIVATE;
    std::optional<NothingAssetRef> nothingAssetRef     SWIFT_PRIVATE;

  public:
    TradeAssetRef() = default;
    explicit TradeAssetRef(std::optional<FiatAssetRef> fiatAssetRef, std::optional<MarketTradeAssetRef> marketTradeAssetRef, std::optional<TransportAssetRef> transportAssetRef, std::optional<OtherAssetRef> otherAssetRef, std::optional<NothingAssetRef> nothingAssetRef): fiatAssetRef(fiatAssetRef), marketTradeAssetRef(marketTradeAssetRef), transportAssetRef(transportAssetRef), otherAssetRef(otherAssetRef), nothingAssetRef(nothingAssetRef) {}
  };

} // namespace margelo::nitro::rncandle

namespace margelo::nitro {

  using namespace margelo::nitro::rncandle;

  // C++ TradeAssetRef <> JS TradeAssetRef (object)
  template <>
  struct JSIConverter<TradeAssetRef> final {
    static inline TradeAssetRef fromJSI(jsi::Runtime& runtime, const jsi::Value& arg) {
      jsi::Object obj = arg.asObject(runtime);
      return TradeAssetRef(
        JSIConverter<std::optional<FiatAssetRef>>::fromJSI(runtime, obj.getProperty(runtime, "fiatAssetRef")),
        JSIConverter<std::optional<MarketTradeAssetRef>>::fromJSI(runtime, obj.getProperty(runtime, "marketTradeAssetRef")),
        JSIConverter<std::optional<TransportAssetRef>>::fromJSI(runtime, obj.getProperty(runtime, "transportAssetRef")),
        JSIConverter<std::optional<OtherAssetRef>>::fromJSI(runtime, obj.getProperty(runtime, "otherAssetRef")),
        JSIConverter<std::optional<NothingAssetRef>>::fromJSI(runtime, obj.getProperty(runtime, "nothingAssetRef"))
      );
    }
    static inline jsi::Value toJSI(jsi::Runtime& runtime, const TradeAssetRef& arg) {
      jsi::Object obj(runtime);
      obj.setProperty(runtime, "fiatAssetRef", JSIConverter<std::optional<FiatAssetRef>>::toJSI(runtime, arg.fiatAssetRef));
      obj.setProperty(runtime, "marketTradeAssetRef", JSIConverter<std::optional<MarketTradeAssetRef>>::toJSI(runtime, arg.marketTradeAssetRef));
      obj.setProperty(runtime, "transportAssetRef", JSIConverter<std::optional<TransportAssetRef>>::toJSI(runtime, arg.transportAssetRef));
      obj.setProperty(runtime, "otherAssetRef", JSIConverter<std::optional<OtherAssetRef>>::toJSI(runtime, arg.otherAssetRef));
      obj.setProperty(runtime, "nothingAssetRef", JSIConverter<std::optional<NothingAssetRef>>::toJSI(runtime, arg.nothingAssetRef));
      return obj;
    }
    static inline bool canConvert(jsi::Runtime& runtime, const jsi::Value& value) {
      if (!value.isObject()) {
        return false;
      }
      jsi::Object obj = value.getObject(runtime);
      if (!JSIConverter<std::optional<FiatAssetRef>>::canConvert(runtime, obj.getProperty(runtime, "fiatAssetRef"))) return false;
      if (!JSIConverter<std::optional<MarketTradeAssetRef>>::canConvert(runtime, obj.getProperty(runtime, "marketTradeAssetRef"))) return false;
      if (!JSIConverter<std::optional<TransportAssetRef>>::canConvert(runtime, obj.getProperty(runtime, "transportAssetRef"))) return false;
      if (!JSIConverter<std::optional<OtherAssetRef>>::canConvert(runtime, obj.getProperty(runtime, "otherAssetRef"))) return false;
      if (!JSIConverter<std::optional<NothingAssetRef>>::canConvert(runtime, obj.getProperty(runtime, "nothingAssetRef"))) return false;
      return true;
    }
  };

} // namespace margelo::nitro
