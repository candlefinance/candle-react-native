import Candle
import SwiftUI

@available(iOS 17.0, *) final class CandleLinkViewModel: ObservableObject {

    @Published var showSheet = false
    @Published var linkedAccount: Models.LinkedAccount?
    @Published var isPresented: Bool = false
    @Published var services: [Service]?
    @Published var cornerRadius: Double = 0
    @Published var customerName: String?
    @Published var showDynamicLoading: Bool = false
    @Published var presentationBackground: PresentationBackground = .default
    @Published var presentationStyle: PresentationStyle = .fullscreen
}
