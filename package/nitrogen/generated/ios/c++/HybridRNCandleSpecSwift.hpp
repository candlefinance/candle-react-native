///
/// HybridRNCandleSpecSwift.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

#include "HybridRNCandleSpec.hpp"

// Forward declaration of `HybridRNCandleSpec_cxx` to properly resolve imports.
namespace ReactNativeCandle { class HybridRNCandleSpec_cxx; }

// Forward declaration of `Service` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class Service; }
// Forward declaration of `PresentationBackground` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class PresentationBackground; }
// Forward declaration of `PresentationStyle` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class PresentationStyle; }
// Forward declaration of `LinkedAccount` to properly resolve imports.
namespace margelo::nitro::rncandle { struct LinkedAccount; }
// Forward declaration of `LinkedAccountDetails` to properly resolve imports.
namespace margelo::nitro::rncandle { struct LinkedAccountDetails; }
// Forward declaration of `ActiveLinkedAccountDetails` to properly resolve imports.
namespace margelo::nitro::rncandle { struct ActiveLinkedAccountDetails; }
// Forward declaration of `InactiveLinkedAccountDetails` to properly resolve imports.
namespace margelo::nitro::rncandle { struct InactiveLinkedAccountDetails; }
// Forward declaration of `UnavailableLinkedAccountDetails` to properly resolve imports.
namespace margelo::nitro::rncandle { struct UnavailableLinkedAccountDetails; }
// Forward declaration of `TradeQuote` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TradeQuote; }
// Forward declaration of `TradeAsset` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TradeAsset; }
// Forward declaration of `FiatAsset` to properly resolve imports.
namespace margelo::nitro::rncandle { struct FiatAsset; }
// Forward declaration of `MarketTradeAsset` to properly resolve imports.
namespace margelo::nitro::rncandle { struct MarketTradeAsset; }
// Forward declaration of `TransportAsset` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TransportAsset; }
// Forward declaration of `Coordinates` to properly resolve imports.
namespace margelo::nitro::rncandle { struct Coordinates; }
// Forward declaration of `Address` to properly resolve imports.
namespace margelo::nitro::rncandle { struct Address; }
// Forward declaration of `OtherAsset` to properly resolve imports.
namespace margelo::nitro::rncandle { struct OtherAsset; }
// Forward declaration of `NothingAsset` to properly resolve imports.
namespace margelo::nitro::rncandle { struct NothingAsset; }
// Forward declaration of `TradeExecutionResult` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TradeExecutionResult; }
// Forward declaration of `Trade` to properly resolve imports.
namespace margelo::nitro::rncandle { struct Trade; }
// Forward declaration of `TradeState` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class TradeState; }
// Forward declaration of `Counterparty` to properly resolve imports.
namespace margelo::nitro::rncandle { struct Counterparty; }
// Forward declaration of `MerchantCounterparty` to properly resolve imports.
namespace margelo::nitro::rncandle { struct MerchantCounterparty; }
// Forward declaration of `MerchantLocation` to properly resolve imports.
namespace margelo::nitro::rncandle { struct MerchantLocation; }
// Forward declaration of `UserCounterparty` to properly resolve imports.
namespace margelo::nitro::rncandle { struct UserCounterparty; }
// Forward declaration of `ServiceCounterparty` to properly resolve imports.
namespace margelo::nitro::rncandle { struct ServiceCounterparty; }
// Forward declaration of `AppUser` to properly resolve imports.
namespace margelo::nitro::rncandle { struct AppUser; }
// Forward declaration of `LinkedAccountRef` to properly resolve imports.
namespace margelo::nitro::rncandle { struct LinkedAccountRef; }
// Forward declaration of `AssetAccountsResponse` to properly resolve imports.
namespace margelo::nitro::rncandle { struct AssetAccountsResponse; }
// Forward declaration of `LinkedAccountStatusRef` to properly resolve imports.
namespace margelo::nitro::rncandle { struct LinkedAccountStatusRef; }
// Forward declaration of `StatePayload` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class StatePayload; }
// Forward declaration of `AssetAccount` to properly resolve imports.
namespace margelo::nitro::rncandle { struct AssetAccount; }
// Forward declaration of `FiatAccount` to properly resolve imports.
namespace margelo::nitro::rncandle { struct FiatAccount; }
// Forward declaration of `FiatMarketAccountKind` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class FiatMarketAccountKind; }
// Forward declaration of `ACHDetails` to properly resolve imports.
namespace margelo::nitro::rncandle { struct ACHDetails; }
// Forward declaration of `ACHAccountKind` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class ACHAccountKind; }
// Forward declaration of `WireDetails` to properly resolve imports.
namespace margelo::nitro::rncandle { struct WireDetails; }
// Forward declaration of `MarketAccount` to properly resolve imports.
namespace margelo::nitro::rncandle { struct MarketAccount; }
// Forward declaration of `TransportAccount` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TransportAccount; }
// Forward declaration of `TransportAccountKind` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class TransportAccountKind; }
// Forward declaration of `AssetAccountQuery` to properly resolve imports.
namespace margelo::nitro::rncandle { struct AssetAccountQuery; }
// Forward declaration of `AssetAccountKind` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class AssetAccountKind; }
// Forward declaration of `AssetAccountRef` to properly resolve imports.
namespace margelo::nitro::rncandle { struct AssetAccountRef; }
// Forward declaration of `TradesResponse` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TradesResponse; }
// Forward declaration of `TradeQuery` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TradeQuery; }
// Forward declaration of `TradeRef` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TradeRef; }
// Forward declaration of `TradeAssetRef` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TradeAssetRef; }
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
// Forward declaration of `TradeQuotesResponse` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TradeQuotesResponse; }
// Forward declaration of `TradeQuoteRequest` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TradeQuoteRequest; }
// Forward declaration of `TradeAssetQuoteRequest` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TradeAssetQuoteRequest; }
// Forward declaration of `FiatAssetQuoteRequest` to properly resolve imports.
namespace margelo::nitro::rncandle { struct FiatAssetQuoteRequest; }
// Forward declaration of `MarketAssetQuoteRequest` to properly resolve imports.
namespace margelo::nitro::rncandle { struct MarketAssetQuoteRequest; }
// Forward declaration of `TransportAssetQuoteRequest` to properly resolve imports.
namespace margelo::nitro::rncandle { struct TransportAssetQuoteRequest; }
// Forward declaration of `NothingAssetQuoteRequest` to properly resolve imports.
namespace margelo::nitro::rncandle { struct NothingAssetQuoteRequest; }
// Forward declaration of `AnyMap` to properly resolve imports.
namespace NitroModules { class AnyMap; }
// Forward declaration of `ToolCall` to properly resolve imports.
namespace margelo::nitro::rncandle { struct ToolCall; }

#include <optional>
#include <vector>
#include "Service.hpp"
#include <string>
#include "PresentationBackground.hpp"
#include "PresentationStyle.hpp"
#include <functional>
#include "LinkedAccount.hpp"
#include "LinkedAccountDetails.hpp"
#include "ActiveLinkedAccountDetails.hpp"
#include "InactiveLinkedAccountDetails.hpp"
#include "UnavailableLinkedAccountDetails.hpp"
#include "TradeQuote.hpp"
#include "TradeAsset.hpp"
#include "FiatAsset.hpp"
#include "MarketTradeAsset.hpp"
#include "TransportAsset.hpp"
#include "Coordinates.hpp"
#include "Address.hpp"
#include "OtherAsset.hpp"
#include "NothingAsset.hpp"
#include "TradeExecutionResult.hpp"
#include "Trade.hpp"
#include "TradeState.hpp"
#include "Counterparty.hpp"
#include "MerchantCounterparty.hpp"
#include "MerchantLocation.hpp"
#include "UserCounterparty.hpp"
#include "ServiceCounterparty.hpp"
#include "AppUser.hpp"
#include <NitroModules/Promise.hpp>
#include "LinkedAccountRef.hpp"
#include "AssetAccountsResponse.hpp"
#include "LinkedAccountStatusRef.hpp"
#include "StatePayload.hpp"
#include "AssetAccount.hpp"
#include "FiatAccount.hpp"
#include "FiatMarketAccountKind.hpp"
#include "ACHDetails.hpp"
#include "ACHAccountKind.hpp"
#include "WireDetails.hpp"
#include "MarketAccount.hpp"
#include "TransportAccount.hpp"
#include "TransportAccountKind.hpp"
#include "AssetAccountQuery.hpp"
#include "AssetAccountKind.hpp"
#include "AssetAccountRef.hpp"
#include "TradesResponse.hpp"
#include "TradeQuery.hpp"
#include "TradeRef.hpp"
#include "TradeAssetRef.hpp"
#include "FiatAssetRef.hpp"
#include "MarketTradeAssetRef.hpp"
#include "TransportAssetRef.hpp"
#include "OtherAssetRef.hpp"
#include "NothingAssetRef.hpp"
#include "TradeQuotesResponse.hpp"
#include "TradeQuoteRequest.hpp"
#include "TradeAssetQuoteRequest.hpp"
#include "FiatAssetQuoteRequest.hpp"
#include "MarketAssetQuoteRequest.hpp"
#include "TransportAssetQuoteRequest.hpp"
#include "NothingAssetQuoteRequest.hpp"
#include <NitroModules/AnyMap.hpp>
#include "ToolCall.hpp"

#include "ReactNativeCandle-Swift-Cxx-Umbrella.hpp"

namespace margelo::nitro::rncandle {

  /**
   * The C++ part of HybridRNCandleSpec_cxx.swift.
   *
   * HybridRNCandleSpecSwift (C++) accesses HybridRNCandleSpec_cxx (Swift), and might
   * contain some additional bridging code for C++ <> Swift interop.
   *
   * Since this obviously introduces an overhead, I hope at some point in
   * the future, HybridRNCandleSpec_cxx can directly inherit from the C++ class HybridRNCandleSpec
   * to simplify the whole structure and memory management.
   */
  class HybridRNCandleSpecSwift: public virtual HybridRNCandleSpec {
  public:
    // Constructor from a Swift instance
    explicit HybridRNCandleSpecSwift(const ReactNativeCandle::HybridRNCandleSpec_cxx& swiftPart):
      HybridObject(HybridRNCandleSpec::TAG),
      _swiftPart(swiftPart) { }

  public:
    // Get the Swift part
    inline ReactNativeCandle::HybridRNCandleSpec_cxx& getSwiftPart() noexcept {
      return _swiftPart;
    }

  public:
    // Get memory pressure
    inline size_t getExternalMemorySize() noexcept override {
      return _swiftPart.getMemorySize();
    }

  public:
    // Properties
    

  public:
    // Methods
    inline void candleLinkSheet(bool isPresented, const std::optional<std::vector<Service>>& services, double cornerRadius, const std::optional<std::string>& customerName, bool showDynamicLoading, PresentationBackground presentationBackground, PresentationStyle presentationStyle, const std::function<void(const LinkedAccount& /* account */)>& onSuccess) override {
      auto __result = _swiftPart.candleLinkSheet(std::forward<decltype(isPresented)>(isPresented), services, std::forward<decltype(cornerRadius)>(cornerRadius), customerName, std::forward<decltype(showDynamicLoading)>(showDynamicLoading), static_cast<int>(presentationBackground), static_cast<int>(presentationStyle), onSuccess);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
    }
    inline void candleTradeExecutionSheet(const TradeQuote& tradeQuote, PresentationBackground presentationBackground, const std::function<void(const TradeExecutionResult& /* result */)>& completion) override {
      auto __result = _swiftPart.candleTradeExecutionSheet(tradeQuote, static_cast<int>(presentationBackground), completion);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
    }
    inline void initialize(const AppUser& appUser, const std::optional<std::string>& accessGroup) override {
      auto __result = _swiftPart.initialize(appUser, accessGroup);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
    }
    inline std::shared_ptr<Promise<std::vector<LinkedAccount>>> getLinkedAccounts() override {
      auto __result = _swiftPart.getLinkedAccounts();
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<LinkedAccount>> getLinkedAccount(const LinkedAccountRef& ref) override {
      auto __result = _swiftPart.getLinkedAccount(ref);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<void>> unlinkAccount(const LinkedAccountRef& ref) override {
      auto __result = _swiftPart.unlinkAccount(ref);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<AssetAccountsResponse>> getAssetAccounts(const AssetAccountQuery& query) override {
      auto __result = _swiftPart.getAssetAccounts(query);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<AssetAccount>> getAssetAccount(const AssetAccountRef& ref) override {
      auto __result = _swiftPart.getAssetAccount(ref);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<TradesResponse>> getTrades(const TradeQuery& query) override {
      auto __result = _swiftPart.getTrades(query);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<Trade>> getTrade(const TradeRef& ref) override {
      auto __result = _swiftPart.getTrade(ref);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<TradeQuotesResponse>> getTradeQuotes(const TradeQuoteRequest& request) override {
      auto __result = _swiftPart.getTradeQuotes(request);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<void>> deleteUser() override {
      auto __result = _swiftPart.deleteUser();
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<std::vector<std::shared_ptr<AnyMap>>>> getAvailableTools() override {
      auto __result = _swiftPart.getAvailableTools();
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<std::string>> executeTool(const ToolCall& tool) override {
      auto __result = _swiftPart.executeTool(tool);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }

  private:
    ReactNativeCandle::HybridRNCandleSpec_cxx _swiftPart;
  };

} // namespace margelo::nitro::rncandle
