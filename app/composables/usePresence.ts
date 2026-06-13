// app/composables/usePresence.ts
import { ref, watch } from 'vue'

const onlineUsersList = ref<Set<number>>(new Set())
let ws: WebSocket | null = null

export const usePresence = () => {
  // 1. Extract both the login status AND the profile user data payload from nuxt-auth-utils
  const { loggedIn, user } = useUserSession()

  const connect = async () => {
    if (ws || !loggedIn.value || import.meta.server) return

    try {
      const data = await $fetch<{ ticket: string }>('/api/presence/auth', { method: 'POST' })
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

      ws = new WebSocket(`${protocol}//${window.location.host}/ws?ticket=${data.ticket}`)

      // 2. ⚡ THE FINAL PIECE: Inject your own user ID into your local Set instantly.
      // This bypasses the network echo cancellation loop and forces your own profile card green!
      if (user.value?.id) {
        const nextSet = new Set(onlineUsersList.value)
        nextSet.add(Number(user.value.id))
        onlineUsersList.value = nextSet
      }

      ws.onmessage = (event) => {
        try {
          if (!event.data) return

          const rawPayload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
          const innerData = rawPayload?.text || rawPayload?.message || rawPayload
          const payload = typeof innerData === 'string' ? JSON.parse(innerData) : innerData

          if (!payload || !payload.event) return

          if (payload.event === 'request-status') {
            if (ws?.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ event: 'request-status' }))
            }
            return
          }

          const targetId = Number(payload.userId)
          if (Number.isNaN(targetId)) return

          const nextSet = new Set(onlineUsersList.value)
          if (payload.event === 'online') nextSet.add(targetId)
          if (payload.event === 'offline') nextSet.delete(targetId)

          onlineUsersList.value = nextSet
        }
        catch (err) {
          console.warn('Skipped non-presence message framework packet:', event.data, err)
        }
      }

      ws.onclose = () => {
        ws = null
      }
    }
    catch (err) {
      console.error('WebSocket connection handshake aborted:', err)
    }
  }

  const disconnect = () => {
    if (ws) {
      ws.close()
      ws = null
    }
    onlineUsersList.value = new Set()
  }

  if (import.meta.client) {
    watch(loggedIn, (isLoggedIn) => {
      if (isLoggedIn) connect()
      else disconnect()
    }, { immediate: true })
  }

  return {
    onlineUsersList,
    isOnline: (userId: number) => onlineUsersList.value.has(userId)
  }
}
