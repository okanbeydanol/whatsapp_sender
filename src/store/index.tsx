import {configureStore, ConfigureStoreOptions} from '@reduxjs/toolkit';

import dbLoginSliceReducer from './slices/login';
import keyboardEventsSliceReducer from './slices/keyboard';
import countrySliceReducer from './slices/country';
import contactsSliceReducer from './slices/contacts';
import dbContactsSliceReducer from './slices/dbContacts';
import deviceInfoSliceReducer from './slices/deviceInfo';
import userSliceReducer from './slices/user';
import permissionsSliceReducer from './slices/permissions';
import {loginApi} from './api/loginApi';
import {userApi} from './api/userApi';

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined,
) =>
  configureStore({
    reducer: {
      login: dbLoginSliceReducer,
      keyboardevents: keyboardEventsSliceReducer,
      country: countrySliceReducer,
      contacts: contactsSliceReducer,
      dbContacts: dbContactsSliceReducer,
      deviceinfo: deviceInfoSliceReducer,
      user: userSliceReducer,
      permissions: permissionsSliceReducer,
      [loginApi.reducerPath]: loginApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(loginApi.middleware, userApi.middleware),
    ...options,
  });

export const store = createStore();
