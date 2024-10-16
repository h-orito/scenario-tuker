import { deleteRequest, getRequest, postRequest, putRequest } from './api'

export const fetchScenarios = async (): Promise<ScenariosResponse> => {
  return await getRequest<void, ScenariosResponse>(`scenarios`)
}

export const fetchPopularScenarios = async (
  type: string
): Promise<ScenariosResponse> => {
  return await getRequest<void, ScenariosResponse>(`scenarios/popular/${type}`)
}

export const fetchScenario = async (id: number): Promise<ScenarioResponse> => {
  return await getRequest<void, ScenarioResponse>(`scenarios/${id}`)
}

export const fetchScenarioAlso = async (
  id: number
): Promise<ScenariosResponse> => {
  return await getRequest<void, ScenariosResponse>(`scenarios/${id}/also`)
}

export const searchScenarios = async (
  query: ScenarioQuery
): Promise<ScenariosResponse> => {
  return await getRequest<ScenarioQuery, ScenariosResponse>(
    `scenarios/search`,
    query
  )
}

export const postScenario = async (
  scenario: ScenarioPostRequest
): Promise<ScenarioResponse> => {
  return await postRequest<ScenarioPostRequest, ScenarioResponse>(
    `scenarios`,
    scenario
  )
}

type ScenarioPostRequest = {
  id?: number
  name: string
  dictionary_names: string[]
  type: string
  url: string
  game_system_id: number | null
  author_ids: number[]
  game_master_requirement: string | null
  player_num_min: number | null
  player_num_max: number | null
  required_hours: number | null
}

export const putScenario = async (
  scenario: ScenarioPostRequest
): Promise<ScenarioResponse> => {
  return await putRequest<ScenarioPostRequest, ScenarioResponse>(
    `scenarios`,
    scenario
  )
}

export const deleteScenario = async (id: number): Promise<void> => {
  return await deleteRequest<void, void>(`scenarios/${id}`)
}

export const deleteScenarioCheck = async (
  id: number
): Promise<CheckResponse> => {
  return await deleteRequest<void, CheckResponse>(`scenarios/${id}/check`)
}

export const integrateDeleteScenario = async (
  id: number,
  destId: number
): Promise<void> => {
  return await putRequest<any, void>(`scenarios/${id}/integrate`, {
    dest_id: destId
  })
}

export const fetchScenarioParticipates = async (
  request: ParticipatesFetchRequest
): Promise<ParticipatesResponse> => {
  return await getRequest<any, ParticipatesResponse>(
    `scenarios/${request.scenario_id}/participates`,
    {
      is_twitter_following: request.is_twitter_following
    }
  )
}

type ParticipatesFetchRequest = {
  scenario_id: number
  is_twitter_following: boolean
}
