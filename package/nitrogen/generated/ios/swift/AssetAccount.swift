///
/// AssetAccount.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import NitroModules

/// Represents an instance of `AssetAccount`, backed by a C++ struct.
public typealias AssetAccount = margelo.nitro.rncandle.AssetAccount

extension AssetAccount {
  private typealias bridge = margelo.nitro.rncandle.bridge.swift

  /**
   * Create a new instance of `AssetAccount`.
   */
  public init(legalAccountKind: LegalAccountKind, nickname: String, details: AssetAccountDetails) {
    self.init(legalAccountKind, std.string(nickname), details)
  }

  public var legalAccountKind: LegalAccountKind {
    @inline(__always)
    get {
      return self.__legalAccountKind
    }
    @inline(__always)
    set {
      self.__legalAccountKind = newValue
    }
  }

  public var nickname: String {
    @inline(__always)
    get {
      return String(self.__nickname)
    }
    @inline(__always)
    set {
      self.__nickname = std.string(newValue)
    }
  }

  public var details: AssetAccountDetails {
    @inline(__always)
    get {
      return self.__details
    }
    @inline(__always)
    set {
      self.__details = newValue
    }
  }
}
