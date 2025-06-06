///
/// LinkedAccount.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import NitroModules

/// Represents an instance of `LinkedAccount`, backed by a C++ struct.
public typealias LinkedAccount = margelo.nitro.rncandle.LinkedAccount

extension LinkedAccount {
  private typealias bridge = margelo.nitro.rncandle.bridge.swift

  /**
   * Create a new instance of `LinkedAccount`.
   */
  public init(
    linkedAccountID: String, service: Service, serviceUserID: String, details: LinkedAccountDetails
  ) {
    self.init(std.string(linkedAccountID), service, std.string(serviceUserID), details)
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

  public var service: Service {
    @inline(__always)
    get {
      return self.__service
    }
    @inline(__always)
    set {
      self.__service = newValue
    }
  }

  public var serviceUserID: String {
    @inline(__always)
    get {
      return String(self.__serviceUserID)
    }
    @inline(__always)
    set {
      self.__serviceUserID = std.string(newValue)
    }
  }

  public var details: LinkedAccountDetails {
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
