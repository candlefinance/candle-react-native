import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { LinkedAccount } from 'react-native-candle'
import type { ServicesStackParamList } from './Navigation/navigation-types'
import { LinkedAccountScreen } from './Screens/linked-account-screen'
import { LinkedAccountsScreen } from './Screens/linked-accounts-screen'

const ServicesStack = createNativeStackNavigator<ServicesStackParamList>()

export function ServicesStackScreen({
  linkedAccounts,
  onLinkedAccountsUpdated,
  onAssetAccountsCleared,
}: {
  linkedAccounts: LinkedAccount[]
  onLinkedAccountsUpdated: (accounts: LinkedAccount[]) => void
  onAssetAccountsCleared: () => void
}) {
  return (
    <ServicesStack.Navigator>
      <ServicesStack.Screen name="LinkedAccounts" options={{ title: 'Services' }}>
        {(props) => (
          <LinkedAccountsScreen
            {...props}
            linkedAccounts={linkedAccounts}
            onLinkedAccountsUpdated={onLinkedAccountsUpdated}
            onAssetAccountsCleared={onAssetAccountsCleared}
          />
        )}
      </ServicesStack.Screen>
      <ServicesStack.Screen name="LinkedAccountDetails" options={{ title: 'Linked Account' }}>
        {(props) => (
          <LinkedAccountScreen
            {...props}
            onLinkedAccountsUpdated={onLinkedAccountsUpdated}
            onAssetAccountsCleared={onAssetAccountsCleared}
          />
        )}
      </ServicesStack.Screen>
    </ServicesStack.Navigator>
  )
}
