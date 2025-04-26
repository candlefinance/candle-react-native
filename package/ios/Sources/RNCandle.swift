import Candle
import Combine
import Foundation
import NitroModules
import SwiftUI
import UIKit

@available(iOS 17.0, *)
final class HybridRNCandle: HybridRNCandleSpec {

  private var rootVC: UIHostingController<CandleLinkSheetWrapper>?

  private var cancellables = Set<AnyCancellable>()

  var viewModel: CandleLinkViewModel {
    get throws {
      if let viewModel = rootVC?.rootView.viewModel {
        return viewModel
      }
      throw RNClientError.badInitialization(message: "Failed to properly initialize the client.")
    }
  }

  // MARK: - UI

  public func initialize(appUser: AppUser) throws {
    Task { @MainActor in
      let wrapperView = CandleLinkSheetWrapper(
        appUser: .init(
          appKey: appUser.appKey, appSecret: appUser.appSecret, appUserID: appUser.appUserID))
      let hostingVC = UIHostingController(rootView: wrapperView)
      self.rootVC = hostingVC
      guard let rootViewController = UIApplication.keyWindow?.rootViewController else {
        throw RNClientError.badInitialization(message: "Application root view was not initialized.")
      }
      rootViewController.embed(hostingVC)
    }
  }

  public func candleLinkSheet(
    isPresented: Bool,
    services: [Service]?,
    cornerRadius: Double,
    customerName: String?,
    showDynamicLoading: Bool,
    presentationBackground: PresentationBackground,
    presentationStyle: PresentationStyle,
    onSuccess: @escaping (LinkedAccount) -> Void
  ) throws {
    Task { @MainActor in
      try viewModel.isPresented = isPresented
      try viewModel.services = services
      try viewModel.cornerRadius = cornerRadius
      try viewModel.customerName = customerName
      try viewModel.showDynamicLoading = showDynamicLoading
      try viewModel.presentationBackground = presentationBackground
      try viewModel.presentationStyle = presentationStyle
      // FIXME: there's a glitch the first time it's presented unless you do this
      DispatchQueue.main.async { [weak self] in
        guard let self else {
          #if DEBUG
            print("Self was deinitialized \(#function).")
          #endif
          return
        }
        do {
          try self.viewModel.showSheet = isPresented
        } catch {
          #if DEBUG
            print("Failed to present sheet \(#function).")
          #endif
        }
      }
      try viewModel.$linkedAccount
        .removeDuplicates()
        .compactMap { $0 }
        .receive(on: RunLoop.main)
        .sink { [weak self] linkedAccount in
          guard let self else { return }
          onSuccess(self.toLinkedAccount(linkedAccount))
        }
        .store(in: &cancellables)
    }
  }

  // MARK: - Public

  public func unlinkAccount(linkedAccountID: String) throws -> Promise<Void> {
    Promise.async {
      try await self.viewModel.candleClient.unlinkAccount(linkedAccountID: linkedAccountID)
    }
  }

  public func getLinkedAccounts() throws -> Promise<[LinkedAccount]> {
    Promise.async { [weak self] in
      guard let self else {
        throw RNClientError.badInitialization(message: "Self was deinitialized \(#function).")
      }
      let accounts = try await self.viewModel.candleClient.getLinkedAccounts()
      return accounts.map(self.toLinkedAccount)
    }
  }

  public func getAssetAccounts(query: AssetAccountQuery) throws -> Promise<[AssetAccount]> {
    .async {
      let accounts = try await self.viewModel.candleClient.getAssetAccounts(
        query: .init(
          linkedAccountIDs: query.linkedAccountIDs,
          assetKind: query.assetKind?.stringValue == nil
            ? nil : .init(rawValue: query.assetKind!.stringValue)
        )
      )
      return accounts.map { model in
        let legalAccountKind = LegalAccountKind(fromString: model.legalAccountKind.rawValue)!
        switch model.details {
        case .FiatAccountDetails(let fiatDetails):
          var ach: ACHDetails?
          if let achDetails = fiatDetails.ach {
            ach = ACHDetails(
              accountNumber: achDetails.accountNumber,
              routingNumber: achDetails.routingNumber,
              accountKind: .init(fromString: achDetails.accountKind.rawValue)!
            )
          }
          var wire: WireDetails?
          if let wireDetails = fiatDetails.wire {
            wire = .init(
              accountNumber: wireDetails.accountNumber,
              routingNumber: wireDetails.routingNumber
            )
          }
          return AssetAccount(
            legalAccountKind: legalAccountKind,
            nickname: model.nickname,
            details: .init(
                fiatAccountDetails: .init(
                assetKind: fiatDetails.assetKind.rawValue,
                serviceAccountID: fiatDetails.serviceAccountID,
                currencyCode: fiatDetails.currencyCode,
                balance: fiatDetails.balance,
                ach: ach,
                wire: wire,
                linkedAccountID: fiatDetails.linkedAccountID,
                service: Service(fromString: fiatDetails.service.rawValue)!),
                marketAccountDetails: nil
            )
          )
        case .MarketAccountDetails(let marketDetails):
          return AssetAccount(
            legalAccountKind: legalAccountKind,
            nickname: model.nickname,
            details: .init(
                fiatAccountDetails: nil,
                marketAccountDetails: .init(
                    assetKind: marketDetails.assetKind.rawValue,
                    serviceAccountID: marketDetails.serviceAccountID,
                    linkedAccountID: marketDetails.linkedAccountID,
                    service: Service(fromString: marketDetails.service.rawValue)!
                )
            )
          )
        }
      }
    }
  }

  public func getTrades(query: TradeQuery) throws -> Promise<[Trade]> {
    .async {
      return []
    }
  }

  public func getTradeQuotes(request: TradeQuoteRequest) throws -> Promise<[TradeQuote]> {
    .async {
      return []
    }
  }

  public func deleteUser() throws -> Promise<Void> {
    .async {
      try await self.viewModel.candleClient.deleteUser()
    }
  }

  public func getAvailableTools() throws -> Promise<[AnyMapHolder]> {
    .async { [weak self] in
      guard let self else {
        throw RNClientError.badInitialization(message: "Self was deinitialized \(#function).")
      }
      let result = try await self.viewModel.candleClient.getAvailableTools()
      return result.map(self.toHolder)
    }
  }

  public func executeTool(tool: ToolCall) throws -> Promise<String> {
    .async {
      let result = try await self.viewModel.candleClient.executeTool(
        tool: RNToolCall(name: tool.name, arguments: tool.arguments)
      )
      return try self.encodeToJSONString(result)
    }
  }

  // MARK: - Private

  private func toHolder(_ dict: [String: Any]) -> AnyMapHolder {
    let holder = AnyMapHolder()
    for (key, rawValue) in dict {
      let anyValue = self.toValue(rawValue)
      switch anyValue {
      case .string(let s):
        holder.setString(key: key, value: s)
      case .number(let d):
        holder.setDouble(key: key, value: d)
      case .bigint(let i):
        holder.setBigInt(key: key, value: i)
      case .bool(let b):
        holder.setBoolean(key: key, value: b)
      case .array(let arr):
        holder.setArray(key: key, value: arr)
      case .object(let obj):
        holder.setObject(key: key, value: obj)
      case .null:
        holder.setNull(key: key)
      }
    }
    return holder
  }

  private func toValue(_ value: Any) -> AnyValue {
    switch value {
    case let int as Int:
      return .bigint(Int64(int))
    case let int as Int64:
      return .bigint(int)
    case let double as Double:
      return .number(double)
    case let bool as Bool:
      return .bool(bool)
    case let str as String:
      return .string(str)
    case let array as [Any]:
      return .array(array.map(toValue(_:)))
    case let object as [String: Any]:
      let mapped = object.mapValues { toValue($0) }
      return .object(mapped)
    default:
      return .null
    }
  }

  enum RNClientError: Error {
    case badEncoding
    case badInitialization(message: String)
  }

  struct RNToolCall: ToolCallRequest, Codable {
    let name: String
    let arguments: String
  }

  private func encodeToJSONString<T: Encodable>(_ value: T) throws -> String {
    let data = try JSONEncoder().encode(value)
    if let string = String(data: data, encoding: .utf8) {
      return string
    }
    throw RNClientError.badEncoding
  }

  private func toLinkedAccount(_ account: Candle.Models.LinkedAccount) -> LinkedAccount {
    let service: Service = Service(fromString: account.service.rawValue)!
    switch account.details {
    case .ActiveLinkedAccountDetails(let details):
      return LinkedAccount(
        serviceUserID: account.serviceUserID,
        details: .init(
          state: .active,
          username: details.username,
          legalName: details.legalName,
          accountOpened: details.accountOpened
        ),
        linkedAccountID: account.linkedAccountID,
        service: service
      )
    case .InactiveLinkedAccountDetails:
      return LinkedAccount(
        serviceUserID: account.serviceUserID,
        details: nil,
        linkedAccountID: account.linkedAccountID,
        service: service
      )
    }
  }

}
