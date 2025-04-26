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
        ))
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
            details: .first(
              .init(
                assetKind: fiatDetails.assetKind.rawValue,
                serviceAccountID: fiatDetails.serviceAccountID,
                currencyCode: fiatDetails.currencyCode,
                balance: fiatDetails.balance,
                ach: ach,
                wire: wire,
                linkedAccountID: fiatDetails.linkedAccountID,
                service: Service(fromString: fiatDetails.service.rawValue)!)
            )
          )
        case .MarketAccountDetails(let marketDetails):
          return AssetAccount(
            legalAccountKind: legalAccountKind,
            nickname: model.nickname,
            details: .second(
              .init(
                assetKind: marketDetails.assetKind.rawValue,
                serviceAccountID: marketDetails.serviceAccountID,
                linkedAccountID: marketDetails.linkedAccountID,
                service: Service(fromString: marketDetails.service.rawValue)!
              ))
          )
        }
      }
    }
  }

  // public func getTrades(query: TradeQuery) throws -> Promise<[Trade]> {
  //   .async {
  //     return []
  //   }
  // }

  // public func getTradeQuotes(request: TradeQuoteRequest) throws -> Promise<[TradeQuote]> {
  //   .async {
  //     return []
  //   }
  // }

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
    let service: Service = toRNService(service: account.service)
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

  func toRNService(service: Candle.Models.Service) -> Service {
    switch service {
    case .apple:
      return .apple
    case .cashApp:
      return .cashApp
    case .sandbox:
      return .sandbox
    case .robinhood:
      return .robinhood
    case .uber:
      return .uber
    case .lyft:
      return .lyft
    case .venmo:
      return .venmo
    case .chime:
      return .chime
    case .paypal:
      return .paypal
    case .coinbase:
      return .coinbase
    case .discover:
      return .discover
    case .americanExpress:
      return .americanExpress
    case .jpmorganChase:
      return .jpmorganChase
    case .bankOfAmerica:
      return .bankOfAmerica
    case .capitalOne:
      return .capitalOne
    case .citibank:
      return .citibank
    case .vanguard:
      return .vanguard
    case .wellsFargo:
      return .wellsFargo
    case .charlesSchwab:
      return .charlesSchwab
    case .kalshi:
      return .kalshi
    case .experian:
      return .experian
    case .waymo:
      return .waymo
    case .revel:
      return .revel
    case .turo:
      return .turo
    case .getaround:
      return .getaround
    case .zipcar:
      return .zipcar
    case .airbnb:
      return .airbnb
    case .americanAirlines:
      return .americanAirlines
    case .delta:
      return .delta
    case .united:
      return .united
    case .jetblue:
      return .jetblue
    case .southwest:
      return .southwest
    case .hawaiian:
      return .hawaiian
    case .hotels:
      return .hotels
    case .geico:
      return .geico
    case .progressive:
      return .progressive
    case .aaa:
      return .aaa
    case .stateFarm:
      return .stateFarm
    case .hertz:
      return .hertz
    case .avis:
      return .avis
    case .tesla:
      return .tesla
    case .doordash:
      return .doordash
    case .uberEats:
      return .uberEats
    case .grubhub:
      return .grubhub
    case .resy:
      return .resy
    case .opentable:
      return .opentable
    case .starbucks:
      return .starbucks
    case .blueBottle:
      return .blueBottle
    case .costco:
      return .costco
    case .amazon:
      return .amazon
    case .walmart:
      return .walmart
    case .wholeFoods:
      return .wholeFoods
    case .mcdonalds:
      return .mcdonalds
    case .chipotle:
      return .chipotle
    case .sweetgreen:
      return .sweetgreen
    case .snapchat:
      return .snapchat
    case .x:
      return .x
    case .facebook:
      return .facebook
    case .instagram:
      return .instagram
    case .signal:
      return .signal
    case .whatsapp:
      return .whatsapp
    case .messenger:
      return .messenger
    case .linkedin:
      return .linkedin
    case .discord:
      return .discord
    case .messages:
      return .messages
    case .telegram:
      return .telegram
    case .reddit:
      return .reddit
    case .pinterest:
      return .pinterest
    case .newYorkTimes:
      return .newYorkTimes
    case .washingtonPost:
      return .washingtonPost
    case .wallStreetJournal:
      return .wallStreetJournal
    case .cnn:
      return .cnn
    case .yahoo:
      return .yahoo
    case .fox:
      return .fox
    case .perplexity:
      return .perplexity
    case .openai:
      return .openai
    case .polymarket:
      return .polymarket
    case .espn:
      return .espn
    case .youtube:
      return .youtube
    case .netflix:
      return .netflix
    }
  }
}
