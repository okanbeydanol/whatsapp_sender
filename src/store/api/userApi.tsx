import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {USER} from '../../constants/typescript/user';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.1.20:8000/api/'}),
  endpoints: build => ({
    getUser: build.query<USER, any>({
      // note: an optional `queryFn` may be used in place of `query`
      query: ({...patch}) => ({
        url: 'get_user_info',
        method: 'POST',
        body: patch,
      }),
    }),
    checkUserPacket: build.query<USER, any>({
      // note: an optional `queryFn` may be used in place of `query`
      query: ({...patch}) => ({
        url: 'check_user_packet',
        method: 'POST',
        body: patch,
      }),
    }),
  }),
});

export const {useGetUserQuery, useLazyCheckUserPacketQuery} = userApi;
