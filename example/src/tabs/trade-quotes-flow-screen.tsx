import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { AssetAccount, LinkedAccount } from 'react-native-candle'
import type { QuoteTemplateID } from './Models/quote-template'
import type { TradeQuotesFlowParamList } from './Navigation/navigation-types'
import { CoordinatesScreen } from './Screens/coordinates-screen'
import { TradeQuoteScreen } from './Screens/trade-quote-screen'
import { TradeQuotesRequestScreen } from './Screens/trade-quotes-request-screen'
import { TradeQuotesScreen } from './Screens/trade-quotes-screen'

const TradeQuotesFlowStack = createNativeStackNavigator<TradeQuotesFlowParamList>()

export function TradeQuotesFlowScreen({
  assetAccounts,
  linkedAccounts,
  templateID,
}: {
  assetAccounts: AssetAccount[]
  linkedAccounts: LinkedAccount[]
  templateID: QuoteTemplateID
}) {
  return (
    <TradeQuotesFlowStack.Navigator>
      <TradeQuotesFlowStack.Screen
        name="TradeQuoteRequest"
        initialParams={{ templateID }}
        options={{ title: 'Trade Quotes' }}
      >
        {(props) => (
          <TradeQuotesRequestScreen
            {...props}
            linkedAccounts={linkedAccounts}
            assetAccounts={assetAccounts}
          />
        )}
      </TradeQuotesFlowStack.Screen>
      <TradeQuotesFlowStack.Screen
        name="CoordinateDetails"
        component={CoordinatesScreen}
        options={{ title: 'Coordinates' }}
      />
      <TradeQuotesFlowStack.Screen
        name="TradeQuotes"
        component={TradeQuotesScreen}
        options={{ title: 'Trade Quotes' }}
      />
      <TradeQuotesFlowStack.Screen
        name="TradeQuoteDetails"
        component={TradeQuoteScreen}
        options={{ title: 'Trade Quote' }}
      />
    </TradeQuotesFlowStack.Navigator>
  )
}
