///
/// ToolCall.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import NitroModules

/// Represents an instance of `ToolCall`, backed by a C++ struct.
public typealias ToolCall = margelo.nitro.rncandle.ToolCall

extension ToolCall {
  private typealias bridge = margelo.nitro.rncandle.bridge.swift

  /**
   * Create a new instance of `ToolCall`.
   */
  public init(name: String, arguments: String) {
    self.init(std.string(name), std.string(arguments))
  }

  public var name: String {
    @inline(__always)
    get {
      return String(self.__name)
    }
    @inline(__always)
    set {
      self.__name = std.string(newValue)
    }
  }

  public var arguments: String {
    @inline(__always)
    get {
      return String(self.__arguments)
    }
    @inline(__always)
    set {
      self.__arguments = std.string(newValue)
    }
  }
}
