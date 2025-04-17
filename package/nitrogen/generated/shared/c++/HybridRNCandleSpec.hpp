///
/// HybridRNCandleSpec.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

#if __has_include(<NitroModules/HybridObject.hpp>)
#include <NitroModules/HybridObject.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif

// Forward declaration of `Service` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class Service; }
// Forward declaration of `PresentationBackground` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class PresentationBackground; }
// Forward declaration of `PresentationStyle` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class PresentationStyle; }
// Forward declaration of `LinkedAccount` to properly resolve imports.
namespace margelo::nitro::rncandle { struct LinkedAccount; }
// Forward declaration of `ToolCall` to properly resolve imports.
namespace margelo::nitro::rncandle { struct ToolCall; }

#include "Service.hpp"
#include <optional>
#include <string>
#include "PresentationBackground.hpp"
#include "PresentationStyle.hpp"
#include <functional>
#include <NitroModules/Promise.hpp>
#include <vector>
#include "LinkedAccount.hpp"
#include "ToolCall.hpp"

namespace margelo::nitro::rncandle {

  using namespace margelo::nitro;

  /**
   * An abstract base class for `RNCandle`
   * Inherit this class to create instances of `HybridRNCandleSpec` in C++.
   * You must explicitly call `HybridObject`'s constructor yourself, because it is virtual.
   * @example
   * ```cpp
   * class HybridRNCandle: public HybridRNCandleSpec {
   * public:
   *   HybridRNCandle(...): HybridObject(TAG) { ... }
   *   // ...
   * };
   * ```
   */
  class HybridRNCandleSpec: public virtual HybridObject {
    public:
      // Constructor
      explicit HybridRNCandleSpec(): HybridObject(TAG) { }

      // Destructor
      ~HybridRNCandleSpec() override = default;

    public:
      // Properties
      

    public:
      // Methods
      virtual void candleLinkSheet(bool isPresented, Service service, double cornerRadius, const std::optional<std::string>& customerName, bool showSandbox, bool showDynamicLoading, PresentationBackground presentationBackground, PresentationStyle presentationStyle, const std::function<void(const std::string& /* account */)>& onSuccess) = 0;
      virtual std::shared_ptr<Promise<std::vector<LinkedAccount>>> getLinkedAccounts() = 0;
      virtual std::shared_ptr<Promise<void>> unlinkAccount(const std::string& linkedAccountID) = 0;
      virtual std::shared_ptr<Promise<std::string>> getFiatAccounts() = 0;
      virtual std::shared_ptr<Promise<std::string>> getActivity(const std::optional<std::string>& span) = 0;
      virtual std::shared_ptr<Promise<void>> deleteUser() = 0;
      virtual std::shared_ptr<Promise<std::string>> getAvailableTools() = 0;
      virtual std::shared_ptr<Promise<std::string>> executeTool(const ToolCall& tool) = 0;

    protected:
      // Hybrid Setup
      void loadHybridMethods() override;

    protected:
      // Tag for logging
      static constexpr auto TAG = "RNCandle";
  };

} // namespace margelo::nitro::rncandle
