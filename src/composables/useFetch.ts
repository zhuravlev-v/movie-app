import { ref, isRef, unref, watchEffect } from 'vue'

// API KEY
// 7d22a5e3edd8ff1fdec9c28748310e6f

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const BASE_URL = 'https://api.themoviedb.org/3'

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDIyYTVlM2VkZDhmZjFmZGVjOWMyODc0ODMxMGU2ZiIsInN1YiI6IjY0NWJiNjcyZmUwNzdhNWNhZWRhODY3OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kvtDSK4O1RMuWVAyBWxJcjYt0mic3TkYKrVG6CZr280'
    }
  }

  function doFetch() {
    // reset state before fetching..
    data.value = null
    error.value = null
    // unref() unwraps potential refs
    fetch(BASE_URL + unref(url), options)
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))

    // try {
    //   const response = await fetch(BASE_URL + unref(url), options)
    //   const json = await response.json()
    //   data.value = json
    // } catch (err) {
    //   error.value = err
    // }
  }

  if (isRef(url)) {
    // setup reactive re-fetch if input URL is a ref
    watchEffect(doFetch)
  } else {
    // otherwise, just fetch once
    // and avoid the overhead of a watcher
    doFetch()
  }

  return { data, error }
}