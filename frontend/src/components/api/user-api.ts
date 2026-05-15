import { getRequest } from './api'

export const fetchUser = async (id: number): Promise<User | null> => {
  return await getRequest<void, User | null>(`users/${id}`)
}

export const searchUser = async (query: UserQuery): Promise<Users> => {
  return await getRequest<UserQuery, Users>(`users/search`, query)
}

export const fetchUserParticipates = async (
  id: number
): Promise<ParticipatesResponse> => {
  return await getRequest<void, ParticipatesResponse>(
    `users/${id}/participates`
  )
}

export const fetchUserRuleBooks = async (
  id: number
): Promise<RuleBooksResponse> => {
  return await getRequest<void, RuleBooksResponse>(`users/${id}/rule-books`)
}

export const fetchUserScenarios = async (
  id: number
): Promise<ScenariosResponse> => {
  return await getRequest<void, ScenariosResponse>(`users/${id}/scenarios`)
}
