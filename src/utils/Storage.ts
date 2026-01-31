import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV({
  id: `user-storage`,
  encryptionKey: 'cremax-group-9766314963#',
  mode: 'multi-process',
  readOnly: false
})