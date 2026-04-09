import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useState } from 'react'
import type { AssetAccount, LinkedAccount } from 'react-native-candle'
import { AccountsStackScreen } from './accounts-stack'
import { ServicesStackScreen } from './services-stack'
import { TradesStackScreen } from './trades-stack'

const Tab = createBottomTabNavigator()

export function TabsRootScreen() {
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([])
  const [assetAccounts, setAssetAccounts] = useState<AssetAccount[]>([])

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === 'Services'
              ? 'link-outline'
              : route.name === 'Accounts'
                ? 'wallet-outline'
                : 'swap-horizontal-outline'
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Services">
        {() => (
          <ServicesStackScreen
            linkedAccounts={linkedAccounts}
            onLinkedAccountsUpdated={setLinkedAccounts}
            onAssetAccountsCleared={() => {
              setAssetAccounts([])
            }}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Accounts">
        {() => (
          <AccountsStackScreen
            linkedAccounts={linkedAccounts}
            onAssetAccountsUpdated={setAssetAccounts}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Trades">
        {() => <TradesStackScreen linkedAccounts={linkedAccounts} assetAccounts={assetAccounts} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}
