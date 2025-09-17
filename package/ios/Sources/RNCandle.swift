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

@available(iOS 17.0, *) final class HybridRNCandle: HybridRNCandleSpec {

    private var rootVC: UIHostingController<CandleLinkSheetWrapper>?

    private var cancellables = Set<AnyCancellable>()

    var viewModel: CandleLinkViewModel {
        get throws {
            if let viewModel = rootVC?.rootView.viewModel { return viewModel }
            throw RNClientError.badInitialization(
                message: "Failed to properly initialize the client."
            )
        }
    }

    // MARK: - UI

    public func initialize(appKey: String, appSecret: String, accessGroup: String?) throws {
        try Client.initialize(appKey: appKey, appSecret: appSecret, accessGroup: accessGroup)
        Task { @MainActor in
            let wrapperView = CandleLinkSheetWrapper()
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
            guard let rootViewController = UIApplication.keyWindow?.rootViewController else {
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
                    if let rootVC = self.rootVC { parentVC.embed(rootVC) }
                    try self.viewModel.showSheet = isPresented
                } catch {
                    #if DEBUG
                        print("Failed to present sheet \(#function).")
                    #endif
                }
            }
            try viewModel.$isPresented.removeDuplicates().receive(on: RunLoop.main)
                .sink(receiveValue: { [weak self] isPresented in
                    if let rootVC = self?.rootVC, !isPresented { parentVC.removeEmbedded(rootVC) }
                })
                .store(in: &cancellables)
            try viewModel.$linkedAccount.removeDuplicates().compactMap(\.?.reactModel)
                .receive(on: RunLoop.main).sink(receiveValue: onSuccess).store(in: &cancellables)
        }
    }

    public func candleTradeExecutionSheet(
        tradeQuote: TradeQuote,
        presentationBackground: PresentationBackground,
        completion: @escaping (TradeExecutionResult) -> Void
    ) throws {
        Task { @MainActor in
            let wrapperView = CandleTradeExecutionSheetWrapper(
                viewModel: .init(tradeQuote: nil),
                presentationBackground: presentationBackground
            )

            let hostingVC = UIHostingController(rootView: wrapperView)
            hostingVC.view.backgroundColor = .clear
            guard let rootHostingVC = UIApplication.keyWindow?.rootViewController else {
                throw RNClientError.badInitialization(
                    message: "\(#function) \(#line): Candle client was not initialized."
                )
            }
            let parentVC = rootHostingVC.candleTopMost
            parentVC.embedOnTop(hostingVC)
            let tradeQuote = try Models.TradeQuote(reactModel: tradeQuote)
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                wrapperView.viewModel.tradeQuote = tradeQuote
            }
            wrapperView.viewModel.$tradeQuote.dropFirst().receive(on: RunLoop.main)
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

            wrapperView.viewModel.$tradeResult.receive(on: RunLoop.main)
                .sink { result in
                    switch result {
                    case .success(let trade): completion(.init(trade: trade.reactModel, error: nil))
                    case .failure(let error):
                        completion(.init(trade: nil, error: "We encountered an error: \(error)"))
                    case .none: break
                    }
                }
                .store(in: &cancellables)
        }
    }

    // MARK: - Public

    public func unlinkAccount(ref: LinkedAccountRef) throws -> Promise<Void> {
        .async { try await Client.shared.unlinkAccount(ref: .init(reactModel: ref)) }
    }

    public func getLinkedAccounts() throws -> Promise<[LinkedAccount]> {
        .async {
            let accounts = try await Client.shared.getLinkedAccounts()
            return accounts.map(\.reactModel)
        }
    }

    public func getLinkedAccount(ref: LinkedAccountRef) throws -> Promise<LinkedAccount> {
        .async {
            let account = try await Client.shared.getLinkedAccount(ref: .init(reactModel: ref))
            return account.reactModel
        }
    }

    public func getAssetAccounts(query: AssetAccountQuery) throws -> Promise<AssetAccountsResponse>
    {
        .async {
            let accounts = try await Client.shared.getAssetAccounts(query: .init(reactModel: query))
            return AssetAccountsResponse(
                linkedAccounts: accounts.linkedAccounts.map(\.reactModel),
                assetAccounts: accounts.assetAccounts.map(\.reactModel)
            )
        }
    }

    public func getAssetAccount(ref: AssetAccountRef) throws -> Promise<AssetAccount> {
        .async {
            let account = try await Client.shared.getAssetAccount(ref: .init(reactModel: ref))
            return account.reactModel
        }
    }

    public func getTrade(ref: TradeRef) throws -> Promise<Trade> {
        .async {
            let trade = try await Client.shared.getTrade(ref: .init(reactModel: ref))
            return trade.reactModel
        }
    }

    public func getTrades(query: TradeQuery) throws -> Promise<TradesResponse> {
        .async {
            let trades = try await Client.shared.getTrades(query: .init(reactModel: query))
            return TradesResponse(
                linkedAccounts: trades.linkedAccounts.map(\.reactModel),
                trades: trades.trades.map(\.reactModel)
            )
        }
    }

    public func getTradeQuotes(request: TradeQuoteRequest) throws -> Promise<TradeQuotesResponse> {
        .async {
            let accounts = try await Client.shared.getTradeQuotes(
                request: .init(reactModel: request)
            )
            return TradeQuotesResponse.init(
                linkedAccounts: accounts.linkedAccounts.map(\.reactModel),
                tradeQuotes: accounts.tradeQuotes.map(\.reactModel)
            )
        }
    }
    public func createUser(appUserID: String) throws -> Promise<Void> {
        .async { try await Client.shared.createUser(appUserID: appUserID) }
    }

    public func deleteUser() throws -> Promise<Void> {
        .async { try await Client.shared.deleteUser() }
    }
}

extension UIViewController {
    fileprivate var candleTopMost: UIViewController {
        var top = self
        while let presented = top.presentedViewController { top = presented }
        return top
    }
}
