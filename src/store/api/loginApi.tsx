import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_API_URL} from '../../constants';

export const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: fetchBaseQuery({baseUrl: BASE_API_URL}),
  endpoints: build => ({
    getCountries: build.query<any, void>({
      query: () => 'countries',
    }),
    checkPhone: build.query<any, any>({
      query: ({...patch}) => ({
        url: 'check_phone_number',
        method: 'POST',
        body: patch,
      }),
    }),
    loginOrCreate: build.query<any, any>({
      query: ({...patch}) => ({
        url: 'login_or_register',
        method: 'POST',
        body: patch,
      }),
    }),
    updateUserName: build.query<any, any>({
      query: ({...patch}) => ({
        url: 'update_user_name',
        method: 'POST',
        body: patch,
      }),
    }),
  }),
});

export const {
  useLazyGetCountriesQuery,
  useLazyCheckPhoneQuery,
  useLazyLoginOrCreateQuery,
  useLazyUpdateUserNameQuery,
} = loginApi;
