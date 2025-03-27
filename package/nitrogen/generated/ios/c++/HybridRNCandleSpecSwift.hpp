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
// Forward declaration of `ToolCall` to properly resolve imports.
namespace margelo::nitro::rncandle { struct ToolCall; }

#include "Service.hpp"
#include <optional>
#include <string>
#include "PresentationBackground.hpp"
#include "PresentationStyle.hpp"
#include <functional>
#include <NitroModules/Promise.hpp>
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
    inline void candleLinkSheet(bool isPresented, Service service, double cornerRadius, const std::optional<std::string>& customerName, bool showSandbox, bool showDynamicLoading, PresentationBackground presentationBackground, PresentationStyle presentationStyle, const std::function<void(const std::string& /* account */)>& onSuccess) override {
      auto __result = _swiftPart.candleLinkSheet(std::forward<decltype(isPresented)>(isPresented), static_cast<int>(service), std::forward<decltype(cornerRadius)>(cornerRadius), customerName, std::forward<decltype(showSandbox)>(showSandbox), std::forward<decltype(showDynamicLoading)>(showDynamicLoading), static_cast<int>(presentationBackground), static_cast<int>(presentationStyle), onSuccess);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
    }
    inline std::shared_ptr<Promise<std::string>> getLinkedAccounts() override {
      auto __result = _swiftPart.getLinkedAccounts();
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<void>> unlinkAccount(const std::string& linkedAccountID) override {
      auto __result = _swiftPart.unlinkAccount(linkedAccountID);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<std::string>> getFiatAccounts() override {
      auto __result = _swiftPart.getFiatAccounts();
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<std::string>> getActivity(const std::optional<std::string>& span) override {
      auto __result = _swiftPart.getActivity(span);
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
    inline std::shared_ptr<Promise<std::string>> getAvailableTools() override {
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
