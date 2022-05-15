import {createSlice} from '@reduxjs/toolkit';

export type PermissionsResult = {
  accessibility: boolean | null;
  displayOverOtherApps: boolean | null;
  storage: boolean | null;
  location: boolean | null;
  camera: boolean | null;
  contacts: boolean | null;
  notification: boolean | null;
};

const initialState: PermissionsResult = {
  accessibility: null,
  displayOverOtherApps: null,
  storage: null,
  location: null,
  camera: null,
  contacts: null,
  notification: null,
};

export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    PERMISSIONS_CHANGE: (state, action) => {
      return action.payload;
    },
  },
});

export const {PERMISSIONS_CHANGE} = permissionsSlice.actions;

export const getPermissionsStore = (state: {permissions: PermissionsResult}) =>
  state.permissions;

export default permissionsSlice.reducer;
