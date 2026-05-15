import { getRequest, postRequest, putRequest } from './api'

export const fetchAuthors = async (): Promise<Authors> => {
  return await getRequest<void, Authors>(`authors`)
}

export const searchAuthors = async (query: AuthorQuery): Promise<Authors> => {
  return await getRequest<AuthorQuery, Authors>(`authors/search`, query)
}

export const fetchAuthor = async (id: number): Promise<Author | null> => {
  return await getRequest<void, Author | null>(`authors/${id}`)
}

export const postAuthor = async (author: Author): Promise<Author> => {
  return await postRequest<Author, Author>(`authors`, author)
}

export const putAuthor = async (author: Author): Promise<Author> => {
  return await putRequest<Author, Author>(`authors`, author)
}

export const fetchAuthorScenarios = async (
  authorId: number
): Promise<ScenariosResponse> => {
  return await getRequest<void, ScenariosResponse>(
    `authors/${authorId}/scenarios`
  )
}
