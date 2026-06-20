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

    peer.subscribe(ROOM)

    // Guarded — publish can throw if another subscribed peer's socket has
    // already closed at the OS level. Without try/catch this becomes an
    // unhandled rejection that crashes the entire Node process.
    try {
      peer.publish(ROOM, JSON.stringify({ event: 'online', userId }))
      peer.publish(ROOM, JSON.stringify({ event: 'request-status' }))
    }
    catch (err) {
      console.warn('[ws] Ignored publish error on open:', err)
    }
  },

  message(peer: Peer, message: Message) {
    if (!peer.context.userId) return
    try {
      const data = message.json()
      if (data.event === 'request-status') {
        try {
          peer.publish(ROOM, JSON.stringify({ event: 'online', userId: peer.context.userId }))
        }
        catch (err) {
          console.warn('[ws] Ignored publish error on message:', err)
        }
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
      // Guarded — same reasoning as above. This is the most likely crash
      // site since multiple tabs/connections often close in quick
      // succession, racing against each other's publish calls.
      try {
        peer.publish(ROOM, JSON.stringify({ event: 'offline', userId }))
      }
      catch (err) {
        console.warn('[ws] Ignored publish error on close:', err)
      }
    }

    try {
      peer.unsubscribe(ROOM)
    }
    catch (err) {
      console.warn('[ws] Ignored unsubscribe error on close:', err)
    }
  }
})
