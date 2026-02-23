import { createMMKV } from 'react-native-mmkv'

export const STORE = {
  USER_INFO: "userInfo",
  AUTH_TOKEN: "authToken",
}

export const storage = createMMKV({
  id: `userStorage`,
  encryptionKey: 'cremax-group-9766314963#',
  mode: 'multi-process',
  readOnly: false
})