import {createSlice} from '@reduxjs/toolkit';
import {USER} from '../../constants/typescript/user';

const initialState: USER = {
  id: null,
  city_id: null,
  country_id: null,
  fingerprint: null,
  uniqueId: null,
  created_at: null,
  updated_at: null,
  deleted_at: null,
  country_info: null,
  freeze_account: 0,
  fullname: null,
  last_latitude: null,
  last_longitude: null,
  packet_begin_time: null,
  packet_end_time: null,
  user_packet_info: null,
  phone_number: null,
  usage_info: null,
  user_guid: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    USER_CHANGE: (state, action) => {
      return action.payload;
    },
  },
});

export const {USER_CHANGE} = userSlice.actions;

export const getUserStore = (state: {user: USER}) => state.user;

export default userSlice.reducer;
