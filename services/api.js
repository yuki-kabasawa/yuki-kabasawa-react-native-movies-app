import axios from 'axios';
import { TMDB_API_KEY } from '@env';

const BASE_URL = 'https://api.themoviedb.org/3';

export async function getMovies(type) {
  const response = await axios.get(`${BASE_URL}/movie/${type}`, {
    params: { api_key: TMDB_API_KEY }
  });
  return response.data;
}

export async function getTVShows(type) {
  const response = await axios.get(`${BASE_URL}/tv/${type}`, {
    params: { api_key: TMDB_API_KEY }
  });
  return response.data;
}

export async function searchMedia(query, type) {
  const response = await axios.get(`${BASE_URL}/search/${type}`, {
    params: {
      api_key: TMDB_API_KEY,
      query: query
    }
  });
  return response.data;
}

export async function getMovieDetails(id) {
  const response = await axios.get(`${BASE_URL}/movie/${id}`, {
    params: { api_key: TMDB_API_KEY }
  });
  return response.data;
}

export async function getTVDetails(id) {
  const response = await axios.get(`${BASE_URL}/tv/${id}`, {
    params: { api_key: TMDB_API_KEY }
  });
  return response.data;
}
