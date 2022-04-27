import {createSlice} from '@reduxjs/toolkit';

export type PermissionsResult = {
  accessibility: string | null;
  displayOverOtherApps: string | null;
};

const initialState: PermissionsResult = {
  accessibility: null,
  displayOverOtherApps: null,
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
