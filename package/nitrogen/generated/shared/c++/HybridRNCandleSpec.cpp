///
/// HybridRNCandleSpec.cpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#include "HybridRNCandleSpec.hpp"

namespace margelo::nitro::rncandle {

  void HybridRNCandleSpec::loadHybridMethods() {
    // load base methods/properties
    HybridObject::loadHybridMethods();
    // load custom methods/properties
    registerHybrids(this, [](Prototype& prototype) {
      prototype.registerHybridMethod("candleLinkSheet", &HybridRNCandleSpec::candleLinkSheet);
      prototype.registerHybridMethod("initialize", &HybridRNCandleSpec::initialize);
      prototype.registerHybridMethod("getLinkedAccounts", &HybridRNCandleSpec::getLinkedAccounts);
      prototype.registerHybridMethod("unlinkAccount", &HybridRNCandleSpec::unlinkAccount);
      prototype.registerHybridMethod("getFiatAccounts", &HybridRNCandleSpec::getFiatAccounts);
      prototype.registerHybridMethod("getActivity", &HybridRNCandleSpec::getActivity);
      prototype.registerHybridMethod("deleteUser", &HybridRNCandleSpec::deleteUser);
      prototype.registerHybridMethod("getAvailableTools", &HybridRNCandleSpec::getAvailableTools);
      prototype.registerHybridMethod("executeTool", &HybridRNCandleSpec::executeTool);
    });
  }

} // namespace margelo::nitro::rncandle
