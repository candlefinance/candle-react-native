///
/// Trade.hpp
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

// Forward declaration of `TradeState` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class TradeState; }
// Forward declaration of `Counterparty` to properly resolve imports.
namespace margelo::nitro::rncandle { struct Counterparty; }
// Forward declaration of `TradeAsset` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TradeAsset; }

#include <string>
#include "TradeState.hpp"
#include "Counterparty.hpp"
#include "TradeAsset.hpp"

namespace margelo::nitro::rncandle {

  /**
   * A struct which can be represented as a JavaScript object (Trade).
   */
  struct Trade {
  public:
    std::string dateTime     SWIFT_PRIVATE;
    TradeState state     SWIFT_PRIVATE;
    Counterparty counterparty     SWIFT_PRIVATE;
    TradeAsset lost     SWIFT_PRIVATE;
    TradeAsset gained     SWIFT_PRIVATE;

  public:
    Trade() = default;
    explicit Trade(std::string dateTime, TradeState state, Counterparty counterparty, TradeAsset lost, TradeAsset gained): dateTime(dateTime), state(state), counterparty(counterparty), lost(lost), gained(gained) {}
  };

} // namespace margelo::nitro::rncandle

namespace margelo::nitro {

  using namespace margelo::nitro::rncandle;

  // C++ Trade <> JS Trade (object)
  template <>
  struct JSIConverter<Trade> final {
    static inline Trade fromJSI(jsi::Runtime& runtime, const jsi::Value& arg) {
      jsi::Object obj = arg.asObject(runtime);
      return Trade(
        JSIConverter<std::string>::fromJSI(runtime, obj.getProperty(runtime, "dateTime")),
        JSIConverter<TradeState>::fromJSI(runtime, obj.getProperty(runtime, "state")),
        JSIConverter<Counterparty>::fromJSI(runtime, obj.getProperty(runtime, "counterparty")),
        JSIConverter<TradeAsset>::fromJSI(runtime, obj.getProperty(runtime, "lost")),
        JSIConverter<TradeAsset>::fromJSI(runtime, obj.getProperty(runtime, "gained"))
      );
    }
    static inline jsi::Value toJSI(jsi::Runtime& runtime, const Trade& arg) {
      jsi::Object obj(runtime);
      obj.setProperty(runtime, "dateTime", JSIConverter<std::string>::toJSI(runtime, arg.dateTime));
      obj.setProperty(runtime, "state", JSIConverter<TradeState>::toJSI(runtime, arg.state));
      obj.setProperty(runtime, "counterparty", JSIConverter<Counterparty>::toJSI(runtime, arg.counterparty));
      obj.setProperty(runtime, "lost", JSIConverter<TradeAsset>::toJSI(runtime, arg.lost));
      obj.setProperty(runtime, "gained", JSIConverter<TradeAsset>::toJSI(runtime, arg.gained));
      return obj;
    }
    static inline bool canConvert(jsi::Runtime& runtime, const jsi::Value& value) {
      if (!value.isObject()) {
        return false;
      }
      jsi::Object obj = value.getObject(runtime);
      if (!JSIConverter<std::string>::canConvert(runtime, obj.getProperty(runtime, "dateTime"))) return false;
      if (!JSIConverter<TradeState>::canConvert(runtime, obj.getProperty(runtime, "state"))) return false;
      if (!JSIConverter<Counterparty>::canConvert(runtime, obj.getProperty(runtime, "counterparty"))) return false;
      if (!JSIConverter<TradeAsset>::canConvert(runtime, obj.getProperty(runtime, "lost"))) return false;
      if (!JSIConverter<TradeAsset>::canConvert(runtime, obj.getProperty(runtime, "gained"))) return false;
      return true;
    }
  };

} // namespace margelo::nitro
