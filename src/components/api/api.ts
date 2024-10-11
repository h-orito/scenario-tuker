import { refreshAccessTokenIfNeeded } from '../lib/firebase/firebase-auth'

const getRequest = async <T, U>(
  path: string,
  params?: T,
  options?: RequestInit
): Promise<U> => {
  return request(path, 'GET', null, params, options)
}

const postRequest = async <T, U>(
  path: string,
  body?: T,
  options?: RequestInit
): Promise<U> => {
  return request(path, 'POST', body, null, options)
}

const putRequest = async <T, U>(
  path: string,
  body?: T,
  options?: RequestInit
): Promise<U> => {
  return request(path, 'PUT', body, null, options)
}

const deleteRequest = async <T, U>(
  path: string,
  body?: T,
  options?: RequestInit
): Promise<U> => {
  return request(path, 'DELETE', body, null, options)
}

const request = async <T, U>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: T,
  params?: T,
  options?: RequestInit
): Promise<U> => {
  const accessToken = await refreshAccessTokenIfNeeded()
  const headers = !!accessToken
    ? {
        authorization: `Bearer ${accessToken}`
      }
    : undefined
  const bodyJson = body && JSON.stringify(body)
  let url = `${process.env.NEXT_PUBLIC_API_BASE}${path}`
  if (params) {
    const query = new URLSearchParams(params)
    url += `?${query.toString()}`
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      cache: 'no-cache',
      body: bodyJson,
      ...options
    })
    if (response.status !== 200) {
      console.log(response)
      throw new Error('API Error')
    }
    const data = await response.json()
    return data as U
  } catch (error) {
    console.error(error)
    throw new Error('API request failed')
  }
}

export { getRequest, postRequest, putRequest, deleteRequest }
