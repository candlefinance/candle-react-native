///
/// MarketTradeAssetRef.hpp
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



#include <string>

namespace margelo::nitro::rncandle {

  /**
   * A struct which can be represented as a JavaScript object (MarketTradeAssetRef).
   */
  struct MarketTradeAssetRef {
  public:
    std::string assetKind     SWIFT_PRIVATE;
    std::string serviceTradeID     SWIFT_PRIVATE;
    std::string linkedAccountID     SWIFT_PRIVATE;

  public:
    MarketTradeAssetRef() = default;
    explicit MarketTradeAssetRef(std::string assetKind, std::string serviceTradeID, std::string linkedAccountID): assetKind(assetKind), serviceTradeID(serviceTradeID), linkedAccountID(linkedAccountID) {}
  };

} // namespace margelo::nitro::rncandle

namespace margelo::nitro {

  using namespace margelo::nitro::rncandle;

  // C++ MarketTradeAssetRef <> JS MarketTradeAssetRef (object)
  template <>
  struct JSIConverter<MarketTradeAssetRef> final {
    static inline MarketTradeAssetRef fromJSI(jsi::Runtime& runtime, const jsi::Value& arg) {
      jsi::Object obj = arg.asObject(runtime);
      return MarketTradeAssetRef(
        JSIConverter<std::string>::fromJSI(runtime, obj.getProperty(runtime, "assetKind")),
        JSIConverter<std::string>::fromJSI(runtime, obj.getProperty(runtime, "serviceTradeID")),
        JSIConverter<std::string>::fromJSI(runtime, obj.getProperty(runtime, "linkedAccountID"))
      );
    }
    static inline jsi::Value toJSI(jsi::Runtime& runtime, const MarketTradeAssetRef& arg) {
      jsi::Object obj(runtime);
      obj.setProperty(runtime, "assetKind", JSIConverter<std::string>::toJSI(runtime, arg.assetKind));
      obj.setProperty(runtime, "serviceTradeID", JSIConverter<std::string>::toJSI(runtime, arg.serviceTradeID));
      obj.setProperty(runtime, "linkedAccountID", JSIConverter<std::string>::toJSI(runtime, arg.linkedAccountID));
      return obj;
    }
    static inline bool canConvert(jsi::Runtime& runtime, const jsi::Value& value) {
      if (!value.isObject()) {
        return false;
      }
      jsi::Object obj = value.getObject(runtime);
      if (!JSIConverter<std::string>::canConvert(runtime, obj.getProperty(runtime, "assetKind"))) return false;
      if (!JSIConverter<std::string>::canConvert(runtime, obj.getProperty(runtime, "serviceTradeID"))) return false;
      if (!JSIConverter<std::string>::canConvert(runtime, obj.getProperty(runtime, "linkedAccountID"))) return false;
      return true;
    }
  };

} // namespace margelo::nitro
