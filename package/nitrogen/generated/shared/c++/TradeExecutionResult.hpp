///
/// TradeExecutionResult.hpp
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

// Forward declaration of `Trade` to properly resolve imports.
namespace margelo::nitro::rncandle { struct Trade; }

#include <optional>
#include "Trade.hpp"
#include <string>

namespace margelo::nitro::rncandle {

  /**
   * A struct which can be represented as a JavaScript object (TradeExecutionResult).
   */
  struct TradeExecutionResult {
  public:
    std::optional<Trade> trade     SWIFT_PRIVATE;
    std::optional<std::string> error     SWIFT_PRIVATE;

  public:
    TradeExecutionResult() = default;
    explicit TradeExecutionResult(std::optional<Trade> trade, std::optional<std::string> error): trade(trade), error(error) {}
  };

} // namespace margelo::nitro::rncandle

namespace margelo::nitro {

  using namespace margelo::nitro::rncandle;

  // C++ TradeExecutionResult <> JS TradeExecutionResult (object)
  template <>
  struct JSIConverter<TradeExecutionResult> final {
    static inline TradeExecutionResult fromJSI(jsi::Runtime& runtime, const jsi::Value& arg) {
      jsi::Object obj = arg.asObject(runtime);
      return TradeExecutionResult(
        JSIConverter<std::optional<Trade>>::fromJSI(runtime, obj.getProperty(runtime, "trade")),
        JSIConverter<std::optional<std::string>>::fromJSI(runtime, obj.getProperty(runtime, "error"))
      );
    }
    static inline jsi::Value toJSI(jsi::Runtime& runtime, const TradeExecutionResult& arg) {
      jsi::Object obj(runtime);
      obj.setProperty(runtime, "trade", JSIConverter<std::optional<Trade>>::toJSI(runtime, arg.trade));
      obj.setProperty(runtime, "error", JSIConverter<std::optional<std::string>>::toJSI(runtime, arg.error));
      return obj;
    }
    static inline bool canConvert(jsi::Runtime& runtime, const jsi::Value& value) {
      if (!value.isObject()) {
        return false;
      }
      jsi::Object obj = value.getObject(runtime);
      if (!JSIConverter<std::optional<Trade>>::canConvert(runtime, obj.getProperty(runtime, "trade"))) return false;
      if (!JSIConverter<std::optional<std::string>>::canConvert(runtime, obj.getProperty(runtime, "error"))) return false;
      return true;
    }
  };

} // namespace margelo::nitro
