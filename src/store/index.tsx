import {configureStore} from '@reduxjs/toolkit';

import dbLoginSliceReducer from './slices/login';
import socketSliceReducer from './slices/socket/socket';
import socketBrainSliceReducer from './slices/socket/socket-brain';
import keyboardEventsSliceReducer from './slices/keyboard';
import countrySliceReducer from './slices/country';
import deviceInfoSliceReducer from './slices/deviceInfo';
import {loginApi} from './api/loginApi';

const store = configureStore({
  reducer: {
    login: dbLoginSliceReducer,
    keyboardevents: keyboardEventsSliceReducer,
    country: countrySliceReducer,
    deviceinfo: deviceInfoSliceReducer,
    socket: socketSliceReducer,
    socketBrain: socketBrainSliceReducer,
    [loginApi.reducerPath]: loginApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(loginApi.middleware),
});

export default store;
