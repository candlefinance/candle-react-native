import Candle
import SwiftUI

@available(iOS 17.0, *)
struct CandleLinkSheetWrapper: View {

  let candleClient: CandleClient

  @ObservedObject var viewModel: CandleLinkViewModel

  init(appUser: Candle.Models.AppUser) {
    self.candleClient = CandleClient(appUser: appUser)
    self.viewModel = CandleLinkViewModel(candleClient: candleClient)
  }

  var body: some View {
    if let services = viewModel.services {
      if let service = services.first, services.count == 1 {
        Spacer()
          .candleLinkSheet(
            isPresented: $viewModel.showSheet,
            service: service.toService,
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
            services: services.map(\.toService),
            showDynamicLoading: viewModel.showDynamicLoading,
            presentationStyle: viewModel.toCandlePresentationStyle,
            presentationBackground: viewModel.toCandlePresentationBackground
          ) { newLinkedAccount in
            viewModel.linkedAccount = newLinkedAccount
          }
          .environment(candleClient)
      }
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

@available(iOS 17.0, *)
final class CandleActionViewModel: ObservableObject {

  @Published var tradeQuote: Models.TradeQuote?
  @Published var tradeResult: Result<Candle.Models.Trade, Candle.Models.ExecuteTrade.Error>?

  init(tradeQuote: Models.TradeQuote?) {
    self.tradeQuote = tradeQuote
  }
}

@available(iOS 17.0, *)
struct CandleTradeExecutionSheetWrapper: View {

  let candleClient: CandleClient

  @ObservedObject var viewModel: CandleActionViewModel
  let presentationBackground: PresentationBackground

  var toCandlePresentationBackground: AnyShapeStyle {
    switch presentationBackground {
    case .default:
      return AnyShapeStyle(Material.regular)
    case .blur:
      return AnyShapeStyle(Material.ultraThick)
    }
  }

  var body: some View {
    Color.clear
      .candleTradeExecutionSheet(
        item: $viewModel.tradeQuote,
        presentationBackground: toCandlePresentationBackground
      ) { result in
        viewModel.tradeResult = result
      }
      .environment(candleClient)
  }
}
