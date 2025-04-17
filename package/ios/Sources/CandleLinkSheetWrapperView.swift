import Candle
import SwiftUI

@available(iOS 17.0, *)
struct CandleLinkSheetWrapper: View {

  let candleClient = CandleClient(
    appUser:
      .init(
        appKey: Bundle.main.object(forInfoDictionaryKey: "CandleAppKey") as? String ?? "",
        appSecret: Bundle.main.object(forInfoDictionaryKey: "CandleAppSecret") as? String ?? ""
      )
  )

  @ObservedObject var viewModel: CandleLinkViewModel

  init(viewModel: CandleLinkViewModel) {
    self.viewModel = viewModel
  }

  func toCandleService(service: Service) -> Candle.Models.Service {
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
    }
  }

  var body: some View {
    if let services = viewModel.services {
      Spacer()
        .candleLinkSheet(
          isPresented: $viewModel.showSheet,
          customerName: viewModel.customerName,
          cornerRadius: viewModel.cornerRadius,
          services: services.map(toCandleService),
          showDynamicLoading: viewModel.showDynamicLoading,
          presentationStyle: viewModel.toCandlePresentationStyle,
          presentationBackground: viewModel.toCandlePresentationBackground
        ) { newLinkedAccount in
          viewModel.linkedAccount = newLinkedAccount
        }
        .environment(candleClient)
    } else {
      Spacer()
        .candleLinkSheet(
          isPresented: $viewModel.showSheet,
          customerName: viewModel.customerName,
          cornerRadius: viewModel.cornerRadius,
          services: .supported,
          showDynamicLoading: viewModel.showDynamicLoading,
          presentationStyle: viewModel.toCandlePresentationStyle,
          presentationBackground: viewModel.toCandlePresentationBackground
        ) { newLinkedAccount in
          viewModel.linkedAccount = newLinkedAccount
        }
        .environment(candleClient)
    }
  }
}
