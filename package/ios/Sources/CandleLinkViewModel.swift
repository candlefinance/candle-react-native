import Candle
import SwiftUI

@available(iOS 17.0, *)
final class CandleLinkViewModel: ObservableObject {

  let candleClient: CandleClient

  @Published var showSheet = false
  @Published var linkedAccount: Models.LinkedAccount?
  @Published var isPresented: Bool = false
  @Published var services: [Service]?
  @Published var cornerRadius: Double = 0
  @Published var customerName: String?
  @Published var showDynamicLoading: Bool = false
  @Published var presentationBackground: PresentationBackground = .default
  @Published var presentationStyle: PresentationStyle = .fullscreen

  init(candleClient: Candle.CandleClient) {
    self.candleClient = candleClient
  }

  @available(iOS 17.0, *)
  var toCandlePresentationStyle: Candle.PresentationStyle {
    switch presentationStyle {
    case .fullscreen:
      return .fullScreen
    case .sheet:
      return .sheet
    }
  }

  var toCandlePresentationBackground: AnyShapeStyle? {
    switch presentationBackground {
    case .default:
      return nil
    case .blur:
      return AnyShapeStyle(Material.regular)
    }
  }
}
