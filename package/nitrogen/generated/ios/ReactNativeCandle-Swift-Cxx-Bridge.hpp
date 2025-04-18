///
/// ReactNativeCandle-Swift-Cxx-Bridge.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

// Forward declarations of C++ defined types
// Forward declaration of `Details` to properly resolve imports.
namespace margelo::nitro::rncandle { struct Details; }
// Forward declaration of `HybridRNCandleSpec` to properly resolve imports.
namespace margelo::nitro::rncandle { class HybridRNCandleSpec; }
// Forward declaration of `LinkedAccount` to properly resolve imports.
namespace margelo::nitro::rncandle { struct LinkedAccount; }
// Forward declaration of `Service` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class Service; }
// Forward declaration of `State` to properly resolve imports.
namespace margelo::nitro::rncandle { enum class State; }

// Forward declarations of Swift defined types
// Forward declaration of `HybridRNCandleSpec_cxx` to properly resolve imports.
namespace ReactNativeCandle { class HybridRNCandleSpec_cxx; }

// Include C++ defined types
#include "Details.hpp"
#include "HybridRNCandleSpec.hpp"
#include "LinkedAccount.hpp"
#include "Service.hpp"
#include "State.hpp"
#include <NitroModules/Promise.hpp>
#include <NitroModules/PromiseHolder.hpp>
#include <NitroModules/Result.hpp>
#include <exception>
#include <functional>
#include <memory>
#include <optional>
#include <string>
#include <vector>

/**
 * Contains specialized versions of C++ templated types so they can be accessed from Swift,
 * as well as helper functions to interact with those C++ types from Swift.
 */
namespace margelo::nitro::rncandle::bridge::swift {

  // pragma MARK: std::vector<Service>
  /**
   * Specialized version of `std::vector<Service>`.
   */
  using std__vector_Service_ = std::vector<Service>;
  inline std::vector<Service> create_std__vector_Service_(size_t size) {
    std::vector<Service> vector;
    vector.reserve(size);
    return vector;
  }
  
  // pragma MARK: std::optional<std::vector<Service>>
  /**
   * Specialized version of `std::optional<std::vector<Service>>`.
   */
  using std__optional_std__vector_Service__ = std::optional<std::vector<Service>>;
  inline std::optional<std::vector<Service>> create_std__optional_std__vector_Service__(const std::vector<Service>& value) {
    return std::optional<std::vector<Service>>(value);
  }
  
  // pragma MARK: std::optional<std::string>
  /**
   * Specialized version of `std::optional<std::string>`.
   */
  using std__optional_std__string_ = std::optional<std::string>;
  inline std::optional<std::string> create_std__optional_std__string_(const std::string& value) {
    return std::optional<std::string>(value);
  }
  
  // pragma MARK: std::function<void(const std::string& /* account */)>
  /**
   * Specialized version of `std::function<void(const std::string&)>`.
   */
  using Func_void_std__string = std::function<void(const std::string& /* account */)>;
  /**
   * Wrapper class for a `std::function<void(const std::string& / * account * /)>`, this can be used from Swift.
   */
  class Func_void_std__string_Wrapper final {
  public:
    explicit Func_void_std__string_Wrapper(std::function<void(const std::string& /* account */)>&& func): _function(std::make_shared<std::function<void(const std::string& /* account */)>>(std::move(func))) {}
    inline void call(std::string account) const {
      _function->operator()(account);
    }
  private:
    std::shared_ptr<std::function<void(const std::string& /* account */)>> _function;
  };
  Func_void_std__string create_Func_void_std__string(void* _Nonnull swiftClosureWrapper);
  inline Func_void_std__string_Wrapper wrap_Func_void_std__string(Func_void_std__string value) {
    return Func_void_std__string_Wrapper(std::move(value));
  }
  
  // pragma MARK: std::optional<Details>
  /**
   * Specialized version of `std::optional<Details>`.
   */
  using std__optional_Details_ = std::optional<Details>;
  inline std::optional<Details> create_std__optional_Details_(const Details& value) {
    return std::optional<Details>(value);
  }
  
  // pragma MARK: std::vector<LinkedAccount>
  /**
   * Specialized version of `std::vector<LinkedAccount>`.
   */
  using std__vector_LinkedAccount_ = std::vector<LinkedAccount>;
  inline std::vector<LinkedAccount> create_std__vector_LinkedAccount_(size_t size) {
    std::vector<LinkedAccount> vector;
    vector.reserve(size);
    return vector;
  }
  
  // pragma MARK: std::shared_ptr<Promise<std::vector<LinkedAccount>>>
  /**
   * Specialized version of `std::shared_ptr<Promise<std::vector<LinkedAccount>>>`.
   */
  using std__shared_ptr_Promise_std__vector_LinkedAccount___ = std::shared_ptr<Promise<std::vector<LinkedAccount>>>;
  inline std::shared_ptr<Promise<std::vector<LinkedAccount>>> create_std__shared_ptr_Promise_std__vector_LinkedAccount___() {
    return Promise<std::vector<LinkedAccount>>::create();
  }
  inline PromiseHolder<std::vector<LinkedAccount>> wrap_std__shared_ptr_Promise_std__vector_LinkedAccount___(std::shared_ptr<Promise<std::vector<LinkedAccount>>> promise) {
    return PromiseHolder<std::vector<LinkedAccount>>(std::move(promise));
  }
  
  // pragma MARK: std::function<void(const std::vector<LinkedAccount>& /* result */)>
  /**
   * Specialized version of `std::function<void(const std::vector<LinkedAccount>&)>`.
   */
  using Func_void_std__vector_LinkedAccount_ = std::function<void(const std::vector<LinkedAccount>& /* result */)>;
  /**
   * Wrapper class for a `std::function<void(const std::vector<LinkedAccount>& / * result * /)>`, this can be used from Swift.
   */
  class Func_void_std__vector_LinkedAccount__Wrapper final {
  public:
    explicit Func_void_std__vector_LinkedAccount__Wrapper(std::function<void(const std::vector<LinkedAccount>& /* result */)>&& func): _function(std::make_shared<std::function<void(const std::vector<LinkedAccount>& /* result */)>>(std::move(func))) {}
    inline void call(std::vector<LinkedAccount> result) const {
      _function->operator()(result);
    }
  private:
    std::shared_ptr<std::function<void(const std::vector<LinkedAccount>& /* result */)>> _function;
  };
  Func_void_std__vector_LinkedAccount_ create_Func_void_std__vector_LinkedAccount_(void* _Nonnull swiftClosureWrapper);
  inline Func_void_std__vector_LinkedAccount__Wrapper wrap_Func_void_std__vector_LinkedAccount_(Func_void_std__vector_LinkedAccount_ value) {
    return Func_void_std__vector_LinkedAccount__Wrapper(std::move(value));
  }
  
  // pragma MARK: std::function<void(const std::exception_ptr& /* error */)>
  /**
   * Specialized version of `std::function<void(const std::exception_ptr&)>`.
   */
  using Func_void_std__exception_ptr = std::function<void(const std::exception_ptr& /* error */)>;
  /**
   * Wrapper class for a `std::function<void(const std::exception_ptr& / * error * /)>`, this can be used from Swift.
   */
  class Func_void_std__exception_ptr_Wrapper final {
  public:
    explicit Func_void_std__exception_ptr_Wrapper(std::function<void(const std::exception_ptr& /* error */)>&& func): _function(std::make_shared<std::function<void(const std::exception_ptr& /* error */)>>(std::move(func))) {}
    inline void call(std::exception_ptr error) const {
      _function->operator()(error);
    }
  private:
    std::shared_ptr<std::function<void(const std::exception_ptr& /* error */)>> _function;
  };
  Func_void_std__exception_ptr create_Func_void_std__exception_ptr(void* _Nonnull swiftClosureWrapper);
  inline Func_void_std__exception_ptr_Wrapper wrap_Func_void_std__exception_ptr(Func_void_std__exception_ptr value) {
    return Func_void_std__exception_ptr_Wrapper(std::move(value));
  }
  
  // pragma MARK: std::shared_ptr<Promise<void>>
  /**
   * Specialized version of `std::shared_ptr<Promise<void>>`.
   */
  using std__shared_ptr_Promise_void__ = std::shared_ptr<Promise<void>>;
  inline std::shared_ptr<Promise<void>> create_std__shared_ptr_Promise_void__() {
    return Promise<void>::create();
  }
  inline PromiseHolder<void> wrap_std__shared_ptr_Promise_void__(std::shared_ptr<Promise<void>> promise) {
    return PromiseHolder<void>(std::move(promise));
  }
  
  // pragma MARK: std::function<void()>
  /**
   * Specialized version of `std::function<void()>`.
   */
  using Func_void = std::function<void()>;
  /**
   * Wrapper class for a `std::function<void()>`, this can be used from Swift.
   */
  class Func_void_Wrapper final {
  public:
    explicit Func_void_Wrapper(std::function<void()>&& func): _function(std::make_shared<std::function<void()>>(std::move(func))) {}
    inline void call() const {
      _function->operator()();
    }
  private:
    std::shared_ptr<std::function<void()>> _function;
  };
  Func_void create_Func_void(void* _Nonnull swiftClosureWrapper);
  inline Func_void_Wrapper wrap_Func_void(Func_void value) {
    return Func_void_Wrapper(std::move(value));
  }
  
  // pragma MARK: std::shared_ptr<Promise<std::string>>
  /**
   * Specialized version of `std::shared_ptr<Promise<std::string>>`.
   */
  using std__shared_ptr_Promise_std__string__ = std::shared_ptr<Promise<std::string>>;
  inline std::shared_ptr<Promise<std::string>> create_std__shared_ptr_Promise_std__string__() {
    return Promise<std::string>::create();
  }
  inline PromiseHolder<std::string> wrap_std__shared_ptr_Promise_std__string__(std::shared_ptr<Promise<std::string>> promise) {
    return PromiseHolder<std::string>(std::move(promise));
  }
  
  // pragma MARK: std::shared_ptr<margelo::nitro::rncandle::HybridRNCandleSpec>
  /**
   * Specialized version of `std::shared_ptr<margelo::nitro::rncandle::HybridRNCandleSpec>`.
   */
  using std__shared_ptr_margelo__nitro__rncandle__HybridRNCandleSpec_ = std::shared_ptr<margelo::nitro::rncandle::HybridRNCandleSpec>;
  std::shared_ptr<margelo::nitro::rncandle::HybridRNCandleSpec> create_std__shared_ptr_margelo__nitro__rncandle__HybridRNCandleSpec_(void* _Nonnull swiftUnsafePointer);
  void* _Nonnull get_std__shared_ptr_margelo__nitro__rncandle__HybridRNCandleSpec_(std__shared_ptr_margelo__nitro__rncandle__HybridRNCandleSpec_ cppType);
  
  // pragma MARK: std::weak_ptr<margelo::nitro::rncandle::HybridRNCandleSpec>
  using std__weak_ptr_margelo__nitro__rncandle__HybridRNCandleSpec_ = std::weak_ptr<margelo::nitro::rncandle::HybridRNCandleSpec>;
  inline std__weak_ptr_margelo__nitro__rncandle__HybridRNCandleSpec_ weakify_std__shared_ptr_margelo__nitro__rncandle__HybridRNCandleSpec_(const std::shared_ptr<margelo::nitro::rncandle::HybridRNCandleSpec>& strong) { return strong; }
  
  // pragma MARK: Result<void>
  using Result_void_ = Result<void>;
  inline Result_void_ create_Result_void_() {
    return Result<void>::withValue();
  }
  inline Result_void_ create_Result_void_(const std::exception_ptr& error) {
    return Result<void>::withError(error);
  }
  
  // pragma MARK: Result<std::shared_ptr<Promise<std::vector<LinkedAccount>>>>
  using Result_std__shared_ptr_Promise_std__vector_LinkedAccount____ = Result<std::shared_ptr<Promise<std::vector<LinkedAccount>>>>;
  inline Result_std__shared_ptr_Promise_std__vector_LinkedAccount____ create_Result_std__shared_ptr_Promise_std__vector_LinkedAccount____(const std::shared_ptr<Promise<std::vector<LinkedAccount>>>& value) {
    return Result<std::shared_ptr<Promise<std::vector<LinkedAccount>>>>::withValue(value);
  }
  inline Result_std__shared_ptr_Promise_std__vector_LinkedAccount____ create_Result_std__shared_ptr_Promise_std__vector_LinkedAccount____(const std::exception_ptr& error) {
    return Result<std::shared_ptr<Promise<std::vector<LinkedAccount>>>>::withError(error);
  }
  
  // pragma MARK: Result<std::shared_ptr<Promise<void>>>
  using Result_std__shared_ptr_Promise_void___ = Result<std::shared_ptr<Promise<void>>>;
  inline Result_std__shared_ptr_Promise_void___ create_Result_std__shared_ptr_Promise_void___(const std::shared_ptr<Promise<void>>& value) {
    return Result<std::shared_ptr<Promise<void>>>::withValue(value);
  }
  inline Result_std__shared_ptr_Promise_void___ create_Result_std__shared_ptr_Promise_void___(const std::exception_ptr& error) {
    return Result<std::shared_ptr<Promise<void>>>::withError(error);
  }
  
  // pragma MARK: Result<std::shared_ptr<Promise<std::string>>>
  using Result_std__shared_ptr_Promise_std__string___ = Result<std::shared_ptr<Promise<std::string>>>;
  inline Result_std__shared_ptr_Promise_std__string___ create_Result_std__shared_ptr_Promise_std__string___(const std::shared_ptr<Promise<std::string>>& value) {
    return Result<std::shared_ptr<Promise<std::string>>>::withValue(value);
  }
  inline Result_std__shared_ptr_Promise_std__string___ create_Result_std__shared_ptr_Promise_std__string___(const std::exception_ptr& error) {
    return Result<std::shared_ptr<Promise<std::string>>>::withError(error);
  }

} // namespace margelo::nitro::rncandle::bridge::swift
