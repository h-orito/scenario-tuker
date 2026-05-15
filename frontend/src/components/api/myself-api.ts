import { deleteRequest, getRequest, postRequest, putRequest } from './api'

export const fetchMyself = async (): Promise<User | null> => {
  return await getRequest<void, User | null>(`users/myself`)
}

export const putMyself = async (request: PutRequest): Promise<User> => {
  return await putRequest<PutRequest, User>(`users/myself`, request)
}

type PutRequest = {
  name: string
  introduction: string
}

export const deleteMyself = async (): Promise<void> => {
  return await deleteRequest<void, void>(`users/myself`)
}

export const postParticipates = async (
  request: ParticipatePostRequest
): Promise<ParticipateResponse> => {
  return await postRequest<ParticipatePostRequest, ParticipateResponse>(
    `users/myself/participates`,
    request
  )
}

export const putParticipates = async (
  request: ParticipatePostRequest
): Promise<ParticipateResponse> => {
  return await putRequest<ParticipatePostRequest, ParticipateResponse>(
    `users/myself/participates`,
    request
  )
}

export const deleteParticipates = async (id: number): Promise<void> => {
  return await deleteRequest<void, void>(`users/myself/participates/${id}`)
}

type ParticipatePostRequest = {
  id?: number
  scenario_id: number
  game_system_id: number | null
  rule_book_ids: Array<number>
  role_names: Array<string>
  disp_order?: number
  impression: ParticipateImpression | null
  term_from: string | null
  term_to: string | null
  player_num: number | null
  game_master: string | null
  player_names: string | null
  required_hours: number | null
  memo: string | null
}

export const postRuleBooks = async (
  request: RuleBookPostRequest
): Promise<void> => {
  return await postRequest<RuleBookPostRequest, void>(
    `users/myself/rule-books`,
    request
  )
}

export const deleteRuleBooks = async (id: number): Promise<void> => {
  return await deleteRequest<void, void>(`users/myself/rule-books/${id}`)
}

type RuleBookPostRequest = {
  rule_book_id: number
}

export const postScenarios = async (
  request: ScenarioPostRequest
): Promise<void> => {
  return await postRequest<ScenarioPostRequest, void>(
    `users/myself/scenarios`,
    request
  )
}

export const deleteScenarios = async (id: number): Promise<void> => {
  return await deleteRequest<void, void>(`users/myself/scenarios/${id}`)
}

type ScenarioPostRequest = {
  scenario_id: number
}
