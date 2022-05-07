import {createSlice, PayloadAction, SliceCaseReducers} from '@reduxjs/toolkit';
import {
  USER,
  USER_LISTS,
  USER_MESSAGE_TEPMLATES,
} from '../../constants/typescript/user';
import {DatabaseContactResponse} from '../../utils/native-contact';

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

export const userSlice = createSlice<USER, SliceCaseReducers<any>>({
  name: 'user',
  initialState,
  reducers: {
    USER_CHANGE: (state: USER, action: PayloadAction<USER>) => {
      return action.payload;
    },
    USER_MESSAGES_TEMPLATE_ADD: (
      state: USER,
      action: PayloadAction<USER_MESSAGE_TEPMLATES>,
    ) => {
      if (!action.payload) {
        return state;
      }
      state.message_templates?.push(action.payload);
    },
    USER_LISTS_ADD: (state: USER, action: PayloadAction<USER_LISTS>) => {
      if (!action.payload) {
        return state;
      }
      state.lists?.push(action.payload);
    },
  },
});
export const {USER_CHANGE, USER_MESSAGES_TEMPLATE_ADD, USER_LISTS_ADD} =
  userSlice.actions;

export const getUserStore = (state: {user: USER}) => state.user;

export default userSlice.reducer;
