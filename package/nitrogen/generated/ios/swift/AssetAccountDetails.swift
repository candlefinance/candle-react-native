///
/// AssetAccountDetails.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import NitroModules

/// Represents an instance of `AssetAccountDetails`, backed by a C++ struct.
public typealias AssetAccountDetails = margelo.nitro.rncandle.AssetAccountDetails

extension AssetAccountDetails {
  private typealias bridge = margelo.nitro.rncandle.bridge.swift

  /**
   * Create a new instance of `AssetAccountDetails`.
   */
  public init(fiatAccountDetails: FiatAccountDetails?, marketAccountDetails: MarketAccountDetails?)
  {
    self.init(
      { () -> bridge.std__optional_FiatAccountDetails_ in
        if let __unwrappedValue = fiatAccountDetails {
          return bridge.create_std__optional_FiatAccountDetails_(__unwrappedValue)
        } else {
          return .init()
        }
      }(),
      { () -> bridge.std__optional_MarketAccountDetails_ in
        if let __unwrappedValue = marketAccountDetails {
          return bridge.create_std__optional_MarketAccountDetails_(__unwrappedValue)
        } else {
          return .init()
        }
      }())
  }

  public var fiatAccountDetails: FiatAccountDetails? {
    @inline(__always)
    get {
      return { () -> FiatAccountDetails? in
        if let __unwrapped = self.__fiatAccountDetails.value {
          return __unwrapped
        } else {
          return nil
        }
      }()
    }
    @inline(__always)
    set {
      self.__fiatAccountDetails = { () -> bridge.std__optional_FiatAccountDetails_ in
        if let __unwrappedValue = newValue {
          return bridge.create_std__optional_FiatAccountDetails_(__unwrappedValue)
        } else {
          return .init()
        }
      }()
    }
  }

  public var marketAccountDetails: MarketAccountDetails? {
    @inline(__always)
    get {
      return { () -> MarketAccountDetails? in
        if let __unwrapped = self.__marketAccountDetails.value {
          return __unwrapped
        } else {
          return nil
        }
      }()
    }
    @inline(__always)
    set {
      self.__marketAccountDetails = { () -> bridge.std__optional_MarketAccountDetails_ in
        if let __unwrappedValue = newValue {
          return bridge.create_std__optional_MarketAccountDetails_(__unwrappedValue)
        } else {
          return .init()
        }
      }()
    }
  }
}
