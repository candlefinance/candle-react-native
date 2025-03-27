///
/// HybridRNCandleSpec_cxx.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import Foundation
import NitroModules

/**
 * A class implementation that bridges HybridRNCandleSpec over to C++.
 * In C++, we cannot use Swift protocols - so we need to wrap it in a class to make it strongly defined.
 *
 * Also, some Swift types need to be bridged with special handling:
 * - Enums need to be wrapped in Structs, otherwise they cannot be accessed bi-directionally (Swift bug: https://github.com/swiftlang/swift/issues/75330)
 * - Other HybridObjects need to be wrapped/unwrapped from the Swift TCxx wrapper
 * - Throwing methods need to be wrapped with a Result<T, Error> type, as exceptions cannot be propagated to C++
 */
public class HybridRNCandleSpec_cxx {
  /**
   * The Swift <> C++ bridge's namespace (`margelo::nitro::rncandle::bridge::swift`)
   * from `ReactNativeCandle-Swift-Cxx-Bridge.hpp`.
   * This contains specialized C++ templates, and C++ helper functions that can be accessed from Swift.
   */
  public typealias bridge = margelo.nitro.rncandle.bridge.swift

  /**
   * Holds an instance of the `HybridRNCandleSpec` Swift protocol.
   */
  private var __implementation: any HybridRNCandleSpec

  /**
   * Holds a weak pointer to the C++ class that wraps the Swift class.
   */
  private var __cxxPart: bridge.std__weak_ptr_margelo__nitro__rncandle__HybridRNCandleSpec_

  /**
   * Create a new `HybridRNCandleSpec_cxx` that wraps the given `HybridRNCandleSpec`.
   * All properties and methods bridge to C++ types.
   */
  public init(_ implementation: any HybridRNCandleSpec) {
    self.__implementation = implementation
    self.__cxxPart = .init()
    /* no base class */
  }

  /**
   * Get the actual `HybridRNCandleSpec` instance this class wraps.
   */
  @inline(__always)
  public func getHybridRNCandleSpec() -> any HybridRNCandleSpec {
    return __implementation
  }

  /**
   * Casts this instance to a retained unsafe raw pointer.
   * This acquires one additional strong reference on the object!
   */
  public func toUnsafe() -> UnsafeMutableRawPointer {
    return Unmanaged.passRetained(self).toOpaque()
  }

  /**
   * Casts an unsafe pointer to a `HybridRNCandleSpec_cxx`.
   * The pointer has to be a retained opaque `Unmanaged<HybridRNCandleSpec_cxx>`.
   * This removes one strong reference from the object!
   */
  public class func fromUnsafe(_ pointer: UnsafeMutableRawPointer) -> HybridRNCandleSpec_cxx {
    return Unmanaged<HybridRNCandleSpec_cxx>.fromOpaque(pointer).takeRetainedValue()
  }

  /**
   * Gets (or creates) the C++ part of this Hybrid Object.
   * The C++ part is a `std::shared_ptr<margelo::nitro::rncandle::HybridRNCandleSpec>`.
   */
  public func getCxxPart() -> bridge.std__shared_ptr_margelo__nitro__rncandle__HybridRNCandleSpec_ {
    let cachedCxxPart = self.__cxxPart.lock()
    if cachedCxxPart.__convertToBool() {
      return cachedCxxPart
    } else {
      let newCxxPart = bridge.create_std__shared_ptr_margelo__nitro__rncandle__HybridRNCandleSpec_(self.toUnsafe())
      __cxxPart = bridge.weakify_std__shared_ptr_margelo__nitro__rncandle__HybridRNCandleSpec_(newCxxPart)
      return newCxxPart
    }
  }

  

  /**
   * Get the memory size of the Swift class (plus size of any other allocations)
   * so the JS VM can properly track it and garbage-collect the JS object if needed.
   */
  @inline(__always)
  public var memorySize: Int {
    return MemoryHelper.getSizeOf(self.__implementation) + self.__implementation.memorySize
  }

  // Properties
  

  // Methods
  @inline(__always)
  public final func candleLinkSheet(isPresented: Bool, service: Int32, cornerRadius: Double, customerName: bridge.std__optional_std__string_, showSandbox: Bool, showDynamicLoading: Bool, presentationBackground: Int32, presentationStyle: Int32, onSuccess: bridge.Func_void_std__string) -> bridge.Result_void_ {
    do {
      try self.__implementation.candleLinkSheet(isPresented: isPresented, service: margelo.nitro.rncandle.Service(rawValue: service)!, cornerRadius: cornerRadius, customerName: { () -> String? in
        if let __unwrapped = customerName.value {
          return String(__unwrapped)
        } else {
          return nil
        }
      }(), showSandbox: showSandbox, showDynamicLoading: showDynamicLoading, presentationBackground: margelo.nitro.rncandle.PresentationBackground(rawValue: presentationBackground)!, presentationStyle: margelo.nitro.rncandle.PresentationStyle(rawValue: presentationStyle)!, onSuccess: { () -> (String) -> Void in
        let __wrappedFunction = bridge.wrap_Func_void_std__string(onSuccess)
        return { (__account: String) -> Void in
          __wrappedFunction.call(std.string(__account))
        }
      }())
      return bridge.create_Result_void_()
    } catch (let __error) {
      let __exceptionPtr = __error.toCpp()
      return bridge.create_Result_void_(__exceptionPtr)
    }
  }
  
  @inline(__always)
  public final func getLinkedAccounts() -> bridge.Result_std__shared_ptr_Promise_std__string___ {
    do {
      let __result = try self.__implementation.getLinkedAccounts()
      let __resultCpp = { () -> bridge.std__shared_ptr_Promise_std__string__ in
        let __promise = bridge.create_std__shared_ptr_Promise_std__string__()
        let __promiseHolder = bridge.wrap_std__shared_ptr_Promise_std__string__(__promise)
        __result
          .then({ __result in __promiseHolder.resolve(std.string(__result)) })
          .catch({ __error in __promiseHolder.reject(__error.toCpp()) })
        return __promise
      }()
      return bridge.create_Result_std__shared_ptr_Promise_std__string___(__resultCpp)
    } catch (let __error) {
      let __exceptionPtr = __error.toCpp()
      return bridge.create_Result_std__shared_ptr_Promise_std__string___(__exceptionPtr)
    }
  }
  
  @inline(__always)
  public final func unlinkAccount(linkedAccountID: std.string) -> bridge.Result_std__shared_ptr_Promise_void___ {
    do {
      let __result = try self.__implementation.unlinkAccount(linkedAccountID: String(linkedAccountID))
      let __resultCpp = { () -> bridge.std__shared_ptr_Promise_void__ in
        let __promise = bridge.create_std__shared_ptr_Promise_void__()
        let __promiseHolder = bridge.wrap_std__shared_ptr_Promise_void__(__promise)
        __result
          .then({ __result in __promiseHolder.resolve() })
          .catch({ __error in __promiseHolder.reject(__error.toCpp()) })
        return __promise
      }()
      return bridge.create_Result_std__shared_ptr_Promise_void___(__resultCpp)
    } catch (let __error) {
      let __exceptionPtr = __error.toCpp()
      return bridge.create_Result_std__shared_ptr_Promise_void___(__exceptionPtr)
    }
  }
  
  @inline(__always)
  public final func getFiatAccounts() -> bridge.Result_std__shared_ptr_Promise_std__string___ {
    do {
      let __result = try self.__implementation.getFiatAccounts()
      let __resultCpp = { () -> bridge.std__shared_ptr_Promise_std__string__ in
        let __promise = bridge.create_std__shared_ptr_Promise_std__string__()
        let __promiseHolder = bridge.wrap_std__shared_ptr_Promise_std__string__(__promise)
        __result
          .then({ __result in __promiseHolder.resolve(std.string(__result)) })
          .catch({ __error in __promiseHolder.reject(__error.toCpp()) })
        return __promise
      }()
      return bridge.create_Result_std__shared_ptr_Promise_std__string___(__resultCpp)
    } catch (let __error) {
      let __exceptionPtr = __error.toCpp()
      return bridge.create_Result_std__shared_ptr_Promise_std__string___(__exceptionPtr)
    }
  }
  
  @inline(__always)
  public final func getActivity(span: bridge.std__optional_std__string_) -> bridge.Result_std__shared_ptr_Promise_std__string___ {
    do {
      let __result = try self.__implementation.getActivity(span: { () -> String? in
        if let __unwrapped = span.value {
          return String(__unwrapped)
        } else {
          return nil
        }
      }())
      let __resultCpp = { () -> bridge.std__shared_ptr_Promise_std__string__ in
        let __promise = bridge.create_std__shared_ptr_Promise_std__string__()
        let __promiseHolder = bridge.wrap_std__shared_ptr_Promise_std__string__(__promise)
        __result
          .then({ __result in __promiseHolder.resolve(std.string(__result)) })
          .catch({ __error in __promiseHolder.reject(__error.toCpp()) })
        return __promise
      }()
      return bridge.create_Result_std__shared_ptr_Promise_std__string___(__resultCpp)
    } catch (let __error) {
      let __exceptionPtr = __error.toCpp()
      return bridge.create_Result_std__shared_ptr_Promise_std__string___(__exceptionPtr)
    }
  }
  
  @inline(__always)
  public final func deleteUser() -> bridge.Result_std__shared_ptr_Promise_void___ {
    do {
      let __result = try self.__implementation.deleteUser()
      let __resultCpp = { () -> bridge.std__shared_ptr_Promise_void__ in
        let __promise = bridge.create_std__shared_ptr_Promise_void__()
        let __promiseHolder = bridge.wrap_std__shared_ptr_Promise_void__(__promise)
        __result
          .then({ __result in __promiseHolder.resolve() })
          .catch({ __error in __promiseHolder.reject(__error.toCpp()) })
        return __promise
      }()
      return bridge.create_Result_std__shared_ptr_Promise_void___(__resultCpp)
    } catch (let __error) {
      let __exceptionPtr = __error.toCpp()
      return bridge.create_Result_std__shared_ptr_Promise_void___(__exceptionPtr)
    }
  }
  
  @inline(__always)
  public final func getAvailableTools() -> bridge.Result_std__shared_ptr_Promise_std__string___ {
    do {
      let __result = try self.__implementation.getAvailableTools()
      let __resultCpp = { () -> bridge.std__shared_ptr_Promise_std__string__ in
        let __promise = bridge.create_std__shared_ptr_Promise_std__string__()
        let __promiseHolder = bridge.wrap_std__shared_ptr_Promise_std__string__(__promise)
        __result
          .then({ __result in __promiseHolder.resolve(std.string(__result)) })
          .catch({ __error in __promiseHolder.reject(__error.toCpp()) })
        return __promise
      }()
      return bridge.create_Result_std__shared_ptr_Promise_std__string___(__resultCpp)
    } catch (let __error) {
      let __exceptionPtr = __error.toCpp()
      return bridge.create_Result_std__shared_ptr_Promise_std__string___(__exceptionPtr)
    }
  }
  
  @inline(__always)
  public final func executeTool(tool: ToolCall) -> bridge.Result_std__shared_ptr_Promise_std__string___ {
    do {
      let __result = try self.__implementation.executeTool(tool: tool)
      let __resultCpp = { () -> bridge.std__shared_ptr_Promise_std__string__ in
        let __promise = bridge.create_std__shared_ptr_Promise_std__string__()
        let __promiseHolder = bridge.wrap_std__shared_ptr_Promise_std__string__(__promise)
        __result
          .then({ __result in __promiseHolder.resolve(std.string(__result)) })
          .catch({ __error in __promiseHolder.reject(__error.toCpp()) })
        return __promise
      }()
      return bridge.create_Result_std__shared_ptr_Promise_std__string___(__resultCpp)
    } catch (let __error) {
      let __exceptionPtr = __error.toCpp()
      return bridge.create_Result_std__shared_ptr_Promise_std__string___(__exceptionPtr)
    }
  }
}
