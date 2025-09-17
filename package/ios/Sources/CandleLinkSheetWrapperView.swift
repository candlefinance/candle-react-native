import Candle
import SwiftUI

@available(iOS 17.0, *) struct CandleLinkSheetWrapper: View {

    @ObservedObject var viewModel = CandleLinkViewModel()

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
                    ) { newLinkedAccount in viewModel.linkedAccount = newLinkedAccount }
                    .onChange(of: viewModel.showSheet) { _, newValue in
                        Task { @MainActor in viewModel.isPresented = newValue }
                    }
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
                    ) { newLinkedAccount in viewModel.linkedAccount = newLinkedAccount }
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
                ) { newLinkedAccount in viewModel.linkedAccount = newLinkedAccount }
        }
    }
}
