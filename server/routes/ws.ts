// server/routes/ws.ts
import type { Peer, Message } from 'crossws'

import { defineWebSocketHandler } from 'h3'

const ROOM = 'onlineUsers'

export default defineWebSocketHandler({
  async open(peer: Peer) {
    const url = new URL(peer.request?.url || '', 'http://localhost')
    const ticket = url.searchParams.get('ticket')

    const ticketsMap = (globalThis as any).wsTickets as Map<string, number> | undefined
    const userId = ticketsMap?.get(ticket || '')

    if (!userId) {
      peer.close(4001, 'Unauthorized Ticket')
      return
    }

    ticketsMap?.delete(ticket!)
    peer.context.userId = userId
    console.log(`✅ Secure WS established for user: ${userId}`)

    // 1. Subscribe to the channel
    peer.subscribe(ROOM)

    // 2. ⚡ FIX: stringify the message so CrossWS can stream it over the channel network
    peer.publish(ROOM, JSON.stringify({ event: 'online', userId }))

    // 3. ⚡ NEW: Ask all existing connected tabs in the room to broadcast their status back to this new user
    peer.publish(ROOM, JSON.stringify({ event: 'request-status' }))
  },

  message(peer: Peer, message: Message) {
    if (!peer.context.userId) return
    try {
      const data = message.json()

      // 4. ⚡ FIX: When a tab hears a 'request-status' shout, it broadcasts its presence back to the room
      if (data.event === 'request-status') {
        peer.publish(ROOM, JSON.stringify({ event: 'online', userId: peer.context.userId }))
      }
    }
    catch {
      // Catch non-JSON traffic safely
    }
  },

  close(peer: Peer) {
    const userId = peer.context?.userId
    if (userId) {
      console.log(`❌ Closed WS: userId ${userId}`)
      // 5. ⚡ FIX: Stringify the offline payload text string
      peer.publish(ROOM, JSON.stringify({ event: 'offline', userId }))
    }
    peer.unsubscribe(ROOM)
  }
})
