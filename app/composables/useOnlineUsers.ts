import { computed } from 'vue'

import { usePresence } from './usePresence'

export const useOnlineUsers = () => {
  const { onlineUsersList } = usePresence()

  // Check if a specific user is online
  const has = (userId: number): boolean => {
    return onlineUsersList.value.has(userId)
  }

  // Get all online user IDs as an array
  const onlineArray = computed(() => {
    return Array.from(onlineUsersList.value)
  })

  return {
    has,
    onlineArray
  }
}
