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
    case .chime:
      return .chime
    case .paypal:
      return .paypal
    case .coinbase:
      return .coinbase
    case .discover:
      return .discover
    case .americanExpress:
      return .americanExpress
    case .jpmorganChase:
      return .jpmorganChase
    case .bankOfAmerica:
      return .bankOfAmerica
    case .capitalOne:
      return .capitalOne
    case .citibank:
      return .citibank
    case .vanguard:
      return .vanguard
    case .wellsFargo:
      return .wellsFargo
    case .charlesSchwab:
      return .charlesSchwab
    case .kalshi:
      return .kalshi
    case .experian:
      return .experian
    case .waymo:
      return .waymo
    case .revel:
      return .revel
    case .turo:
      return .turo
    case .getaround:
      return .getaround
    case .zipcar:
      return .zipcar
    case .airbnb:
      return .airbnb
    case .americanAirlines:
      return .americanAirlines
    case .delta:
      return .delta
    case .united:
      return .united
    case .jetblue:
      return .jetblue
    case .southwest:
      return .southwest
    case .hawaiian:
      return .hawaiian
    case .hotels:
      return .hotels
    case .geico:
      return .geico
    case .progressive:
      return .progressive
    case .aaa:
      return .aaa
    case .stateFarm:
      return .stateFarm
    case .hertz:
      return .hertz
    case .avis:
      return .avis
    case .tesla:
      return .tesla
    case .doordash:
      return .doordash
    case .uberEats:
      return .uberEats
    case .grubhub:
      return .grubhub
    case .resy:
      return .resy
    case .opentable:
      return .opentable
    case .starbucks:
      return .starbucks
    case .blueBottle:
      return .blueBottle
    case .costco:
      return .costco
    case .amazon:
      return .amazon
    case .walmart:
      return .walmart
    case .wholeFoods:
      return .wholeFoods
    case .mcdonalds:
      return .mcdonalds
    case .chipotle:
      return .chipotle
    case .sweetgreen:
      return .sweetgreen
    case .snapchat:
      return .snapchat
    case .x:
      return .x
    case .facebook:
      return .facebook
    case .instagram:
      return .instagram
    case .signal:
      return .signal
    case .whatsapp:
      return .whatsapp
    case .messenger:
      return .messenger
    case .linkedin:
      return .linkedin
    case .discord:
      return .discord
    case .messages:
      return .messages
    case .telegram:
      return .telegram
    case .reddit:
      return .reddit
    case .pinterest:
      return .pinterest
    case .newYorkTimes:
      return .newYorkTimes
    case .washingtonPost:
      return .washingtonPost
    case .wallStreetJournal:
      return .wallStreetJournal
    case .cnn:
      return .cnn
    case .yahoo:
      return .yahoo
    case .fox:
      return .fox
    case .perplexity:
      return .perplexity
    case .openai:
      return .openai
    case .polymarket:
      return .polymarket
    case .espn:
      return .espn
    case .youtube:
      return .youtube
    case .netflix:
      return .netflix
    }
  }

  var body: some View {
    if let services = viewModel.services {
      if let service = services.first, services.count == 1 {
        Spacer()
          .candleLinkSheet(
            isPresented: $viewModel.showSheet,
            service: toCandleService(service: service),
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
            services: services.map(toCandleService),
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
