import {configureStore} from '@reduxjs/toolkit';

import dbLoginSliceReducer from './slices/login';
import socketSliceReducer from './slices/socket/socket';
import socketBrainSliceReducer from './slices/socket/socket-brain';
import keyboardEventsSliceReducer from './slices/keyboard';
import countrySliceReducer from './slices/country';
import deviceInfoSliceReducer from './slices/deviceInfo';
import {pokemonApi} from './api/pokemonApi';

const store = configureStore({
  reducer: {
    login: dbLoginSliceReducer,
    keyboardevents: keyboardEventsSliceReducer,
    country: countrySliceReducer,
    deviceinfo: deviceInfoSliceReducer,
    socket: socketSliceReducer,
    socketBrain: socketBrainSliceReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(pokemonApi.middleware),
});

export default store;
