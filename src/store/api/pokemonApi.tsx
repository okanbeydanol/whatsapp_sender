import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.1.20:8000/api/'}),
  tagTypes: ['PHONE_CHECK'],
  keepUnusedDataFor: 10,
  endpoints: build => ({
    getCountries: build.query<any, void>({
      query: () => 'countries',
    }),
    checkPhone: build.query<any, any>({
      // note: an optional `queryFn` may be used in place of `query`
      query: ({...patch}) => ({
        url: 'check_phone_number',
        method: 'POST',
        body: patch,
      }),
      providesTags: ['PHONE_CHECK'],
    }),
    loginOrCreate: build.query<any, any>({
      // note: an optional `queryFn` may be used in place of `query`
      query: ({...patch}) => ({
        url: 'login_or_register',
        method: 'POST',
        body: patch,
      }),
    }),
    updateUserName: build.query<any, any>({
      // note: an optional `queryFn` may be used in place of `query`
      query: ({...patch}) => ({
        url: 'update_user_name',
        method: 'POST',
        body: patch,
      }),
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useCheckPhoneQuery,
  useLoginOrCreateQuery,
  useUpdateUserNameQuery,
} = pokemonApi;
