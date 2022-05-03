import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_API_URL} from '../../constants';
import {USER} from '../../constants/typescript/user';
import {DatabaseContactResponse} from '../../utils/native-contact';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({baseUrl: BASE_API_URL}),
  endpoints: build => ({
    getUser: build.query<USER, any>({
      query: ({...patch}) => ({
        url: 'get_user_info',
        method: 'POST',
        body: patch,
      }),
    }),
    checkUserPacket: build.query<USER, any>({
      query: ({...patch}) => ({
        url: 'check_user_packet',
        method: 'POST',
        body: patch,
      }),
    }),
    getUserContacts: build.query<DatabaseContactResponse[], any>({
      query: ({...patch}) => ({
        url: 'user_contacts_fetch',
        method: 'POST',
        body: patch,
      }),
    }),
    updateUserContacts: build.query<DatabaseContactResponse[], any>({
      query: ({...patch}) => ({
        url: 'user_contacts_update',
        method: 'POST',
        body: patch,
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useLazyCheckUserPacketQuery,
  useLazyGetUserContactsQuery,
  useLazyUpdateUserContactsQuery,
} = userApi;
