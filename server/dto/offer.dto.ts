import type { DBOffer } from '#server/utils/db'

export interface OfferResponseDTO {
  id: string | number
  buyerId: string | number
  sellerId: string | number
  status: string
  motivationLetter: string
  proposedHourlyRate: number | null
  proposedDuraton: number | null
  proposedWorkplace: string | null
  buyerAgreed: string | null
  sellerAgreed: string | null
  createdAt: string
  updatedAt: string
}

export function toOfferResponseDTO(offer: DBOffer): OfferResponseDTO {
  return {
    id: offer.id,
    buyerId: offer.buyerId,
    sellerId: offer.sellerId,
    status: offer.status,
    motivationLetter: offer.motivationLetter,
    proposedHourlyRate: offer.proposedHourlyRate,
    proposedDuraton: offer.proposedDuraton,
    proposedWorkplace: offer.proposedWorkplace,
    buyerAgreed: offer.buyerAgreed instanceof Date ? offer.buyerAgreed.toISOString() : null,
    sellerAgreed: offer.sellerAgreed instanceof Date ? offer.sellerAgreed.toISOString() : null,
    // Logik-Fehler korrigiert: createdAt nutzt nun offer.createdAt statt offer.updatedAt
    createdAt: offer.createdAt instanceof Date ? offer.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: offer.updatedAt instanceof Date ? offer.updatedAt.toISOString() : new Date().toISOString()
  }
}

export function toOffersResponseDTO(offers: DBOffer[]) {
  if (!offers || offers.length === 0) return []
  return offers.map(offer => toOfferResponseDTO(offer))
}
