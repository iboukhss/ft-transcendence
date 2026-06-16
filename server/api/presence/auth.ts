// server/api/presence/auth.ts
import { defineEventHandler, createError } from 'h3'
import { randomUUID } from 'node:crypto'

// A global in-memory map to store temporary tickets (cleans up automatically)
// Using globalThis ensures it persists correctly during Nuxt hot-reloads in dev mode
globalThis.wsTickets = globalThis.wsTickets || new Map<string, number>()

export default defineEventHandler(async (event) => {
  // 1. Fetch the secure session via standard HTTP cookie mechanisms
  const session = await getUserSession(event)

  if (!session?.user?.id) {
    return throw401('User is not logged in')
  }

  // 2. Generate a random, high-entropy single-use ticket
  const ticket = randomUUID()
  const userId = Number(session.user.id)

  // 3. Map the ticket to the userId and set a strict 10-second expiration window
  globalThis.wsTickets.set(ticket, userId)
  setTimeout(() => {
    globalThis.wsTickets.delete(ticket)
  }, 10000)

  // 4. Return the ticket securely to the frontend client
  return { ticket }
})
