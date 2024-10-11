import { deleteRequest, getRequest, postRequest, putRequest } from './api'

export const fetchGameSystems = async (): Promise<GameSystems> => {
  return await getRequest<void, GameSystems>(`game-systems`)
}

export const fetchGameSystem = async (id: number): Promise<GameSystem> => {
  return await getRequest<void, GameSystem>(`game-systems/${id}`)
}

export const searchGameSystems = async (
  query: GameSystemQuery
): Promise<GameSystems> => {
  return await getRequest<GameSystemQuery, GameSystems>(
    `game-systems/search`,
    query
  )
}

export const postGameSystem = async (
  gameSystem: GameSystem
): Promise<GameSystem> => {
  return await postRequest<GameSystem, GameSystem>(`game-systems`, gameSystem)
}

export const putGameSystem = async (
  gameSystem: GameSystem
): Promise<GameSystem> => {
  return await putRequest<GameSystem, GameSystem>(`game-systems`, gameSystem)
}

export const deleteGameSystem = async (id: number): Promise<void> => {
  return await deleteRequest<void, void>(`game-systems/${id}`)
}

export const deleteGameSystemCheck = async (
  id: number
): Promise<CheckResponse> => {
  return await deleteRequest<void, CheckResponse>(`game-systems/${id}/check`)
}

export const integrateDeleteGameSystem = async (
  id: number,
  destId: number
): Promise<void> => {
  return await putRequest<any, void>(`game-systems/${id}/integrate`, {
    dest_id: destId
  })
}

export const fetchGameSystemScenarios = async (
  id: number
): Promise<ScenariosResponse> => {
  return await getRequest<void, ScenariosResponse>(
    `game-systems/${id}/scenarios`
  )
}
