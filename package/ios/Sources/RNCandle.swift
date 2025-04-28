import Candle
import Combine
import Foundation
import NitroModules
import SwiftUI
import UIKit

public enum RNClientError: Error {
  case badEncoding
  case badInitialization(message: String)
}

@available(iOS 17.0, *)
final class HybridRNCandle: HybridRNCandleSpec {

  private var rootVC: UIHostingController<CandleLinkSheetWrapper>?

  private var cancellables = Set<AnyCancellable>()

  var viewModel: CandleLinkViewModel {
    get throws {
      if let viewModel = rootVC?.rootView.viewModel {
        return viewModel
      }
      throw RNClientError.badInitialization(
        message: "Failed to properly initialize the client.")
    }
  }

  // MARK: - UI

  public func initialize(appUser: AppUser) throws {
    Task { @MainActor in
      let wrapperView = CandleLinkSheetWrapper(
        appUser: .init(
          appKey: appUser.appKey, appSecret: appUser.appSecret,
          appUserID: appUser.appUserID))
      let hostingVC = UIHostingController(rootView: wrapperView)
      self.rootVC = hostingVC
      guard
        let rootViewController = UIApplication.keyWindow?
          .rootViewController
      else {
        throw RNClientError.badInitialization(
          message: "Application root view was not initialized.")
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
        .compactMap(\.?.toLinkedAccount)
        .receive(on: RunLoop.main)
        .sink(receiveValue: onSuccess)
        .store(in: &cancellables)
    }
  }

  // MARK: - Public

  public func unlinkAccount(linkedAccountID: String) throws -> Promise<Void> {
    .async {
      try await self.viewModel.candleClient.unlinkAccount(
        linkedAccountID: linkedAccountID)
    }
  }

  public func getLinkedAccounts() throws -> Promise<[LinkedAccount]> {
    .async {
      let accounts = try await self.viewModel.candleClient
        .getLinkedAccounts()
      return accounts.map(\.toLinkedAccount)
    }
  }

  public func getAssetAccounts(query: AssetAccountQuery) throws -> Promise<
    [AssetAccount]
  > {
    .async {
      let accounts = try await self.viewModel.candleClient
        .getAssetAccounts(
          query: .init(
            linkedAccountIDs: query.linkedAccountIDs,
            assetKind: query.assetKind?.asCandleModel
          )
        )
      return accounts.map { model in
        let legalAccountKind = model.legalAccountKind.toRNModel
        switch model.details {
        case .FiatAccountDetails(let fiatDetails):
          let ach = fiatDetails.ach.map { details in
            ACHDetails(
              accountNumber: details.accountNumber,
              routingNumber: details.routingNumber,
              accountKind: details.accountKind.toRNModel
            )
          }

          let wire = fiatDetails.wire.map { details in
            WireDetails(
              accountNumber: details.accountNumber,
              routingNumber: details.routingNumber
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
                service: fiatDetails.service.toService),
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
                serviceAccountID: marketDetails
                  .serviceAccountID,
                linkedAccountID: marketDetails.linkedAccountID,
                service: marketDetails.service.toService
              )
            )
          )
        }
      }
    }
  }

  public func getTrades(query: TradeQuery) throws -> Promise<[Trade]> {
    .async {
      let trades = try await self.viewModel.candleClient.getTrades(
        query: .init(
          linkedAccountIDs: query.linkedAccountIDs,
          dateTimeSpan: query.dateTimeSpan,
          gainedAssetKind: .init(
            rawValue: query.gainedAssetKind ?? ""),
          lostAssetKind: .init(rawValue: query.lostAssetKind ?? ""),
          counterpartyKind: .init(
            rawValue: query.counterpartyKind ?? "")
        ))
      return trades.map { trade in
        return Trade(
          dateTime: trade.dateTime,
          state: TradeState(fromString: trade.state.rawValue)!,
          counterparty: trade.toCounterparty,
          lost: trade.lost.toAsset,
          gained: trade.gained.toAsset
        )
      }
    }
  }

  public func getTradeQuotes(request: TradeQuoteRequest) throws -> Promise<
    [TradeQuote]
  > {
    .async {
      let accounts = try await self.viewModel.candleClient.getTradeQuotes(
        request:
          .init(
            linkedAccountIDs: request.linkedAccountIDs,
            gained: try request.toGained
          )
      )
      return accounts.map { account in
        TradeQuote(
          lost: account.lost.toAsset,
          gained: account.gained.toAsset
        )
      }
    }
  }

  public func executeTrade(request: ExecuteTradeRequest) throws -> Promise<
    Trade
  > {
    .async {
      let trade = try await self.viewModel.candleClient.executeTrade(
        context: .init(
          linkedAccountID: request.linkedAccountID,
          context: request.context)
      )
      return Trade(
        dateTime: trade.dateTime,
        state: trade.state.toRNModel,
        counterparty: trade.toCounterparty,
        lost: trade.lost.toAsset,
        gained: trade.gained.toAsset
      )
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
        throw RNClientError.badInitialization(
          message: "Self was deinitialized \(#function).")
      }
      let result = try await self.viewModel.candleClient
        .getAvailableTools()
      return result.map(self.toHolder)
    }
  }

  public func executeTool(tool: ToolCall) throws -> Promise<String> {
    .async {
      let result = try await self.viewModel.candleClient.executeTool(
        tool: RNToolCall(name: tool.name, arguments: tool.arguments)
      )
      return try result.encodedToJSONString
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

  struct RNToolCall: ToolCallRequest, Codable {
    let name: String
    let arguments: String
  }

}

extension Encodable {
  var encodedToJSONString: String {
    get throws {
      let data = try JSONEncoder().encode(self)
      if let string = String(data: data, encoding: .utf8) {
        return string
      }
      throw RNClientError.badEncoding
    }
  }
}

extension Candle.Models.LinkedAccount {
  var toLinkedAccount: LinkedAccount {
    let service: Service = self.service.toService
    switch details {
    case .ActiveLinkedAccountDetails(let details):
      return LinkedAccount(
        linkedAccountID: linkedAccountID,
        service: service,
        serviceUserID: serviceUserID,
        details: .init(
          activeLinkedAccountDetails: .init(
            state: details.state.rawValue,
            accountOpened: details.accountOpened,
            username: details.username,
            emailAddress: details.emailAddress,
            legalName: details.legalName),
          inactiveLinkedAccountDetails: nil)
      )
    case .InactiveLinkedAccountDetails(let details):
      return LinkedAccount(
        linkedAccountID: linkedAccountID,
        service: service,
        serviceUserID: serviceUserID,
        details: .init(
          activeLinkedAccountDetails: nil,
          inactiveLinkedAccountDetails: .init(
            state: details.state.rawValue))
      )
    }
  }
}

extension Models.MerchantCounterparty {
  var toLocation: MerchantLocation? {
    if let location {
      return .init(
        countryCode: location.countryCode,
        countrySubdivisionCode: location.countrySubdivisionCode,
        localityName: location.localityName)
    }
    return nil
  }
}

extension Models.Trade {
  var toCounterparty: Counterparty {
    switch counterparty {
    case .MerchantCounterparty(let merchant):
      return .init(
        merchantCounterparty: .init(
          kind: merchant.kind.rawValue,
          name: merchant.name, logoURL: merchant.logoURL,
          location: merchant.toLocation
        ),
        userCounterparty: nil,
        serviceCounterparty: nil
      )
    case .ServiceCounterparty(let service):
      return .init(
        merchantCounterparty: nil,
        userCounterparty: nil,
        serviceCounterparty: .init(
          kind: service.kind.rawValue,
          service: service.service.toService
        )
      )
    case .UserCounterparty(let user):
      return .init(
        merchantCounterparty: nil,
        userCounterparty: .init(
          kind: user.kind.rawValue,
          legalName: user.legalName,
          avatarURL: user.avatarURL,
          username: user.username
        ),
        serviceCounterparty: nil
      )
    }
  }
}

extension Models.TradeAsset {
  var toAsset: TradeAsset {
    switch self {
    case .FiatAsset(let fiatAsset):
      return .init(
        fiatAsset: .init(
          assetKind: fiatAsset.assetKind.rawValue,
          serviceTradeID: fiatAsset.serviceTradeID,
          serviceAccountID: fiatAsset.serviceAccountID,
          currencyCode: fiatAsset.currencyCode,
          amount: fiatAsset.amount,
          linkedAccountID: fiatAsset.linkedAccountID,
          service: fiatAsset.service.toService
        ),
        marketTradeAsset: nil,
        transportAsset: nil,
        otherAsset: nil,
        nothingAsset: nil
      )
    case .MarketTradeAsset(let marketAsset):
      return .init(
        fiatAsset: nil,
        marketTradeAsset: .init(
          assetKind: marketAsset.assetKind.rawValue,
          serviceAccountID: marketAsset.serviceAccountID,
          serviceAssetID: marketAsset.serviceAssetID,
          symbol: marketAsset.symbol,
          amount: marketAsset.amount,
          serviceTradeID: marketAsset.serviceTradeID,
          linkedAccountID: marketAsset.linkedAccountID,
          name: marketAsset.name,
          color: marketAsset.color,
          logoURL: marketAsset.logoURL,
          service: marketAsset.service.toService
        ),
        transportAsset: nil,
        otherAsset: nil,
        nothingAsset: nil
      )
    case .TransportAsset(let transportAsset):
      return .init(
        fiatAsset: nil,
        marketTradeAsset: nil,
        transportAsset: .init(
          assetKind: transportAsset.assetKind.rawValue,
          serviceTradeID: transportAsset.serviceTradeID,
          serviceAssetID: transportAsset.serviceAssetID,
          name: transportAsset.name,
          description: transportAsset.description,
          imageURL: transportAsset.imageURL,
          originCoordinates: .init(
            latitude: transportAsset.originCoordinates.latitude,
            longitude: transportAsset.originCoordinates.longitude
          ),
          originAddress: .init(
            value: transportAsset.originAddress.value),
          destinationCoordinates: .init(
            latitude: transportAsset.destinationCoordinates
              .latitude,
            longitude: transportAsset.destinationCoordinates
              .longitude
          ),
          destinationAddress: .init(
            value: transportAsset.destinationAddress.value),
          seats: transportAsset.seats,
          linkedAccountID: transportAsset.linkedAccountID,
          service: transportAsset.service.toService
        ),
        otherAsset: nil,
        nothingAsset: nil
      )
    case .OtherAsset(let otherAsset):
      return .init(
        fiatAsset: nil,
        marketTradeAsset: nil,
        transportAsset: nil,
        otherAsset: .init(assetKind: otherAsset.assetKind.rawValue),
        nothingAsset: nil
      )
    case .NothingAsset(let nothingAsset):
      return .init(
        fiatAsset: nil,
        marketTradeAsset: nil,
        transportAsset: nil,
        otherAsset: nil,
        nothingAsset: .init(assetKind: nothingAsset.assetKind.rawValue)
      )
    }
  }
}

extension TradeQuoteRequest {
  var toGained: Models.TradeAssetQuoteRequest {
    get throws {
      if let fiatAssetQuoteRequest = gained.fiatAssetQuoteRequest {
        return Models.TradeAssetQuoteRequest.FiatAssetQuoteRequest(
          .init(
            assetKind: .fiat,
            serviceAccountID: fiatAssetQuoteRequest
              .serviceAccountID,
            currencyCode: fiatAssetQuoteRequest.currencyCode,
            amount: fiatAssetQuoteRequest.amount
          )
        )
      } else if let marketAssetQuoteRequest = gained
        .marketAssetQuoteRequest
      {
        return Models.TradeAssetQuoteRequest.MarketAssetQuoteRequest(
          .init(
            assetKind: .init(
              rawValue: marketAssetQuoteRequest.assetKind)
              ?? .stock,
            serviceAccountID: marketAssetQuoteRequest
              .serviceAccountID,
            serviceAssetID: marketAssetQuoteRequest.serviceAssetID,
            symbol: marketAssetQuoteRequest.symbol,
            amount: marketAssetQuoteRequest.amount
          )
        )
      } else if gained.nothingAssetQuoteRequest != nil {
        return Models.TradeAssetQuoteRequest.NothingAssetQuoteRequest(
          .init(assetKind: .nothing)
        )
      } else if let transportAssetQuoteRequest = gained
        .transportAssetQuoteRequest
      {
        return Models.TradeAssetQuoteRequest.TransportAssetQuoteRequest(
          .init(
            assetKind: .transport,
            serviceAssetID: transportAssetQuoteRequest
              .serviceAssetID,
            originCoordinates: transportAssetQuoteRequest
              .originCoordinates?.toCoordinates,
            originAddress: transportAssetQuoteRequest.originAddress?
              .toAddress,
            destinationCoordinates: transportAssetQuoteRequest
              .destinationCoordinates?
              .toCoordinates,
            destinationAddress: transportAssetQuoteRequest
              .destinationAddress?.toAddress,
            seats: transportAssetQuoteRequest.seats
          )
        )
      } else {
        throw RNClientError.badInitialization(
          message:
            "Internal Candle Error: corrupted trade quote request.")
      }
    }
  }
}

extension Address {
  var toAddress: Models.Address {
    return .init(value: value)
  }
}

extension Coordinates {
  var toCoordinates: Models.Coordinates {
    return .init(
      latitude: latitude,
      longitude: longitude
    )
  }
}

extension Service {
  var toService: Models.Service {
    switch self {
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

extension Models.Service {
  var toService: Service {
    switch self {
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

extension AssetAccountKind {
  var asCandleModel: Models.GetAssetAccounts.Input.Query.AssetKindPayload {
    switch self {
    case .fiat:
      return .fiat
    case .stock:
      return .stock
    case .crypto:
      return .crypto
    }
  }
}

extension Candle.Components.Schemas.LegalAccountKind {
  var toRNModel: LegalAccountKind {
    switch self {
    case .individual:
      return .individual
    case .joint:
      return .joint
    case .rothIra:
      return .rothira
    case .traditionalIra:
      return .traditionalira
    }
  }
}

extension Candle.Components.Schemas.ACHAccountKind {
  var toRNModel: ACHAccountKind {
    switch self {
    case .checking:
      return .checking
    case .savings:
      return .savings
    }
  }
}

extension Models.Trade.StatePayload {
  var toRNModel: TradeState {
    switch self {
    case .success:
      return .success
    case .failure:
      return .failure
    case .inProgress:
      return .inprogress
    }
  }
}
