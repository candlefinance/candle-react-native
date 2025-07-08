import Candle
import SwiftUI

@available(iOS 17.0, *)
struct CandleLinkSheetWrapper: View {

  let candleClient: CandleClient

  @ObservedObject var viewModel: CandleLinkViewModel

  init(appUser: Candle.Models.AppUser, accessGroup: String?) {
    self.candleClient = CandleClient(appUser: appUser, accessGroup: accessGroup)
    self.viewModel = CandleLinkViewModel(candleClient: candleClient)
  }

  var body: some View {
    if let services = viewModel.services {
      if let service = services.first, services.count == 1 {
        Spacer()
          .candleLinkSheet(
            isPresented: $viewModel.showSheet,
            service: service.toRNModel,
            customerName: viewModel.customerName,
            cornerRadius: viewModel.cornerRadius,
            showDynamicLoading: viewModel.showDynamicLoading,
            presentationStyle: viewModel.toCandlePresentationStyle,
            presentationBackground: viewModel.toCandlePresentationBackground
          ) { newLinkedAccount in
            viewModel.linkedAccount = newLinkedAccount
          }
          .onChange(of: viewModel.showSheet) { _, newValue in
            Task { @MainActor in
              viewModel.isPresented = newValue
            }
          }
          .environment(candleClient)
      } else {
        Spacer()
          .candleLinkSheet(
            isPresented: $viewModel.showSheet,
            customerName: viewModel.customerName,
            cornerRadius: viewModel.cornerRadius,
            services: services.map(\.toRNModel),
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
