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
        message: "Failed to properly initialize the client."
      )
    }
  }

  // MARK: - UI

  public func initialize(appUser: AppUser, accessGroup: String?) throws {
    Task { @MainActor in
      let wrapperView = CandleLinkSheetWrapper(
        appUser: .init(
          appKey: appUser.appKey,
          appSecret: appUser.appSecret,
          appUserID: appUser.appUserID
        ),
        accessGroup: accessGroup
      )
      let hostingVC = UIHostingController(rootView: wrapperView)
      self.rootVC = hostingVC
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
      guard
        let rootViewController = UIApplication.keyWindow?
          .rootViewController
      else {
        throw RNClientError.badInitialization(
          message: "Application root view was not initialized."
        )
      }

      let parentVC = rootViewController.candleTopMost
      DispatchQueue.main.async { [weak self] in
        guard let self else {
          #if DEBUG
            print("Self was deinitialized \(#function).")
          #endif
          return
        }

        do {
          if let rootVC = self.rootVC {
            parentVC.embed(rootVC)
          }
          try self.viewModel.showSheet = isPresented
        } catch {
          #if DEBUG
            print("Failed to present sheet \(#function).")
          #endif
        }
      }
      try viewModel.$isPresented
        .removeDuplicates()
        .receive(on: RunLoop.main)
        .sink(receiveValue: { [weak self] isPresented in
          if let rootVC = self?.rootVC, !isPresented {
            parentVC.removeEmbedded(rootVC)
          }
        })
        .store(in: &cancellables)
      try viewModel.$linkedAccount
        .removeDuplicates()
        .compactMap(\.?.toLinkedAccount)
        .receive(on: RunLoop.main)
        .sink(receiveValue: onSuccess)
        .store(in: &cancellables)
    }
  }

  public func candleTradeExecutionSheet(
    tradeQuote: TradeQuote,
    presentationBackground: PresentationBackground,
    completion: @escaping (TradeExecutionResult) -> Void
  ) throws {
    Task { @MainActor in
      let wrapperView = CandleTradeExecutionSheetWrapper(
        candleClient: try viewModel.candleClient,
        viewModel: .init(tradeQuote: nil),
        presentationBackground: presentationBackground
      )

      let hostingVC = UIHostingController(rootView: wrapperView)
      hostingVC.view.backgroundColor = .clear
      guard
        let rootHostingVC = UIApplication.keyWindow?
          .rootViewController
      else {
        throw RNClientError.badInitialization(
          message:
            "\(#function) \(#line): Candle client was not initialized."
        )
      }
      let parentVC = rootHostingVC.candleTopMost
      parentVC.embedOnTop(hostingVC)
      let tradeQuote = try tradeQuote.toCandleModel
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
        wrapperView.viewModel.tradeQuote = tradeQuote
      }
      wrapperView.viewModel.$tradeQuote
        .dropFirst()
        .receive(on: RunLoop.main)
        .sink { [weak hostingVC] trade in
          if trade == nil {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
              hostingVC?.willMove(toParent: nil)
              hostingVC?.view.removeFromSuperview()
              hostingVC?.removeFromParent()
            }
          }
        }
        .store(in: &cancellables)

      wrapperView.viewModel.$tradeResult
        .receive(on: RunLoop.main)
        .sink { result in
          switch result {
          case .success(let trade):
            completion(
              .init(
                trade: trade.toRNModel,
                error: nil
              )
            )
          case .failure(let error):
            completion(
              .init(
                trade: nil,
                error: "We encountered an error: \(error)"
              )
            )
          case .none:
            break
          }
        }
        .store(in: &cancellables)
    }
  }

  // MARK: - Public

  public func unlinkAccount(ref: LinkedAccountRef) throws -> Promise<Void> {
    .async {
      try await self.viewModel.candleClient.unlinkAccount(
        path: .init(linkedAccountID: ref.linkedAccountID)
      )
    }
  }

  public func getLinkedAccounts() throws -> Promise<[LinkedAccount]> {
    .async {
      let accounts = try await self.viewModel.candleClient
        .getLinkedAccounts()
      return accounts.map(\.toLinkedAccount)
    }
  }

  public func getLinkedAccount(ref: LinkedAccountRef) throws -> Promise<
    LinkedAccount
  > {
    .async {
      let account = try await self.viewModel.candleClient
        .getLinkedAccount(
          ref: .init(linkedAccountID: ref.linkedAccountID)
        )
      return account.toLinkedAccount
    }
  }

  public func getAssetAccounts(query: AssetAccountQuery) throws -> Promise<
    AssetAccountsResponse
  > {
    .async {
      let accounts = try await self.viewModel.candleClient
        .getAssetAccounts(
          query: .init(
            linkedAccountIDs: query.linkedAccountIDs,
            assetKind: query.assetKind?.asCandleModel
          )
        )
      return AssetAccountsResponse(
        linkedAccounts: accounts.linkedAccounts.map(\.toRNModel),
        assetAccounts: accounts.assetAccounts.map(\.toRNModel)
      )
    }
  }

  public func getAssetAccount(ref: AssetAccountRef) throws -> Promise<
    AssetAccount
  > {
    .async {
      let account = try await self.viewModel.candleClient.getAssetAccount(
        ref: .init(
          linkedAccountID: ref.linkedAccountID,
          assetKind: .init(rawValue: ref.assetKind)!,
          serviceAccountID: ref.serviceAccountID
        )
      )
      return account.toRNModel
    }
  }

  public func getTrade(ref: TradeRef) throws -> Promise<Trade> {
    .async {
      let trade = try await self.viewModel.candleClient.getTrade(
        ref: .init(
          lost: try ref.lost.toRNModelAssetRef,
          gained: try ref.gained.toRNModelAssetRef
        )
      )
      return trade.toRNModel
    }
  }

  public func getTrades(query: TradeQuery) throws -> Promise<TradesResponse> {
    .async {
      let trades = try await self.viewModel.candleClient.getTrades(
        query: .init(
          linkedAccountIDs: query.linkedAccountIDs,
          dateTimeSpan: query.dateTimeSpan,
          gainedAssetKind: query.toGainedAssetKind,
          lostAssetKind: query.toLostAssetKind,
          counterpartyKind: query.toCounterpartyKindPayload
        )
      )
      return TradesResponse(
        linkedAccounts:
          trades.linkedAccounts.map(\.toRNModel),
        trades: trades.trades.map(\.toRNModel)
      )
    }
  }

  public func getTradeQuotes(request: TradeQuoteRequest) throws -> Promise<
    TradeQuotesResponse
  > {
    .async {
      let accounts = try await self.viewModel.candleClient.getTradeQuotes(
        request:
          .init(
            linkedAccountIDs: request.linkedAccountIDs,
            gained: try request.gained.toRNModel,
            lost: try request.lost.toRNModel
          )
      )
      return TradeQuotesResponse.init(
        linkedAccounts: accounts.linkedAccounts.map(\.toRNModel),
        tradeQuotes:
          accounts.tradeQuotes.map { account in
            TradeQuote(
              lost: account.lost.toRNModel,
              gained: account.gained.toRNModel,
              context: account.context,
              expirationDateTime: account.expirationDateTime
            )
          }
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
          message: "Self was deinitialized \(#function)."
        )
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
    let service: Service = self.service.toRNModel
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
            legalName: details.legalName
          ),
          inactiveLinkedAccountDetails: nil,
          unavailableLinkedAccountDetails: nil
        )
      )
    case .InactiveLinkedAccountDetails(let details):
      switch details.state {
      case .inactive:
        return LinkedAccount(
          linkedAccountID: linkedAccountID,
          service: service,
          serviceUserID: serviceUserID,
          details: .init(
            activeLinkedAccountDetails: nil,
            inactiveLinkedAccountDetails: .init(
              state: details.state.rawValue
            ),
            unavailableLinkedAccountDetails: nil
          )
        )
      case .unavailable:
        return LinkedAccount(
          linkedAccountID: linkedAccountID,
          service: service,
          serviceUserID: serviceUserID,
          details: .init(
            activeLinkedAccountDetails: nil,
            inactiveLinkedAccountDetails: nil,
            unavailableLinkedAccountDetails: .init(
              state: details.state.rawValue
            )
          )
        )
      }
    }
  }
}

extension Models.MerchantCounterparty {
  var toLocation: MerchantLocation? {
    if let location {
      return .init(
        countryCode: location.countryCode,
        countrySubdivisionCode: location.countrySubdivisionCode,
        localityName: location.localityName
      )
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
          name: merchant.name,
          logoURL: merchant.logoURL,
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
          service: service.service.toRNModel
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
  var toRNModel: TradeAsset {
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
          service: fiatAsset.service.toRNModel
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
          service: marketAsset.service.toRNModel
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
          serviceAccountID: transportAsset.serviceAccountID,
          name: transportAsset.name,
          description: transportAsset.description,
          imageURL: transportAsset.imageURL,
          originCoordinates: .init(
            latitude: transportAsset.originCoordinates.latitude,
            longitude: transportAsset.originCoordinates.longitude
          ),
          originAddress: .init(
            value: transportAsset.originAddress.value
          ),
          destinationCoordinates: .init(
            latitude: transportAsset.destinationCoordinates
              .latitude,
            longitude: transportAsset.destinationCoordinates
              .longitude
          ),
          destinationAddress: .init(
            value: transportAsset.destinationAddress.value
          ),
          seats: transportAsset.seats,
          departureDateTime: transportAsset.departureDateTime,
          arrivalDateTime: transportAsset.arrivalDateTime,
          linkedAccountID: transportAsset.linkedAccountID,
          service: transportAsset.service.toRNModel
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

extension Models.Trade {
  var toRNModel: Trade {
    .init(
      dateTime: dateTime,
      state: state.toRNModel,
      counterparty: toCounterparty,
      lost: lost.toRNModel,
      gained: gained.toRNModel
    )
  }
}

extension TradeAssetQuoteRequest {
  var toRNModel: Models.TradeAssetQuoteRequest {
    get throws {
      if let fiatAssetQuoteRequest {
        return Models.TradeAssetQuoteRequest.FiatAssetQuoteRequest(
          .init(
            assetKind: .fiat,
            serviceAccountID: fiatAssetQuoteRequest
              .serviceAccountID,
            currencyCode: fiatAssetQuoteRequest.currencyCode,
            amount: fiatAssetQuoteRequest.amount
          )
        )
      } else if let marketAssetQuoteRequest {
        guard
          let assetKind = Models.MarketAssetQuoteRequest
            .AssetKindPayload(
              rawValue: marketAssetQuoteRequest.assetKind
            )
        else {
          throw RNClientError.badEncoding
        }
        return Models.TradeAssetQuoteRequest.MarketAssetQuoteRequest(
          .init(
            assetKind: assetKind,
            serviceAccountID: marketAssetQuoteRequest
              .serviceAccountID,
            serviceAssetID: marketAssetQuoteRequest.serviceAssetID,
            symbol: marketAssetQuoteRequest.symbol,
            amount: marketAssetQuoteRequest.amount
          )
        )
      } else if nothingAssetQuoteRequest != nil {
        return Models.TradeAssetQuoteRequest.NothingAssetQuoteRequest(
          .init(assetKind: .nothing)
        )
      } else if let transportAssetQuoteRequest {
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
            seats: transportAssetQuoteRequest.seats,
            serviceAccountID: transportAssetQuoteRequest.serviceAccountID
          )
        )
      } else {
        throw RNClientError.badInitialization(
          message:
            "Internal Candle Error: corrupted trade quote request."
        )
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
  var toRNModel: Models.Service {
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
  var toRNModel: Service {
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
    case .transport:
      return .transport
    }
  }
}

extension Candle.Components.Schemas.FiatMarketAccountKind {
  var toRNModel: FiatMarketAccountKind {
    switch self {
    case .individual:
      return .individual
    case .joint:
      return .joint
    case .rothIra:
      return .rothira
    case .traditionalIra:
      return .traditionalira
    case .business:
      return .business
    }
  }
}

extension Candle.Components.Schemas.TransportAccountKind {
  var toRNModel: TransportAccountKind {
    switch self {
    case .individual:
      return .individual
    case .joint:
      return .joint
    case .business:
      return .business
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

extension TradeQuery {

  var toGainedAssetKind:
    Candle.Operations.GetLinkedAccountsTrades.Input.Query
      .GainedAssetKindPayload?
  {
    if let gainedAssetKind {
      return .init(rawValue: gainedAssetKind)
    }
    return nil
  }

  var toLostAssetKind:
    Candle.Operations.GetLinkedAccountsTrades.Input.Query
      .LostAssetKindPayload?
  {
    if let lostAssetKind {
      return .init(rawValue: lostAssetKind)
    }
    return nil
  }

  var toCounterpartyKindPayload:
    Candle.Operations.GetLinkedAccountsTrades.Input.Query
      .CounterpartyKindPayload?
  {
    if let counterpartyKind {
      return .init(rawValue: counterpartyKind)
    }
    return nil
  }
}

extension Models.AssetAccount {
  var toRNModel: AssetAccount {
    switch self {
    case .FiatAccount(let fiatDetails):
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
        fiatAccount: .init(
          assetKind: fiatDetails.assetKind.rawValue,
          serviceAccountID: fiatDetails.serviceAccountID,
          accountKind: fiatDetails.accountKind.toRNModel,
          nickname: nickname,
          currencyCode: fiatDetails.currencyCode,
          balance: fiatDetails.balance,
          ach: ach,
          wire: wire,
          linkedAccountID: fiatDetails.linkedAccountID,
          service: fiatDetails.service.toRNModel
        ),
        marketAccount: nil,
        transportAccount: nil
      )
    case .MarketAccount(let marketDetails):
      return AssetAccount(
        fiatAccount: nil,
        marketAccount: .init(
          assetKind: marketDetails.assetKind.rawValue,
          serviceAccountID: marketDetails.serviceAccountID,
          accountKind: marketDetails.accountKind.toRNModel,
          nickname: nickname,
          linkedAccountID: marketDetails.linkedAccountID,
          service: marketDetails.service.toRNModel
        ),
        transportAccount: nil
      )
    case .TransportAccount(let transportDetails):
      return AssetAccount(
        fiatAccount: nil,
        marketAccount: nil,
        transportAccount: .init(
          assetKind: transportDetails.assetKind.rawValue,
          serviceAccountID: transportDetails.serviceAccountID,
          accountKind: transportDetails.accountKind.toRNModel,
          nickname: nickname,
          linkedAccountID: transportDetails.linkedAccountID,
          service: transportDetails.service.toRNModel
        )
      )
    }
  }
}

extension TradeAssetRef {
  var toRNModelAssetRef: Models.TradeAssetRef {
    get throws {
      if let fiatAssetRef {
        return .FiatAssetRef(
          .init(
            assetKind: .fiat,
            serviceTradeID: fiatAssetRef.serviceTradeID,
            linkedAccountID: fiatAssetRef.linkedAccountID
          )
        )
      } else if let nothingAssetRef {
        return .NothingAsset(.init(assetKind: .nothing))
      } else if let marketTradeAssetRef {
        guard
          let assetKind = Models.MarketAssetRef.AssetKindPayload.init(
            rawValue: marketTradeAssetRef.assetKind
          )
        else {
          throw RNClientError.badEncoding
        }
        return .MarketAssetRef(
          .init(
            assetKind: assetKind,
            serviceTradeID: marketTradeAssetRef.serviceTradeID,
            linkedAccountID: marketTradeAssetRef.linkedAccountID
          )
        )
      } else if let otherAssetRef {
        return .OtherAsset(
          .init(assetKind: .other)
        )
      } else if let transportAssetRef {
        return .TransportAssetRef(
          .init(
            assetKind: .transport,
            serviceTradeID: transportAssetRef.serviceTradeID,
            linkedAccountID: transportAssetRef.linkedAccountID
          )
        )
      } else {
        throw RNClientError.badEncoding
      }
    }
  }
}

extension TradeAsset {
  var toCandleModel: Models.TradeAsset {
    get throws {
      if let fiat = fiatAsset {
        return .FiatAsset(
          .init(
            assetKind: .fiat,
            serviceTradeID: fiat.serviceTradeID,
            serviceAccountID: fiat.serviceAccountID,
            currencyCode: fiat.currencyCode,
            amount: fiat.amount,
            linkedAccountID: fiat.linkedAccountID,
            service: fiat.service.toRNModel
          )
        )
      } else if let market = marketTradeAsset {
        guard
          let assetKind = Models.MarketTradeAsset.AssetKindPayload(
            rawValue: market.assetKind
          )
        else {
          throw RNClientError.badEncoding
        }
        return .MarketTradeAsset(
          .init(
            assetKind: assetKind,
            serviceAccountID: market.serviceAccountID,
            serviceAssetID: market.serviceAssetID,
            symbol: market.symbol,
            amount: market.amount,
            serviceTradeID: market.serviceTradeID,
            linkedAccountID: market.linkedAccountID,
            service: market.service.toRNModel,
            name: market.name,
            color: market.color,
            logoURL: market.logoURL
          )
        )
      } else if let transport = transportAsset {
        return .TransportAsset(
          .init(
            assetKind: .transport,
            serviceTradeID: transport.serviceTradeID,
            serviceAssetID: transport.serviceAssetID,
            serviceAccountID: transport.serviceAccountID,
            name: transport.name,
            description: transport.description,
            imageURL: transport.imageURL,
            originCoordinates: .init(
              latitude: transport.originCoordinates.latitude,
              longitude: transport.originCoordinates.longitude
            ),
            originAddress: .init(
              value: transport.originAddress.value
            ),
            destinationCoordinates: .init(
              latitude: transport.destinationCoordinates.latitude,
              longitude: transport.destinationCoordinates
                .longitude
            ),
            destinationAddress: .init(
              value: transport.destinationAddress.value
            ),
            seats: transport.seats,
            departureDateTime: transport.departureDateTime,
            arrivalDateTime: transport.arrivalDateTime,
            linkedAccountID: transport.linkedAccountID,
            service: transport.service.toRNModel
          )
        )
      } else if otherAsset != nil {
        return .OtherAsset(.init(assetKind: .other))
      } else {
        return .NothingAsset(.init(assetKind: .nothing))
      }
    }
  }
}

extension TradeQuote {
  var toCandleModel: Models.TradeQuote {
    get throws {
      .init(
        lost: try lost.toCandleModel,
        gained: try gained.toCandleModel,
        context: context,
        expirationDateTime: expirationDateTime
      )
    }
  }
}

extension Components.Schemas.LinkedAccountStatusRef.StatePayload {
  var toRNModel: StatePayload {
    switch self {
    case .active: return .active
    case .inactive: return .inactive
    case .unavailable: return .unavailable
    }
  }
}

extension Models.LinkedAccountStatusRef {
  var toRNModel: LinkedAccountStatusRef {
    .init(
      linkedAccountID: linkedAccountID,
      service: service.toRNModel,
      serviceUserID: serviceUserID,
      state: state.toRNModel
    )
  }
}

extension UIViewController {
  fileprivate var candleTopMost: UIViewController {
    var top = self
    while let presented = top.presentedViewController {
      top = presented
    }
    return top
  }
}
