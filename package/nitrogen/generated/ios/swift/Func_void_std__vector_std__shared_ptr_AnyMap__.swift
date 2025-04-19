///
/// Func_void_std__vector_std__shared_ptr_AnyMap__.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import NitroModules

/// Wraps a Swift `(_ value: [AnyMapHolder]) -> Void` as a class.
/// This class can be used from C++, e.g. to wrap the Swift closure as a `std::function`.
public final class Func_void_std__vector_std__shared_ptr_AnyMap__ {
  public typealias bridge = margelo.nitro.rncandle.bridge.swift

  private let closure: (_ value: [AnyMapHolder]) -> Void

  public init(_ closure: @escaping (_ value: [AnyMapHolder]) -> Void) {
    self.closure = closure
  }

  @inline(__always)
  public func call(value: bridge.std__vector_std__shared_ptr_AnyMap__) {
    self.closure(value.map({ __item in AnyMapHolder(withCppPart: __item) }))
  }

  /**
   * Casts this instance to a retained unsafe raw pointer.
   * This acquires one additional strong reference on the object!
   */
  @inline(__always)
  public func toUnsafe() -> UnsafeMutableRawPointer {
    return Unmanaged.passRetained(self).toOpaque()
  }

  /**
   * Casts an unsafe pointer to a `Func_void_std__vector_std__shared_ptr_AnyMap__`.
   * The pointer has to be a retained opaque `Unmanaged<Func_void_std__vector_std__shared_ptr_AnyMap__>`.
   * This removes one strong reference from the object!
   */
  @inline(__always)
  public static func fromUnsafe(_ pointer: UnsafeMutableRawPointer)
    -> Func_void_std__vector_std__shared_ptr_AnyMap__
  {
    return Unmanaged<Func_void_std__vector_std__shared_ptr_AnyMap__>.fromOpaque(pointer)
      .takeRetainedValue()
  }
}
