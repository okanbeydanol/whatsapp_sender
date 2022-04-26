import {createSlice} from '@reduxjs/toolkit';

export type DeviceInfoResult = {
  fingerprint: string | null;
  androidId: string | null;
  uniqueId: string | null;
};

const initialState: DeviceInfoResult = {
  fingerprint: null,
  uniqueId: null,
  androidId: null,
};

export const deviceInfoSlice = createSlice({
  name: 'deviceinfo',
  initialState,
  reducers: {
    DEVICEINFO_CHANGE: (state, action) => {
      return action.payload;
    },
  },
});

export const {DEVICEINFO_CHANGE} = deviceInfoSlice.actions;

export const getDeviceInfoStore = (state: {deviceinfo: DeviceInfoResult}) =>
  state.deviceinfo;

export default deviceInfoSlice.reducer;
