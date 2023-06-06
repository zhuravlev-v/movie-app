// API KEY
// 7d22a5e3edd8ff1fdec9c28748310e6f

export async function useFetch(url) {
  let data = null
  let error = null

  const BASE_URL = 'https://api.themoviedb.org/3'

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDIyYTVlM2VkZDhmZjFmZGVjOWMyODc0ODMxMGU2ZiIsInN1YiI6IjY0NWJiNjcyZmUwNzdhNWNhZWRhODY3OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kvtDSK4O1RMuWVAyBWxJcjYt0mic3TkYKrVG6CZr280'
    }
  }

  try {
    const response = await fetch(BASE_URL + url, options)
    const json = await response.json()
    data = json
  } catch (err) {
    error = err
  }

  return { data, error }
}