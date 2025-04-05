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

  var body: some View {
    if let service = viewModel.toCandleService {
      Spacer()
        .candleLinkSheet(
          isPresented: $viewModel.showSheet,
          service: service,
          customerName: viewModel.customerName,
          cornerRadius: viewModel.cornerRadius,
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
          services: viewModel.showSandbox ? .supported + [.demo] : .supported,
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
