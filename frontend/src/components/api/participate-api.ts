import { getRequest } from './api'

export const fetchParticipateImpression = async (
  participateId: number
): Promise<ParticipateImpression | null> => {
  return await getRequest<void, ParticipateImpression | null>(
    `participates/${participateId}/impression`
  )
}

export const fetchParticipate = async (
  participateId: number
): Promise<ParticipateResponse | null> => {
  return await getRequest<void, ParticipateResponse | null>(
    `participates/${participateId}`
  )
}
