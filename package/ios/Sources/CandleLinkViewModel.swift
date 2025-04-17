import Candle
import SwiftUI

@available(iOS 17.0, *)
final class CandleLinkViewModel: ObservableObject {

  var candleClient: CandleClient?

  @Published var showSheet = false
  @Published var linkedAccount: Models.LinkedAccount?
  @Published var isPresented: Bool = false
  @Published var services: [Service]?
  @Published var cornerRadius: Double = 0
  @Published var customerName: String?
  @Published var showDynamicLoading: Bool = false
  @Published var presentationBackground: PresentationBackground = .default
  @Published var presentationStyle: PresentationStyle = .fullscreen

  init() {
    Task { @MainActor in
      self.candleClient = CandleClient(
        appUser:
          .init(
            appKey: Bundle.main.object(forInfoDictionaryKey: "CandleAppKey") as? String ?? "",
            appSecret: Bundle.main.object(forInfoDictionaryKey: "CandleAppSecret") as? String ?? ""
          )
      )
    }
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
