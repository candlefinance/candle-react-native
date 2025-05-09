///
/// TradeAssetRef.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import NitroModules

/// Represents an instance of `TradeAssetRef`, backed by a C++ struct.
public typealias TradeAssetRef = margelo.nitro.rncandle.TradeAssetRef

extension TradeAssetRef {
  private typealias bridge = margelo.nitro.rncandle.bridge.swift

  /**
   * Create a new instance of `TradeAssetRef`.
   */
  public init(
    fiatAssetRef: FiatAssetRef?, marketTradeAssetRef: MarketTradeAssetRef?,
    transportAssetRef: TransportAssetRef?, otherAssetRef: OtherAssetRef?,
    nothingAssetRef: NothingAssetRef?
  ) {
    self.init(
      { () -> bridge.std__optional_FiatAssetRef_ in
        if let __unwrappedValue = fiatAssetRef {
          return bridge.create_std__optional_FiatAssetRef_(__unwrappedValue)
        } else {
          return .init()
        }
      }(),
      { () -> bridge.std__optional_MarketTradeAssetRef_ in
        if let __unwrappedValue = marketTradeAssetRef {
          return bridge.create_std__optional_MarketTradeAssetRef_(__unwrappedValue)
        } else {
          return .init()
        }
      }(),
      { () -> bridge.std__optional_TransportAssetRef_ in
        if let __unwrappedValue = transportAssetRef {
          return bridge.create_std__optional_TransportAssetRef_(__unwrappedValue)
        } else {
          return .init()
        }
      }(),
      { () -> bridge.std__optional_OtherAssetRef_ in
        if let __unwrappedValue = otherAssetRef {
          return bridge.create_std__optional_OtherAssetRef_(__unwrappedValue)
        } else {
          return .init()
        }
      }(),
      { () -> bridge.std__optional_NothingAssetRef_ in
        if let __unwrappedValue = nothingAssetRef {
          return bridge.create_std__optional_NothingAssetRef_(__unwrappedValue)
        } else {
          return .init()
        }
      }())
  }

  public var fiatAssetRef: FiatAssetRef? {
    @inline(__always)
    get {
      return { () -> FiatAssetRef? in
        if let __unwrapped = self.__fiatAssetRef.value {
          return __unwrapped
        } else {
          return nil
        }
      }()
    }
    @inline(__always)
    set {
      self.__fiatAssetRef = { () -> bridge.std__optional_FiatAssetRef_ in
        if let __unwrappedValue = newValue {
          return bridge.create_std__optional_FiatAssetRef_(__unwrappedValue)
        } else {
          return .init()
        }
      }()
    }
  }

  public var marketTradeAssetRef: MarketTradeAssetRef? {
    @inline(__always)
    get {
      return { () -> MarketTradeAssetRef? in
        if let __unwrapped = self.__marketTradeAssetRef.value {
          return __unwrapped
        } else {
          return nil
        }
      }()
    }
    @inline(__always)
    set {
      self.__marketTradeAssetRef = { () -> bridge.std__optional_MarketTradeAssetRef_ in
        if let __unwrappedValue = newValue {
          return bridge.create_std__optional_MarketTradeAssetRef_(__unwrappedValue)
        } else {
          return .init()
        }
      }()
    }
  }

  public var transportAssetRef: TransportAssetRef? {
    @inline(__always)
    get {
      return { () -> TransportAssetRef? in
        if let __unwrapped = self.__transportAssetRef.value {
          return __unwrapped
        } else {
          return nil
        }
      }()
    }
    @inline(__always)
    set {
      self.__transportAssetRef = { () -> bridge.std__optional_TransportAssetRef_ in
        if let __unwrappedValue = newValue {
          return bridge.create_std__optional_TransportAssetRef_(__unwrappedValue)
        } else {
          return .init()
        }
      }()
    }
  }

  public var otherAssetRef: OtherAssetRef? {
    @inline(__always)
    get {
      return { () -> OtherAssetRef? in
        if let __unwrapped = self.__otherAssetRef.value {
          return __unwrapped
        } else {
          return nil
        }
      }()
    }
    @inline(__always)
    set {
      self.__otherAssetRef = { () -> bridge.std__optional_OtherAssetRef_ in
        if let __unwrappedValue = newValue {
          return bridge.create_std__optional_OtherAssetRef_(__unwrappedValue)
        } else {
          return .init()
        }
      }()
    }
  }

  public var nothingAssetRef: NothingAssetRef? {
    @inline(__always)
    get {
      return { () -> NothingAssetRef? in
        if let __unwrapped = self.__nothingAssetRef.value {
          return __unwrapped
        } else {
          return nil
        }
      }()
    }
    @inline(__always)
    set {
      self.__nothingAssetRef = { () -> bridge.std__optional_NothingAssetRef_ in
        if let __unwrappedValue = newValue {
          return bridge.create_std__optional_NothingAssetRef_(__unwrappedValue)
        } else {
          return .init()
        }
      }()
    }
  }
}
