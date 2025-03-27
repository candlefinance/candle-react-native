import Candle
import Combine
import Foundation
import NitroModules
import SwiftUI
import UIKit

@available(iOS 17.0, *)
final class HybridRNCandle: HybridRNCandleSpec {

  private let viewModel = CandleLinkViewModel()
  private var rootVC: UIViewController?
  private var cancellables = Set<AnyCancellable>()

  override init() {
    super.init()
    Task { @MainActor in
      setup()
    }
  }

  // MARK: - UI

  public func candleLinkSheet(
    isPresented: Bool,
    service: Service,
    cornerRadius: Double,
    customerName: String?,
    showSandbox: Bool,
    showDynamicLoading: Bool,
    presentationBackground: PresentationBackground,
    presentationStyle: PresentationStyle,
    onSuccess: @escaping (String) -> Void
  ) throws {
    Task { @MainActor in
      viewModel.isPresented = isPresented
      viewModel.service = service
      viewModel.cornerRadius = cornerRadius
      viewModel.customerName = customerName
      viewModel.showSandbox = showSandbox
      viewModel.showDynamicLoading = showDynamicLoading
      viewModel.presentationBackground = presentationBackground
      viewModel.presentationStyle = presentationStyle
      viewModel.showSheet = isPresented
      viewModel.$linkedAccount
        .receive(on: RunLoop.main)
        .sink { [weak self] linkedAccount in
          guard let account = try? self?.encodeToJSONString(linkedAccount) else {
            return
          }
          onSuccess(account)
        }
        .store(in: &cancellables)
    }
  }

  // MARK: - Public

  public func unlinkAccount(linkedAccountID: String) throws -> Promise<Void> {
    Promise.async {
      try await self.viewModel.candleClient?.unlinkAccount(linkedAccountID: linkedAccountID)
    }
  }

  public func getLinkedAccounts() throws -> NitroModules.Promise<String> {
    Promise.async {
      let accounts = try await self.viewModel.candleClient?.getLinkedAccounts() ?? []
      return try self.encodeToJSONString(accounts)
    }
  }

  public func getFiatAccounts() throws -> NitroModules.Promise<String> {
    .async {
      let accounts = try await self.viewModel.candleClient?.getFiatAccounts() ?? []
      return try self.encodeToJSONString(accounts)
    }
  }

  public func getActivity(span: String?) throws -> NitroModules.Promise<String> {
    .async {
      let activity =
        try await self.viewModel.candleClient?.getActivity(query: .init(span: span)) ?? []
      return try self.encodeToJSONString(activity)
    }
  }

  public func deleteUser() throws -> NitroModules.Promise<Void> {
    .async {
      try await self.viewModel.candleClient?.deleteUser()
    }
  }

  public func getAvailableTools() throws -> NitroModules.Promise<String> {
    .async {
      let result = await self.viewModel.candleClient?.getAvailableTools()
      if let result,
        let data = try? JSONSerialization.data(withJSONObject: result, options: []),
        let string = String(data: data, encoding: .utf8)
      {
        return string
      }
      throw RNClientError.badEncoding
    }
  }

  public func executeTool(tool: ToolCall) throws -> NitroModules.Promise<String> {
    .async {
      let result = await self.viewModel.candleClient?.executeTool(
        tool: RNToolCall(name: tool.name, arguments: tool.arguments)
      )
      return try self.encodeToJSONString(result)
    }
  }

  // MARK: - Private

  @MainActor
  @available(iOS 17.0, *)
  private func setup() {
    let wrapperView = CandleLinkSheetWrapper(viewModel: viewModel)
    let hostingVC = HostingViewController(uiView: wrapperView)
    self.rootVC = hostingVC
    guard let rootViewController = UIApplication.keyWindow?.rootViewController,
      let view = rootViewController.view,
      let rootView = view.subviews.first
    else {
      fatalError("No root vc :(")
    }
    view.insertSubview(hostingVC.view, belowSubview: rootView)
    hostingVC.view.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      hostingVC.view.heightAnchor.constraint(equalTo: view.heightAnchor),
      hostingVC.view.widthAnchor.constraint(equalTo: view.widthAnchor),
      hostingVC.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      hostingVC.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
    ])
  }

  enum RNClientError: Error {
    case badEncoding
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
}
