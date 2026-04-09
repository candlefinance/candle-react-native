import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { AssetAccount, LinkedAccount } from 'react-native-candle'
import type { TradesStackParamList } from './Navigation/navigation-types'
import { TradeScreen } from './Screens/trade-screen'
import { TradesScreen } from './Screens/trades-screen'
import { TradeQuotesFlowScreen } from './trade-quotes-flow-screen'

const TradesStack = createNativeStackNavigator<TradesStackParamList>()

export function TradesStackScreen({
  linkedAccounts,
  assetAccounts,
}: {
  linkedAccounts: LinkedAccount[]
  assetAccounts: AssetAccount[]
}) {
  return (
    <TradesStack.Navigator>
      <TradesStack.Screen name="TradesHome" options={{ title: 'Trades' }}>
        {(props) => (
          <TradesScreen {...props} linkedAccounts={linkedAccounts} assetAccounts={assetAccounts} />
        )}
      </TradesStack.Screen>
      <TradesStack.Screen
        name="TradeDetails"
        component={TradeScreen}
        options={{ title: 'Trade' }}
      />
      <TradesStack.Screen
        name="TradeQuotesFlow"
        options={{ headerShown: false, presentation: 'modal' }}
      >
        {(props) => (
          <TradeQuotesFlowScreen
            templateID={props.route.params.templateID}
            linkedAccounts={linkedAccounts}
            assetAccounts={assetAccounts}
          />
        )}
      </TradesStack.Screen>
    </TradesStack.Navigator>
  )
}
