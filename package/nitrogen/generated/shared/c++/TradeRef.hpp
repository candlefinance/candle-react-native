///
/// TradeRef.hpp
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

// Forward declaration of `TradeAssetRef` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TradeAssetRef; }

#include "TradeAssetRef.hpp"

namespace margelo::nitro::rncandle {

  /**
   * A struct which can be represented as a JavaScript object (TradeRef).
   */
  struct TradeRef {
  public:
    TradeAssetRef lost     SWIFT_PRIVATE;
    TradeAssetRef gained     SWIFT_PRIVATE;

  public:
    TradeRef() = default;
    explicit TradeRef(TradeAssetRef lost, TradeAssetRef gained): lost(lost), gained(gained) {}
  };

} // namespace margelo::nitro::rncandle

namespace margelo::nitro {

  using namespace margelo::nitro::rncandle;

  // C++ TradeRef <> JS TradeRef (object)
  template <>
  struct JSIConverter<TradeRef> final {
    static inline TradeRef fromJSI(jsi::Runtime& runtime, const jsi::Value& arg) {
      jsi::Object obj = arg.asObject(runtime);
      return TradeRef(
        JSIConverter<TradeAssetRef>::fromJSI(runtime, obj.getProperty(runtime, "lost")),
        JSIConverter<TradeAssetRef>::fromJSI(runtime, obj.getProperty(runtime, "gained"))
      );
    }
    static inline jsi::Value toJSI(jsi::Runtime& runtime, const TradeRef& arg) {
      jsi::Object obj(runtime);
      obj.setProperty(runtime, "lost", JSIConverter<TradeAssetRef>::toJSI(runtime, arg.lost));
      obj.setProperty(runtime, "gained", JSIConverter<TradeAssetRef>::toJSI(runtime, arg.gained));
      return obj;
    }
    static inline bool canConvert(jsi::Runtime& runtime, const jsi::Value& value) {
      if (!value.isObject()) {
        return false;
      }
      jsi::Object obj = value.getObject(runtime);
      if (!JSIConverter<TradeAssetRef>::canConvert(runtime, obj.getProperty(runtime, "lost"))) return false;
      if (!JSIConverter<TradeAssetRef>::canConvert(runtime, obj.getProperty(runtime, "gained"))) return false;
      return true;
    }
  };

} // namespace margelo::nitro
