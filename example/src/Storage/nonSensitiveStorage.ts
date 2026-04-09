import AsyncStorage from '@react-native-async-storage/async-storage'

export const NonSensitiveStorage = {
  async getBoolean(key: string): Promise<boolean | undefined> {
    const rawValue = await AsyncStorage.getItem(key)
    if (rawValue === null) {
      return undefined
    }
    return rawValue === 'true'
  },

  async setBoolean(key: string, value: boolean): Promise<void> {
    await AsyncStorage.setItem(key, value ? 'true' : 'false')
  },
}
