import Candle

// MARK: Encoding & decoding

extension Models.MarketTradeAsset.AssetKindPayload {
    init(reactModel: MarketAssetKind) {
        switch reactModel {
        case .crypto: self = .crypto
        case .stock: self = .stock
        }
    }
    var reactModel: MarketAssetKind {
        switch self {
        case .crypto: return .crypto
        case .stock: return .stock
        }
    }
}

extension Models.Address {
    init(reactModel: Address) { self.init(value: reactModel.value) }
    var reactModel: Address { .init(value: value) }
}

extension Models.Coordinates {
    init(reactModel: Coordinates) {
        self.init(latitude: reactModel.latitude, longitude: reactModel.longitude)
    }
    var reactModel: Coordinates { .init(latitude: latitude, longitude: longitude) }
}

extension Models.Service {
    init(reactModel: Service) {
        switch reactModel {
        case .apple: self = .apple
        case .cashApp: self = .cashApp
        case .sandbox: self = .sandbox
        case .robinhood: self = .robinhood
        case .uber: self = .uber
        case .lyft: self = .lyft
        case .venmo: self = .venmo
        case .chime: self = .chime
        case .paypal: self = .paypal
        case .coinbase: self = .coinbase
        case .discover: self = .discover
        case .americanExpress: self = .americanExpress
        case .jpmorganChase: self = .jpmorganChase
        case .bankOfAmerica: self = .bankOfAmerica
        case .capitalOne: self = .capitalOne
        case .citibank: self = .citibank
        case .vanguard: self = .vanguard
        case .wellsFargo: self = .wellsFargo
        case .charlesSchwab: self = .charlesSchwab
        case .kalshi: self = .kalshi
        case .experian: self = .experian
        case .waymo: self = .waymo
        case .revel: self = .revel
        case .turo: self = .turo
        case .getaround: self = .getaround
        case .zipcar: self = .zipcar
        case .airbnb: self = .airbnb
        case .americanAirlines: self = .americanAirlines
        case .delta: self = .delta
        case .united: self = .united
        case .jetblue: self = .jetblue
        case .southwest: self = .southwest
        case .hawaiian: self = .hawaiian
        case .hotels: self = .hotels
        case .geico: self = .geico
        case .progressive: self = .progressive
        case .aaa: self = .aaa
        case .stateFarm: self = .stateFarm
        case .hertz: self = .hertz
        case .avis: self = .avis
        case .tesla: self = .tesla
        case .doordash: self = .doordash
        case .uberEats: self = .uberEats
        case .grubhub: self = .grubhub
        case .resy: self = .resy
        case .opentable: self = .opentable
        case .starbucks: self = .starbucks
        case .blueBottle: self = .blueBottle
        case .costco: self = .costco
        case .amazon: self = .amazon
        case .walmart: self = .walmart
        case .wholeFoods: self = .wholeFoods
        case .mcdonalds: self = .mcdonalds
        case .chipotle: self = .chipotle
        case .sweetgreen: self = .sweetgreen
        case .snapchat: self = .snapchat
        case .x: self = .x
        case .facebook: self = .facebook
        case .instagram: self = .instagram
        case .signal: self = .signal
        case .whatsapp: self = .whatsapp
        case .messenger: self = .messenger
        case .linkedin: self = .linkedin
        case .discord: self = .discord
        case .messages: self = .messages
        case .telegram: self = .telegram
        case .reddit: self = .reddit
        case .pinterest: self = .pinterest
        case .newYorkTimes: self = .newYorkTimes
        case .washingtonPost: self = .washingtonPost
        case .wallStreetJournal: self = .wallStreetJournal
        case .cnn: self = .cnn
        case .yahoo: self = .yahoo
        case .fox: self = .fox
        case .perplexity: self = .perplexity
        case .openai: self = .openai
        case .polymarket: self = .polymarket
        case .espn: self = .espn
        case .youtube: self = .youtube
        case .netflix: self = .netflix
        }
    }
    var reactModel: Service {
        switch self {
        case .apple: return .apple
        case .cashApp: return .cashApp
        case .sandbox: return .sandbox
        case .robinhood: return .robinhood
        case .uber: return .uber
        case .lyft: return .lyft
        case .venmo: return .venmo
        case .chime: return .chime
        case .paypal: return .paypal
        case .coinbase: return .coinbase
        case .discover: return .discover
        case .americanExpress: return .americanExpress
        case .jpmorganChase: return .jpmorganChase
        case .bankOfAmerica: return .bankOfAmerica
        case .capitalOne: return .capitalOne
        case .citibank: return .citibank
        case .vanguard: return .vanguard
        case .wellsFargo: return .wellsFargo
        case .charlesSchwab: return .charlesSchwab
        case .kalshi: return .kalshi
        case .experian: return .experian
        case .waymo: return .waymo
        case .revel: return .revel
        case .turo: return .turo
        case .getaround: return .getaround
        case .zipcar: return .zipcar
        case .airbnb: return .airbnb
        case .americanAirlines: return .americanAirlines
        case .delta: return .delta
        case .united: return .united
        case .jetblue: return .jetblue
        case .southwest: return .southwest
        case .hawaiian: return .hawaiian
        case .hotels: return .hotels
        case .geico: return .geico
        case .progressive: return .progressive
        case .aaa: return .aaa
        case .stateFarm: return .stateFarm
        case .hertz: return .hertz
        case .avis: return .avis
        case .tesla: return .tesla
        case .doordash: return .doordash
        case .uberEats: return .uberEats
        case .grubhub: return .grubhub
        case .resy: return .resy
        case .opentable: return .opentable
        case .starbucks: return .starbucks
        case .blueBottle: return .blueBottle
        case .costco: return .costco
        case .amazon: return .amazon
        case .walmart: return .walmart
        case .wholeFoods: return .wholeFoods
        case .mcdonalds: return .mcdonalds
        case .chipotle: return .chipotle
        case .sweetgreen: return .sweetgreen
        case .snapchat: return .snapchat
        case .x: return .x
        case .facebook: return .facebook
        case .instagram: return .instagram
        case .signal: return .signal
        case .whatsapp: return .whatsapp
        case .messenger: return .messenger
        case .linkedin: return .linkedin
        case .discord: return .discord
        case .messages: return .messages
        case .telegram: return .telegram
        case .reddit: return .reddit
        case .pinterest: return .pinterest
        case .newYorkTimes: return .newYorkTimes
        case .washingtonPost: return .washingtonPost
        case .wallStreetJournal: return .wallStreetJournal
        case .cnn: return .cnn
        case .yahoo: return .yahoo
        case .fox: return .fox
        case .perplexity: return .perplexity
        case .openai: return .openai
        case .polymarket: return .polymarket
        case .espn: return .espn
        case .youtube: return .youtube
        case .netflix: return .netflix
        }
    }
}

extension Models.TradeAsset {
    init(reactModel: TradeAsset) throws {
        if let fiatAsset = reactModel.fiatAsset {
            self = .FiatAsset(
                .init(
                    assetKind: .fiat,
                    serviceTradeID: fiatAsset.serviceTradeID,
                    serviceAccountID: fiatAsset.serviceAccountID,
                    currencyCode: fiatAsset.currencyCode,
                    amount: fiatAsset.amount,
                    linkedAccountID: fiatAsset.linkedAccountID,
                    service: .init(reactModel: fiatAsset.service)
                )
            )
        } else if let marketAsset = reactModel.marketTradeAsset {
            self = .MarketTradeAsset(
                .init(
                    assetKind: .init(reactModel: marketAsset.assetKind),
                    serviceAccountID: marketAsset.serviceAccountID,
                    serviceAssetID: marketAsset.serviceAssetID,
                    symbol: marketAsset.symbol,
                    amount: marketAsset.amount,
                    serviceTradeID: marketAsset.serviceTradeID,
                    linkedAccountID: marketAsset.linkedAccountID,
                    service: .init(reactModel: marketAsset.service),
                    name: marketAsset.name,
                    color: marketAsset.color,
                    logoURL: marketAsset.logoURL
                )
            )
        } else if let transportAsset = reactModel.transportAsset {
            self = .TransportAsset(
                .init(
                    assetKind: .transport,
                    serviceTradeID: transportAsset.serviceTradeID,
                    serviceAssetID: transportAsset.serviceAssetID,
                    serviceAccountID: transportAsset.serviceAccountID,
                    name: transportAsset.name,
                    description: transportAsset.description,
                    imageURL: transportAsset.imageURL,
                    originCoordinates: .init(reactModel: transportAsset.originCoordinates),
                    originAddress: .init(reactModel: transportAsset.originAddress),
                    destinationCoordinates: .init(
                        reactModel: transportAsset.destinationCoordinates
                    ),
                    destinationAddress: .init(reactModel: transportAsset.destinationAddress),
                    seats: transportAsset.seats,
                    departureDateTime: transportAsset.departureDateTime,
                    arrivalDateTime: transportAsset.arrivalDateTime,
                    linkedAccountID: transportAsset.linkedAccountID,
                    service: .init(reactModel: transportAsset.service)
                )
            )
        } else if reactModel.otherAsset != nil {
            self = .OtherAsset(.init(assetKind: .other))
        } else if reactModel.nothingAsset != nil {
            self = .NothingAsset(.init(assetKind: .nothing))
        } else {
            throw RNClientError.badInitialization(
                message: "Internal Candle Error: corrupted trade asset ref."
            )
        }
    }
    var reactModel: TradeAsset {
        switch self {
        case .FiatAsset(let fiatAsset):
            return .init(
                fiatAsset: .init(
                    assetKind: fiatAsset.assetKind.rawValue,
                    serviceTradeID: fiatAsset.serviceTradeID,
                    serviceAccountID: fiatAsset.serviceAccountID,
                    currencyCode: fiatAsset.currencyCode,
                    amount: fiatAsset.amount,
                    linkedAccountID: fiatAsset.linkedAccountID,
                    service: fiatAsset.service.reactModel
                ),
                marketTradeAsset: nil,
                transportAsset: nil,
                otherAsset: nil,
                nothingAsset: nil
            )
        case .MarketTradeAsset(let marketAsset):
            return .init(
                fiatAsset: nil,
                marketTradeAsset: .init(
                    assetKind: marketAsset.assetKind.reactModel,
                    serviceAccountID: marketAsset.serviceAccountID,
                    serviceAssetID: marketAsset.serviceAssetID,
                    symbol: marketAsset.symbol,
                    amount: marketAsset.amount,
                    serviceTradeID: marketAsset.serviceTradeID,
                    linkedAccountID: marketAsset.linkedAccountID,
                    name: marketAsset.name,
                    color: marketAsset.color,
                    logoURL: marketAsset.logoURL,
                    service: marketAsset.service.reactModel
                ),
                transportAsset: nil,
                otherAsset: nil,
                nothingAsset: nil
            )
        case .TransportAsset(let transportAsset):
            return .init(
                fiatAsset: nil,
                marketTradeAsset: nil,
                transportAsset: .init(
                    assetKind: transportAsset.assetKind.rawValue,
                    serviceTradeID: transportAsset.serviceTradeID,
                    serviceAssetID: transportAsset.serviceAssetID,
                    serviceAccountID: transportAsset.serviceAccountID,
                    name: transportAsset.name,
                    description: transportAsset.description,
                    imageURL: transportAsset.imageURL,
                    originCoordinates: transportAsset.originCoordinates.reactModel,
                    originAddress: transportAsset.originAddress.reactModel,
                    destinationCoordinates: transportAsset.destinationCoordinates.reactModel,
                    destinationAddress: transportAsset.destinationAddress.reactModel,
                    seats: transportAsset.seats,
                    departureDateTime: transportAsset.departureDateTime,
                    arrivalDateTime: transportAsset.arrivalDateTime,
                    linkedAccountID: transportAsset.linkedAccountID,
                    service: transportAsset.service.reactModel
                ),
                otherAsset: nil,
                nothingAsset: nil
            )
        case .OtherAsset(let otherAsset):
            return .init(
                fiatAsset: nil,
                marketTradeAsset: nil,
                transportAsset: nil,
                otherAsset: .init(assetKind: otherAsset.assetKind.rawValue),
                nothingAsset: nil
            )
        case .NothingAsset(let nothingAsset):
            return .init(
                fiatAsset: nil,
                marketTradeAsset: nil,
                transportAsset: nil,
                otherAsset: nil,
                nothingAsset: .init(assetKind: nothingAsset.assetKind.rawValue)
            )
        }
    }
}

// MARK: Encoding only

extension Candle.Models.LinkedAccount {
    var reactModel: LinkedAccount {
        LinkedAccount(
            linkedAccountID: linkedAccountID,
            service: service.reactModel,
            serviceUserID: serviceUserID,
            details: details.reactModel
        )
    }
}

extension Candle.Models.LinkedAccountDetails {
    var reactModel: LinkedAccountDetails {
        switch self {
        case .ActiveLinkedAccountDetails(let activeDetails):
            return .init(
                activeLinkedAccountDetails: .init(
                    state: activeDetails.state.rawValue,
                    accountOpened: activeDetails.accountOpened,
                    username: activeDetails.username,
                    emailAddress: activeDetails.emailAddress,
                    legalName: activeDetails.legalName
                ),
                inactiveLinkedAccountDetails: nil,
                unavailableLinkedAccountDetails: nil,
            )
        case .InactiveLinkedAccountDetails(let inactiveDetails):
            switch inactiveDetails.state {
            case .inactive:
                return .init(
                    activeLinkedAccountDetails: nil,
                    inactiveLinkedAccountDetails: .init(state: inactiveDetails.state.rawValue),
                    unavailableLinkedAccountDetails: nil,
                )
            case .unavailable:
                return .init(
                    activeLinkedAccountDetails: nil,
                    inactiveLinkedAccountDetails: nil,
                    unavailableLinkedAccountDetails: .init(state: inactiveDetails.state.rawValue)
                )
            }
        }
    }
}

extension Models.MerchantLocation {
    var reactModel: MerchantLocation {
        .init(
            countryCode: countryCode,
            countrySubdivisionCode: countrySubdivisionCode,
            localityName: localityName
        )
    }
}

extension Models.Counterparty {
    var reactModel: Counterparty {
        switch self {
        case .MerchantCounterparty(let merchantCounterparty):
            return .init(
                merchantCounterparty: .init(
                    kind: merchantCounterparty.kind.rawValue,
                    name: merchantCounterparty.name,
                    logoURL: merchantCounterparty.logoURL,
                    location: merchantCounterparty.location.map(\.reactModel)
                ),
                userCounterparty: nil,
                serviceCounterparty: nil
            )
        case .UserCounterparty(let userCounterparty):
            return .init(
                merchantCounterparty: nil,
                userCounterparty: .init(
                    kind: userCounterparty.kind.rawValue,
                    legalName: userCounterparty.legalName,
                    avatarURL: userCounterparty.avatarURL,
                    username: userCounterparty.username
                ),
                serviceCounterparty: nil
            )
        case .ServiceCounterparty(let serviceCounterparty):
            return .init(
                merchantCounterparty: nil,
                userCounterparty: nil,
                serviceCounterparty: .init(
                    kind: serviceCounterparty.kind.rawValue,
                    service: serviceCounterparty.service.reactModel
                )
            )
        }
    }
}

extension Models.MarketAssetQuoteRequest.AssetKindPayload {
    init(reactModel: MarketAssetKind) {
        switch reactModel {
        case .crypto: self = .crypto
        case .stock: self = .stock
        }
    }
}

extension Models.MarketAssetRef.AssetKindPayload {
    init(reactModel: MarketAssetKind) {
        switch reactModel {
        case .crypto: self = .crypto
        case .stock: self = .stock
        }
    }
}

extension Models.MarketAccount.AssetKindPayload {
    var reactModel: MarketAssetKind {
        switch self {
        case .crypto: return .crypto
        case .stock: return .stock
        }
    }
}

extension Models.Trade {
    var reactModel: Trade {
        .init(
            dateTime: dateTime,
            state: state.reactModel,
            counterparty: counterparty.reactModel,
            lost: lost.reactModel,
            gained: gained.reactModel
        )
    }
}

extension Models.TradeQuote {
    var reactModel: TradeQuote {
        .init(
            lost: lost.reactModel,
            gained: gained.reactModel,
            context: context,
            expirationDateTime: expirationDateTime
        )
    }
}

extension Models.FiatMarketAccountKind {
    var reactModel: FiatMarketAccountKind {
        switch self {
        case .individual: return .individual
        case .joint: return .joint
        case .rothIra: return .rothira
        case .traditionalIra: return .traditionalira
        case .business: return .business
        }
    }
}

extension Models.TransportAccountKind {
    var reactModel: TransportAccountKind {
        switch self {
        case .individual: return .individual
        case .joint: return .joint
        case .business: return .business
        }
    }
}

extension Models.ACHAccountKind {
    var reactModel: ACHAccountKind {
        switch self {
        case .checking: return .checking
        case .savings: return .savings
        }
    }
}

extension Models.Trade.StatePayload {
    var reactModel: TradeState {
        switch self {
        case .success: return .success
        case .failure: return .failure
        case .inProgress: return .inprogress
        }
    }
}

extension Models.LinkedAccountStatusRef.StatePayload {
    var reactModel: LinkedAccountState {
        switch self {
        case .active: return .active
        case .inactive: return .inactive
        case .unavailable: return .unavailable
        }
    }
}

extension Models.LinkedAccountStatusRef {
    var reactModel: LinkedAccountStatusRef {
        .init(
            linkedAccountID: linkedAccountID,
            service: service.reactModel,
            serviceUserID: serviceUserID,
            state: state.reactModel
        )
    }
}

extension Models.ACHDetails {
    var reactModel: ACHDetails {
        .init(
            accountNumber: accountNumber,
            routingNumber: routingNumber,
            accountKind: accountKind.reactModel
        )
    }
}

extension Models.WireDetails {
    var reactModel: WireDetails {
        .init(accountNumber: accountNumber, routingNumber: routingNumber)
    }
}

extension Models.AssetAccount {
    var reactModel: AssetAccount {
        switch self {
        case .FiatAccount(let fiatDetails):
            return AssetAccount(
                fiatAccount: .init(
                    assetKind: fiatDetails.assetKind.rawValue,
                    serviceAccountID: fiatDetails.serviceAccountID,
                    accountKind: fiatDetails.accountKind.reactModel,
                    nickname: fiatDetails.nickname,
                    currencyCode: fiatDetails.currencyCode,
                    balance: fiatDetails.balance,
                    ach: fiatDetails.ach.map(\.reactModel),
                    wire: fiatDetails.wire.map(\.reactModel),
                    linkedAccountID: fiatDetails.linkedAccountID,
                    service: fiatDetails.service.reactModel
                ),
                marketAccount: nil,
                transportAccount: nil
            )
        case .MarketAccount(let marketDetails):
            return AssetAccount(
                fiatAccount: nil,
                marketAccount: .init(
                    assetKind: marketDetails.assetKind.reactModel,
                    serviceAccountID: marketDetails.serviceAccountID,
                    accountKind: marketDetails.accountKind.reactModel,
                    nickname: marketDetails.nickname,
                    linkedAccountID: marketDetails.linkedAccountID,
                    service: marketDetails.service.reactModel
                ),
                transportAccount: nil
            )
        case .TransportAccount(let transportDetails):
            return AssetAccount(
                fiatAccount: nil,
                marketAccount: nil,
                transportAccount: .init(
                    assetKind: transportDetails.assetKind.rawValue,
                    serviceAccountID: transportDetails.serviceAccountID,
                    accountKind: transportDetails.accountKind.reactModel,
                    nickname: transportDetails.nickname,
                    linkedAccountID: transportDetails.linkedAccountID,
                    service: transportDetails.service.reactModel
                )
            )
        }
    }
}

// MARK: Decoding only

extension Models.GetLinkedAccount.Input.Path {
    init(reactModel: LinkedAccountRef) { self.init(linkedAccountID: reactModel.linkedAccountID, ) }
}

extension Models.UnlinkAccount.Input.Path {
    init(reactModel: LinkedAccountRef) { self.init(linkedAccountID: reactModel.linkedAccountID, ) }
}

extension Models.GetAssetAccount.Input.Path {
    init(reactModel: AssetAccountRef) {
        self.init(
            linkedAccountID: reactModel.linkedAccountID,
            assetKind: .init(reactModel: reactModel.assetKind),
            serviceAccountID: reactModel.serviceAccountID
        )
    }
}

extension Models.TradeRef {
    init(reactModel: TradeRef) throws {
        self.init(
            lost: try .init(reactModel: reactModel.lost),
            gained: try .init(reactModel: reactModel.gained)
        )
    }
}

extension Models.GetAssetAccounts.Input.Query {
    init(reactModel: AssetAccountsQuery) {
        self.init(
            linkedAccountIDs: reactModel.linkedAccountIDs,
            assetKind: reactModel.assetKind.map(AssetKindPayload.init(reactModel:))
        )
    }
}

extension Models.GetTrades.Input.Query {
    init(reactModel: TradesQuery) {
        self.init(
            linkedAccountIDs: reactModel.linkedAccountIDs,
            dateTimeSpan: reactModel.dateTimeSpan,
            gainedAssetKind: reactModel.gainedAssetKind.map(
                GainedAssetKindPayload.init(reactModel:)
            ),
            lostAssetKind: reactModel.lostAssetKind.map(LostAssetKindPayload.init(reactModel:)),
            counterpartyKind: reactModel.counterpartyKind.map(
                CounterpartyKindPayload.init(reactModel:)
            )
        )
    }
}

extension Models.TradeQuotesRequest {
    init(reactModel: TradeQuotesRequest) throws {
        self.init(
            linkedAccountIDs: reactModel.linkedAccountIDs,
            gained: try .init(reactModel: reactModel.gained),
            lost: try .init(reactModel: reactModel.lost)
        )
    }
}

extension Models.TradeAssetQuoteRequest {
    init(reactModel: TradeAssetQuoteRequest) throws {
        if let fiatAssetQuoteRequest = reactModel.fiatAssetQuoteRequest {
            self = .FiatAssetQuoteRequest(
                .init(
                    assetKind: .fiat,
                    serviceAccountID: fiatAssetQuoteRequest.serviceAccountID,
                    currencyCode: fiatAssetQuoteRequest.currencyCode,
                    amount: fiatAssetQuoteRequest.amount
                )
            )
        } else if let marketAssetQuoteRequest = reactModel.marketAssetQuoteRequest {
            self = .MarketAssetQuoteRequest(
                .init(
                    assetKind: .init(reactModel: marketAssetQuoteRequest.assetKind),
                    serviceAccountID: marketAssetQuoteRequest.serviceAccountID,
                    serviceAssetID: marketAssetQuoteRequest.serviceAssetID,
                    symbol: marketAssetQuoteRequest.symbol,
                    amount: marketAssetQuoteRequest.amount
                )
            )
        } else if let transportAssetQuoteRequest = reactModel.transportAssetQuoteRequest {
            self = .TransportAssetQuoteRequest(
                .init(
                    assetKind: .transport,
                    serviceAssetID: transportAssetQuoteRequest.serviceAssetID,
                    originCoordinates: transportAssetQuoteRequest.originCoordinates.map(
                        Models.Coordinates.init(reactModel:)
                    ),
                    originAddress: transportAssetQuoteRequest.originAddress.map(
                        Models.Address.init(reactModel:)
                    ),
                    destinationCoordinates: transportAssetQuoteRequest.destinationCoordinates.map(
                        Models.Coordinates.init(reactModel:)
                    ),
                    destinationAddress: transportAssetQuoteRequest.destinationAddress.map(
                        Models.Address.init(reactModel:)
                    ),
                    seats: transportAssetQuoteRequest.seats,
                    serviceAccountID: transportAssetQuoteRequest.serviceAccountID
                )
            )
        } else if reactModel.nothingAssetQuoteRequest != nil {
            self = .NothingAssetQuoteRequest(.init(assetKind: .nothing))
        } else {
            throw RNClientError.badInitialization(
                message: "Internal Candle Error: corrupted trade asset quote request."
            )
        }
    }
}

extension Models.GetAssetAccount.Input.Path.AssetKindPayload {
    init(reactModel: AssetAccountKind) {
        switch reactModel {
        case .fiat: self = .fiat
        case .stock: self = .stock
        case .crypto: self = .crypto
        case .transport: self = .transport
        }
    }
}

extension Models.GetAssetAccounts.Input.Query.AssetKindPayload {
    init(reactModel: AssetAccountKind) {
        switch reactModel {
        case .fiat: self = .fiat
        case .stock: self = .stock
        case .crypto: self = .crypto
        case .transport: self = .transport
        }
    }
}

extension Models.GetTrades.Input.Query.GainedAssetKindPayload {
    init(reactModel: TradeAssetKind) {
        switch reactModel {
        case .fiat: self = .fiat
        case .stock: self = .stock
        case .crypto: self = .crypto
        case .transport: self = .transport
        case .other: self = .other
        case .nothing: self = .nothing
        }
    }
}

extension Models.GetTrades.Input.Query.LostAssetKindPayload {
    init(reactModel: TradeAssetKind) {
        switch reactModel {
        case .fiat: self = .fiat
        case .stock: self = .stock
        case .crypto: self = .crypto
        case .transport: self = .transport
        case .other: self = .other
        case .nothing: self = .nothing
        }
    }
}

extension Models.GetTrades.Input.Query.CounterpartyKindPayload {
    init(reactModel: CounterpartyKind) {
        switch reactModel {
        case .merchant: self = .merchant
        case .service: self = .service
        case .user: self = .user
        }
    }
}

extension Models.TradeAssetRef {
    init(reactModel: TradeAssetRef) throws {
        if let fiatAssetRef = reactModel.fiatAssetRef {
            self = .FiatAssetRef(
                .init(
                    assetKind: .fiat,
                    serviceTradeID: fiatAssetRef.serviceTradeID,
                    linkedAccountID: fiatAssetRef.linkedAccountID
                )
            )
        } else if let marketTradeAssetRef = reactModel.marketTradeAssetRef {
            self = .MarketAssetRef(
                .init(
                    assetKind: Models.MarketAssetRef.AssetKindPayload.init(
                        reactModel: marketTradeAssetRef.assetKind
                    ),
                    serviceTradeID: marketTradeAssetRef.serviceTradeID,
                    linkedAccountID: marketTradeAssetRef.linkedAccountID
                )
            )
        } else if let transportAssetRef = reactModel.transportAssetRef {
            self = .TransportAssetRef(
                .init(
                    assetKind: .transport,
                    serviceTradeID: transportAssetRef.serviceTradeID,
                    linkedAccountID: transportAssetRef.linkedAccountID
                )
            )
        } else if reactModel.otherAssetRef != nil {
            self = .OtherAsset(.init(assetKind: .other))
        } else if reactModel.nothingAssetRef != nil {
            self = .NothingAsset(.init(assetKind: .nothing))
        } else {
            throw RNClientError.badInitialization(
                message: "Internal Candle Error: corrupted trade asset ref."
            )
        }
    }
}

extension Models.TradeQuote {
    init(reactModel: TradeQuote) throws {
        self.init(
            lost: try .init(reactModel: reactModel.lost),
            gained: try .init(reactModel: reactModel.gained),
            context: reactModel.context,
            expirationDateTime: reactModel.expirationDateTime
        )
    }
}
