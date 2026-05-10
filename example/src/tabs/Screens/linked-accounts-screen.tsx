import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Alert, Pressable, RefreshControl, View as RNView, ScrollView } from 'react-native'
import type { LinkedAccount, ServiceID } from 'react-native-candle'
import { useCandle } from 'react-native-candle'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { UserSafeError } from '../../Errors/user-safe-error'
import { toUserSafeError } from '../../Errors/user-safe-error'
import { NonSensitiveStorage } from '../../Storage/nonSensitiveStorage'
import { SKIP_ONBOARDING_KEY } from '../../Storage/storage-keys'
import { getLinkedAccountBadges, getLinkedAccountTitle } from '../Extensions/linked-account'
import { getSDKVersion } from '../Extensions/sdk-react-native'
import { getServiceLogo } from '../Extensions/service'
import { SettingsMenu } from '../Menus/settings-menu'
import type { ServicesStackNavigationProp } from '../Navigation/navigation-types'
import { styles } from '../styles'
import { ContentUnavailableState } from '../Views/content-unavailable-state'
import { DetailSection } from '../Views/detail-section'
import { ItemRow } from '../Views/item-row'
import { LoadingState } from '../Views/loading-state'
import { OnboardingScreen } from './Onboarding/onboarding-screen'

type ViewState = 'initial' | 'loading' | 'normal'

export function LinkedAccountsScreen({
  linkedAccounts,
  onLinkedAccountsUpdated,
  onAssetAccountsCleared,
}: {
  linkedAccounts: LinkedAccount[]
  onLinkedAccountsUpdated: (accounts: LinkedAccount[]) => void
  onAssetAccountsCleared: () => void
}) {
  const candle = useCandle()
  const stackNavigation = useNavigation<ServicesStackNavigationProp<'LinkedAccounts'>>()
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<UserSafeError | undefined>(undefined)
  const [viewState, setViewState] = useState<ViewState>('initial')
  const [showOnboarding, setShowOnboarding] = useState<boolean | undefined>(undefined)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showSDKVersion, setShowSDKVersion] = useState(false)
  const [accountToUnlink, setAccountToUnlink] = useState<LinkedAccount | undefined>(undefined)
  const [newLinkedAccount, setNewLinkedAccount] = useState<LinkedAccount | undefined>(undefined)
  const sdkVersion = useMemo(() => getSDKVersion(), [])

  const refreshLinkedAccounts = useCallback(
    async ({ showLoading = true }: { showLoading?: boolean } = {}) => {
      if (showLoading) {
        setViewState('loading')
      }
      setRefreshing(!showLoading)
      try {
        const accounts = await candle.getLinkedAccounts()
        onLinkedAccountsUpdated(accounts)
        setViewState('normal')
      } catch (error_) {
        if (showLoading) {
          setViewState('initial')
        }
        setError(toUserSafeError(error_))
      } finally {
        setRefreshing(false)
      }
    },
    [candle, onLinkedAccountsUpdated],
  )

  const presentLinkSheet = useCallback(
    (input: { services?: ServiceID[]; showSandbox?: boolean } = {}) => {
      candle.presentCandleLinkSheet({
        customerName: 'Acme Inc',
        presentationBackground: 'blur',
        presentationStyle: 'fullScreen',
        ...(input.services === undefined ? {} : { services: input.services }),
        ...(input.showSandbox === undefined ? {} : { showSandbox: input.showSandbox }),
        onSuccess: (account) => {
          void (async () => {
            const accounts = await candle.getLinkedAccounts()
            onLinkedAccountsUpdated(accounts)
            setViewState('normal')
            const nextLinkedAccount = accounts.find(
              (linkedAccount) => linkedAccount.linkedAccountID === account.linkedAccountID,
            )
            if (nextLinkedAccount !== undefined) {
              setNewLinkedAccount(nextLinkedAccount)
            }
          })().catch((error_: unknown) => {
            setError(toUserSafeError(error_))
          })
        },
      })
    },
    [candle, onLinkedAccountsUpdated],
  )

  const unlinkAccount = useCallback(
    async (account: LinkedAccount) => {
      try {
        await candle.unlinkAccount({ linkedAccountID: account.linkedAccountID })
        onAssetAccountsCleared()
        await refreshLinkedAccounts()
      } catch (error_) {
        setError(toUserSafeError(error_))
      } finally {
        setRefreshing(false)
      }
    },
    [candle, onAssetAccountsCleared, refreshLinkedAccounts],
  )

  const signOut = useCallback(async () => {
    setViewState('loading')
    try {
      await candle.signOut()
      onLinkedAccountsUpdated([])
      onAssetAccountsCleared()
      await NonSensitiveStorage.setBoolean(SKIP_ONBOARDING_KEY, false)
      setViewState('initial')
      setShowOnboarding(true)
    } catch (error_) {
      const safeError = toUserSafeError(error_)
      setViewState('initial')
      if (safeError.title === 'No Active User') {
        onLinkedAccountsUpdated([])
        onAssetAccountsCleared()
        await NonSensitiveStorage.setBoolean(SKIP_ONBOARDING_KEY, false)
        setError(safeError)
        setShowOnboarding(true)
        return
      }
      setError(safeError)
    }
  }, [candle, onAssetAccountsCleared, onLinkedAccountsUpdated])

  useLayoutEffect(() => {
    stackNavigation.setOptions({
      headerRight: () => (
        <RNView style={styles.headerActions}>
          <SettingsMenu
            onDeleteUser={() => {
              setShowDeleteConfirmation(true)
            }}
            onShowSDKVersion={() => {
              setShowSDKVersion(true)
            }}
          />
          <Pressable
            onPress={() => {
              presentLinkSheet({ showSandbox: true })
            }}
            style={styles.headerActionButton}
          >
            <Ionicons name="add-circle" size={22} color="#111827" />
          </Pressable>
        </RNView>
      ),
    })
  }, [presentLinkSheet, stackNavigation])

  useEffect(() => {
    if (showOnboarding !== false) {
      return
    }
    void refreshLinkedAccounts()
  }, [refreshLinkedAccounts, showOnboarding])

  useEffect(() => {
    if (newLinkedAccount === undefined) {
      return
    }
    stackNavigation.push('LinkedAccountDetails', { account: newLinkedAccount })
    setNewLinkedAccount(undefined)
  }, [newLinkedAccount, stackNavigation])

  useEffect(() => {
    void NonSensitiveStorage.getBoolean(SKIP_ONBOARDING_KEY)
      .then((skipOnboarding) => {
        setShowOnboarding(!(skipOnboarding ?? false))
      })
      .catch(() => {
        setShowOnboarding(true)
      })
  }, [])

  useEffect(() => {
    if (error === undefined) {
      return
    }
    Alert.alert(error.title, error.message, [
      {
        text: 'OK',
        style: 'cancel',
        onPress: () => {
          setError(undefined)
        },
      },
    ])
  }, [error])

  useEffect(() => {
    if (!showDeleteConfirmation) {
      return
    }
    Alert.alert(
      'Are You Sure?',
      'If you delete the user, you will have to re-link your accounts.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setShowDeleteConfirmation(false)
          },
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            setShowDeleteConfirmation(false)
            void signOut()
          },
        },
      ],
    )
  }, [signOut, showDeleteConfirmation])

  useEffect(() => {
    if (!showSDKVersion) {
      return
    }
    Alert.alert('Candle SDK Version', sdkVersion, [
      {
        text: 'OK',
        style: 'cancel',
        onPress: () => {
          setShowSDKVersion(false)
        },
      },
    ])
  }, [sdkVersion, showSDKVersion])

  useEffect(() => {
    if (accountToUnlink === undefined) {
      return
    }
    Alert.alert(
      'Are You Sure?',
      'You will no longer be able to view asset accounts or trades, retrieve trade quotes, or execute trades using this account.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setAccountToUnlink(undefined)
          },
        },
        {
          text: 'Unlink Account',
          style: 'destructive',
          onPress: () => {
            const account = accountToUnlink
            setAccountToUnlink(undefined)
            void unlinkAccount(account)
          },
        },
      ],
    )
  }, [accountToUnlink, unlinkAccount])

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <OnboardingScreen
        visible={showOnboarding ?? false}
        onReady={() => {
          void (async () => {
            await NonSensitiveStorage.setBoolean(SKIP_ONBOARDING_KEY, true)
            setShowOnboarding(false)
          })()
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              void refreshLinkedAccounts({ showLoading: false })
            }}
          />
        }
      >
        <DetailSection title="Linked Accounts">
          {viewState === 'initial' ? (
            <ContentUnavailableState
              title="Network Error"
              message="Check your connection and pull to refresh."
            />
          ) : viewState === 'loading' ? (
            <LoadingState />
          ) : linkedAccounts.length === 0 ? (
            <ContentUnavailableState
              title="No Linked Accounts"
              message="Link a service to get started"
            />
          ) : (
            linkedAccounts.map((account, index) => (
              <ItemRow
                key={account.linkedAccountID}
                title={getLinkedAccountTitle(account)}
                logo={{ kind: 'uri', uri: getServiceLogo(account.service) }}
                badges={getLinkedAccountBadges(account)}
                isLast={index === linkedAccounts.length - 1}
                swipeActions={[
                  ...(account.details.state === 'inactive'
                    ? [
                        {
                          label: 'Re-Link',
                          variant: 'success' as const,
                          onPress: () => {
                            presentLinkSheet({ services: [account.service.id] })
                          },
                        },
                      ]
                    : []),
                  {
                    label: 'Unlink',
                    variant: 'danger',
                    onPress: () => {
                      setAccountToUnlink(account)
                    },
                  },
                ]}
                onPress={() => {
                  stackNavigation.push('LinkedAccountDetails', {
                    account,
                  })
                }}
              />
            ))
          )}
        </DetailSection>
      </ScrollView>
    </SafeAreaView>
  )
}
