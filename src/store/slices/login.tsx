import {createSlice} from '@reduxjs/toolkit';

export type LoginResult = {
  type: LoginType;
  userGuid: string;
  loading: boolean;
};

export enum LoginType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  RESTORE_GUID = 'RESTORE_GUID',
}
const initialState: LoginResult = {
  type: LoginType.RESTORE_GUID,
  userGuid: '',
  loading: true,
};

export const dbLoginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    LOGIN_SUCCESS: (state, action) => {
      return action.payload;
    },
    LOGIN_FAILED: (state, action) => {
      return action.payload;
    },
    LOGOUT: (state, action) => {
      return action.payload;
    },
    RESTORE_GUID: (state, action) => {
      if (action.payload.userGuid === null) {
        state.type = LoginType.LOGIN_FAILED;
        state.userGuid = '';
      } else {
        state.type = LoginType.LOGIN_SUCCESS;
        state.userGuid = action.payload.userGuid;
      }
      state.loading = false;
    },
  },
});

export const {LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, RESTORE_GUID} =
  dbLoginSlice.actions;

export const getLoginStore = (state: {login: LoginResult}) => state.login;

export default dbLoginSlice.reducer;
