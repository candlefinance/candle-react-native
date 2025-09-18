import Candle
import SwiftUI

@available(iOS 17.0, *) struct CandleTradeExecutionSheetWrapper: View {

    @ObservedObject var viewModel: CandleActionViewModel
    let presentationBackground: PresentationBackground

    var toCandlePresentationBackground: AnyShapeStyle {
        switch presentationBackground {
        case .default: return AnyShapeStyle(Material.regular)
        case .blur: return AnyShapeStyle(Material.ultraThick)
        }
    }

    var body: some View {
        Color.clear.candleTradeExecutionSheet(
            item: $viewModel.tradeQuote,
            presentationBackground: toCandlePresentationBackground
        ) { result in viewModel.tradeResult = result }
    }
}
