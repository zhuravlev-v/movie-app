export function getMoviePosterUrl(posterPath, size = '') {
  const BASE_URL = 'https://image.tmdb.org/t/p/'
  const posterSize = size ? size : 'original'
  return BASE_URL + posterSize + posterPath
}