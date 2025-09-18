import Candle
import Combine

@available(iOS 17.0, *) final class CandleActionViewModel: ObservableObject {

    @Published var tradeQuote: Models.TradeQuote?
    @Published var tradeResult: Result<Candle.Models.Trade, Candle.Models.ExecuteTrade.Error>?

    init(tradeQuote: Models.TradeQuote?) { self.tradeQuote = tradeQuote }
}
