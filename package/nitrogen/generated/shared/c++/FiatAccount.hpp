///
/// FiatAccount.hpp
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

// Forward declaration of `FiatMarketAccountKind` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class FiatMarketAccountKind; }
// Forward declaration of `ACHDetails` to properly resolve imports.
namespace margelo::nitro::rncandle { struct ACHDetails; }
// Forward declaration of `WireDetails` to properly resolve imports.
namespace margelo::nitro::rncandle { struct WireDetails; }
// Forward declaration of `Service` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class Service; }

#include <string>
#include "FiatMarketAccountKind.hpp"
#include <optional>
#include "ACHDetails.hpp"
#include "WireDetails.hpp"
#include "Service.hpp"

namespace margelo::nitro::rncandle {

  /**
   * A struct which can be represented as a JavaScript object (FiatAccount).
   */
  struct FiatAccount {
  public:
    std::string assetKind     SWIFT_PRIVATE;
    std::string serviceAccountID     SWIFT_PRIVATE;
    FiatMarketAccountKind accountKind     SWIFT_PRIVATE;
    std::string nickname     SWIFT_PRIVATE;
    std::string currencyCode     SWIFT_PRIVATE;
    std::optional<double> balance     SWIFT_PRIVATE;
    std::optional<ACHDetails> ach     SWIFT_PRIVATE;
    std::optional<WireDetails> wire     SWIFT_PRIVATE;
    std::string linkedAccountID     SWIFT_PRIVATE;
    Service service     SWIFT_PRIVATE;

  public:
    FiatAccount() = default;
    explicit FiatAccount(std::string assetKind, std::string serviceAccountID, FiatMarketAccountKind accountKind, std::string nickname, std::string currencyCode, std::optional<double> balance, std::optional<ACHDetails> ach, std::optional<WireDetails> wire, std::string linkedAccountID, Service service): assetKind(assetKind), serviceAccountID(serviceAccountID), accountKind(accountKind), nickname(nickname), currencyCode(currencyCode), balance(balance), ach(ach), wire(wire), linkedAccountID(linkedAccountID), service(service) {}
  };

} // namespace margelo::nitro::rncandle

namespace margelo::nitro {

  using namespace margelo::nitro::rncandle;

  // C++ FiatAccount <> JS FiatAccount (object)
  template <>
  struct JSIConverter<FiatAccount> final {
    static inline FiatAccount fromJSI(jsi::Runtime& runtime, const jsi::Value& arg) {
      jsi::Object obj = arg.asObject(runtime);
      return FiatAccount(
        JSIConverter<std::string>::fromJSI(runtime, obj.getProperty(runtime, "assetKind")),
        JSIConverter<std::string>::fromJSI(runtime, obj.getProperty(runtime, "serviceAccountID")),
        JSIConverter<FiatMarketAccountKind>::fromJSI(runtime, obj.getProperty(runtime, "accountKind")),
        JSIConverter<std::string>::fromJSI(runtime, obj.getProperty(runtime, "nickname")),
        JSIConverter<std::string>::fromJSI(runtime, obj.getProperty(runtime, "currencyCode")),
        JSIConverter<std::optional<double>>::fromJSI(runtime, obj.getProperty(runtime, "balance")),
        JSIConverter<std::optional<ACHDetails>>::fromJSI(runtime, obj.getProperty(runtime, "ach")),
        JSIConverter<std::optional<WireDetails>>::fromJSI(runtime, obj.getProperty(runtime, "wire")),
        JSIConverter<std::string>::fromJSI(runtime, obj.getProperty(runtime, "linkedAccountID")),
        JSIConverter<Service>::fromJSI(runtime, obj.getProperty(runtime, "service"))
      );
    }
    static inline jsi::Value toJSI(jsi::Runtime& runtime, const FiatAccount& arg) {
      jsi::Object obj(runtime);
      obj.setProperty(runtime, "assetKind", JSIConverter<std::string>::toJSI(runtime, arg.assetKind));
      obj.setProperty(runtime, "serviceAccountID", JSIConverter<std::string>::toJSI(runtime, arg.serviceAccountID));
      obj.setProperty(runtime, "accountKind", JSIConverter<FiatMarketAccountKind>::toJSI(runtime, arg.accountKind));
      obj.setProperty(runtime, "nickname", JSIConverter<std::string>::toJSI(runtime, arg.nickname));
      obj.setProperty(runtime, "currencyCode", JSIConverter<std::string>::toJSI(runtime, arg.currencyCode));
      obj.setProperty(runtime, "balance", JSIConverter<std::optional<double>>::toJSI(runtime, arg.balance));
      obj.setProperty(runtime, "ach", JSIConverter<std::optional<ACHDetails>>::toJSI(runtime, arg.ach));
      obj.setProperty(runtime, "wire", JSIConverter<std::optional<WireDetails>>::toJSI(runtime, arg.wire));
      obj.setProperty(runtime, "linkedAccountID", JSIConverter<std::string>::toJSI(runtime, arg.linkedAccountID));
      obj.setProperty(runtime, "service", JSIConverter<Service>::toJSI(runtime, arg.service));
      return obj;
    }
    static inline bool canConvert(jsi::Runtime& runtime, const jsi::Value& value) {
      if (!value.isObject()) {
        return false;
      }
      jsi::Object obj = value.getObject(runtime);
      if (!JSIConverter<std::string>::canConvert(runtime, obj.getProperty(runtime, "assetKind"))) return false;
      if (!JSIConverter<std::string>::canConvert(runtime, obj.getProperty(runtime, "serviceAccountID"))) return false;
      if (!JSIConverter<FiatMarketAccountKind>::canConvert(runtime, obj.getProperty(runtime, "accountKind"))) return false;
      if (!JSIConverter<std::string>::canConvert(runtime, obj.getProperty(runtime, "nickname"))) return false;
      if (!JSIConverter<std::string>::canConvert(runtime, obj.getProperty(runtime, "currencyCode"))) return false;
      if (!JSIConverter<std::optional<double>>::canConvert(runtime, obj.getProperty(runtime, "balance"))) return false;
      if (!JSIConverter<std::optional<ACHDetails>>::canConvert(runtime, obj.getProperty(runtime, "ach"))) return false;
      if (!JSIConverter<std::optional<WireDetails>>::canConvert(runtime, obj.getProperty(runtime, "wire"))) return false;
      if (!JSIConverter<std::string>::canConvert(runtime, obj.getProperty(runtime, "linkedAccountID"))) return false;
      if (!JSIConverter<Service>::canConvert(runtime, obj.getProperty(runtime, "service"))) return false;
      return true;
    }
  };

} // namespace margelo::nitro
