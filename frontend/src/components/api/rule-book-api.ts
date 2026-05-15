import { deleteRequest, getRequest, postRequest, putRequest } from './api'

export const fetchRuleBooks = async (): Promise<RuleBooksResponse> => {
  return await getRequest<void, RuleBooksResponse>(`rule-books`)
}

export const fetchRuleBook = async (
  id: number
): Promise<RuleBookResponse | null> => {
  return await getRequest<void, RuleBookResponse>(`rule-books/${id}`)
}

export const searchRuleBooks = async (
  query: RuleBookQuery
): Promise<RuleBooksResponse> => {
  return await getRequest<RuleBookQuery, RuleBooksResponse>(
    `rule-books/search`,
    query
  )
}

export const postRuleBook = async (
  ruleBook: RuleBook
): Promise<RuleBookResponse> => {
  return await postRequest<RuleBook, RuleBookResponse>(`rule-books`, ruleBook)
}

export const putRuleBook = async (
  ruleBook: RuleBook
): Promise<RuleBookResponse> => {
  return await putRequest<RuleBook, RuleBookResponse>(`rule-books`, ruleBook)
}

export const deleteRuleBook = async (id: number): Promise<void> => {
  return await deleteRequest<void, void>(`rule-books/${id}`)
}

export const deleteRuleBookCheck = async (
  id: number
): Promise<CheckResponse> => {
  return await deleteRequest<void, CheckResponse>(`rule-books/${id}/check`)
}

export const integrateDeleteRuleBook = async (
  id: number,
  destId: number
): Promise<void> => {
  return await putRequest<any, void>(`rule-books/${id}/integrate`, {
    dest_id: destId
  })
}

export const fetchRuleBookParticipates = async (
  id: number
): Promise<ParticipatesResponse> => {
  return await getRequest<void, ParticipatesResponse>(
    `rule-books/${id}/participates`
  )
}
