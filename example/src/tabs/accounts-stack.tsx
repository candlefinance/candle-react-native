import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { AssetAccount, LinkedAccount } from 'react-native-candle'
import type { AccountsStackParamList } from './Navigation/navigation-types'
import { AssetAccountScreen } from './Screens/asset-account-screen'
import { AssetAccountsScreen } from './Screens/asset-accounts-screen'

const AccountsStack = createNativeStackNavigator<AccountsStackParamList>()

export function AccountsStackScreen({
  linkedAccounts,
  onAssetAccountsUpdated,
}: {
  linkedAccounts: LinkedAccount[]
  onAssetAccountsUpdated: (accounts: AssetAccount[]) => void
}) {
  return (
    <AccountsStack.Navigator>
      <AccountsStack.Screen name="AssetAccounts" options={{ title: 'Accounts' }}>
        {(props) => (
          <AssetAccountsScreen
            {...props}
            linkedAccounts={linkedAccounts}
            onAssetAccountsUpdated={onAssetAccountsUpdated}
          />
        )}
      </AccountsStack.Screen>
      <AccountsStack.Screen
        name="AssetAccountDetails"
        component={AssetAccountScreen}
        options={{ title: 'Asset Account' }}
      />
    </AccountsStack.Navigator>
  )
}
