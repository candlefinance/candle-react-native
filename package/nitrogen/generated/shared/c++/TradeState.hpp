///
/// TradeState.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

#if __has_include(<NitroModules/NitroHash.hpp>)
#include <NitroModules/NitroHash.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif
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

namespace margelo::nitro::rncandle {

  /**
   * An enum which can be represented as a JavaScript union (TradeState).
   */
  enum class TradeState {
    SUCCESS      SWIFT_NAME(success) = 0,
    INPROGRESS      SWIFT_NAME(inprogress) = 1,
    FAILURE      SWIFT_NAME(failure) = 2,
  } CLOSED_ENUM;

} // namespace margelo::nitro::rncandle

namespace margelo::nitro {

  using namespace margelo::nitro::rncandle;

  // C++ TradeState <> JS TradeState (union)
  template <>
  struct JSIConverter<TradeState> final {
    static inline TradeState fromJSI(jsi::Runtime& runtime, const jsi::Value& arg) {
      std::string unionValue = JSIConverter<std::string>::fromJSI(runtime, arg);
      switch (hashString(unionValue.c_str(), unionValue.size())) {
        case hashString("success"): return TradeState::SUCCESS;
        case hashString("inProgress"): return TradeState::INPROGRESS;
        case hashString("failure"): return TradeState::FAILURE;
        default: [[unlikely]]
          throw std::invalid_argument("Cannot convert \"" + unionValue + "\" to enum TradeState - invalid value!");
      }
    }
    static inline jsi::Value toJSI(jsi::Runtime& runtime, TradeState arg) {
      switch (arg) {
        case TradeState::SUCCESS: return JSIConverter<std::string>::toJSI(runtime, "success");
        case TradeState::INPROGRESS: return JSIConverter<std::string>::toJSI(runtime, "inProgress");
        case TradeState::FAILURE: return JSIConverter<std::string>::toJSI(runtime, "failure");
        default: [[unlikely]]
          throw std::invalid_argument("Cannot convert TradeState to JS - invalid value: "
                                    + std::to_string(static_cast<int>(arg)) + "!");
      }
    }
    static inline bool canConvert(jsi::Runtime& runtime, const jsi::Value& value) {
      if (!value.isString()) {
        return false;
      }
      std::string unionValue = JSIConverter<std::string>::fromJSI(runtime, value);
      switch (hashString(unionValue.c_str(), unionValue.size())) {
        case hashString("success"):
        case hashString("inProgress"):
        case hashString("failure"):
          return true;
        default:
          return false;
      }
    }
  };

} // namespace margelo::nitro
