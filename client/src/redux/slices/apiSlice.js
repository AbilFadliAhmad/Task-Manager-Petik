import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URI = import.meta.env.VITE_APP_BASE_URL;

const baseQuery = fetchBaseQuery({baseUrl: API_URI + '/api'});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [],
  prepareHeaders: (headers) => { // kode ini berguna untuk memberitahu server bahwa data yang akan dikirim bernilai JSON
    headers.set('Content-Type', 'application/json');
    return headers;
  },
  endpoints: (builder) => ({})
});
