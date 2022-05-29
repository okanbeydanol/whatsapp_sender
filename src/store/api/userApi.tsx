import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_API_URL} from '../../constants';
import {
  DatabaseMessageTemplates,
  USER,
  USER_MESSAGE_TEPMLATES,
} from '../../constants/typescript/user';
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
    userContactPhoneStatusChange: build.query<DatabaseContactResponse[], any>({
      query: ({...patch}) => ({
        url: 'user_contact_phone_status_change',
        method: 'POST',
        body: patch,
      }),
    }),
    createUserList: build.query<DatabaseContactResponse, any>({
      query: ({...patch}) => ({
        url: 'user_list_create',
        method: 'POST',
        body: patch,
      }),
    }),
    updateUserList: build.query<DatabaseContactResponse[], any>({
      query: ({...patch}) => ({
        url: 'user_list_update',
        method: 'POST',
        body: patch,
      }),
    }),
    getUserList: build.query<USER_MESSAGE_TEPMLATES[], any>({
      query: ({...patch}) => ({
        url: 'user_list',
        method: 'POST',
        body: patch,
      }),
    }),
    removeUserList: build.query<USER_MESSAGE_TEPMLATES[], any>({
      query: ({...patch}) => ({
        url: 'user_list_remove',
        method: 'POST',
        body: patch,
      }),
    }),
    getUserMessageTemplates: build.query<DatabaseMessageTemplates, any>({
      query: ({...patch}) => ({
        url: 'get_user_message_templates',
        method: 'POST',
        body: patch,
      }),
    }),
    createUserMessageTemplates: build.query<USER_MESSAGE_TEPMLATES, any>({
      query: ({...patch}) => ({
        url: 'user_message_template_create',
        method: 'POST',
        body: patch,
      }),
    }),
    updateUserMessageTemplates: build.query<USER_MESSAGE_TEPMLATES, any>({
      query: ({...patch}) => ({
        url: 'user_message_template_update',
        method: 'POST',
        body: patch,
      }),
    }),
    deleteUserMessageTemplates: build.query<USER_MESSAGE_TEPMLATES, any>({
      query: ({...patch}) => ({
        url: 'user_message_template_delete',
        method: 'POST',
        body: patch,
      }),
    }),
    getAppVersion: build.query<string, any>({
      query: () => ({
        url: 'app_version',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useLazyCheckUserPacketQuery,
  useLazyGetUserContactsQuery,
  useLazyUpdateUserContactsQuery,
  useLazyUserContactPhoneStatusChangeQuery,
  useLazyCreateUserListQuery,
  useLazyUpdateUserListQuery,
  useLazyRemoveUserListQuery,
  useLazyGetUserMessageTemplatesQuery,
  useLazyCreateUserMessageTemplatesQuery,
  useLazyUpdateUserMessageTemplatesQuery,
  useLazyDeleteUserMessageTemplatesQuery,
  useLazyGetUserListQuery,
  useLazyGetAppVersionQuery,
} = userApi;
