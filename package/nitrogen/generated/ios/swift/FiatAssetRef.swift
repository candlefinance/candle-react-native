///
/// FiatAssetRef.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import NitroModules

/// Represents an instance of `FiatAssetRef`, backed by a C++ struct.
public typealias FiatAssetRef = margelo.nitro.rncandle.FiatAssetRef

extension FiatAssetRef {
  private typealias bridge = margelo.nitro.rncandle.bridge.swift

  /**
   * Create a new instance of `FiatAssetRef`.
   */
  public init(assetKind: String, serviceTradeID: String?, linkedAccountID: String) {
    self.init(
      std.string(assetKind),
      { () -> bridge.std__optional_std__string_ in
        if let __unwrappedValue = serviceTradeID {
          return bridge.create_std__optional_std__string_(std.string(__unwrappedValue))
        } else {
          return .init()
        }
      }(), std.string(linkedAccountID))
  }

  public var assetKind: String {
    @inline(__always)
    get {
      return String(self.__assetKind)
    }
    @inline(__always)
    set {
      self.__assetKind = std.string(newValue)
    }
  }

  public var serviceTradeID: String? {
    @inline(__always)
    get {
      return { () -> String? in
        if let __unwrapped = self.__serviceTradeID.value {
          return String(__unwrapped)
        } else {
          return nil
        }
      }()
    }
    @inline(__always)
    set {
      self.__serviceTradeID = { () -> bridge.std__optional_std__string_ in
        if let __unwrappedValue = newValue {
          return bridge.create_std__optional_std__string_(std.string(__unwrappedValue))
        } else {
          return .init()
        }
      }()
    }
  }

  public var linkedAccountID: String {
    @inline(__always)
    get {
      return String(self.__linkedAccountID)
    }
    @inline(__always)
    set {
      self.__linkedAccountID = std.string(newValue)
    }
  }
}
