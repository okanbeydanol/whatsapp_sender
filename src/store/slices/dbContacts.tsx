import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  DatabaseContactPhonesResponse,
  DatabaseContactResponse,
} from '../../utils/native-contact';

const initialState: DatabaseContactResponse[] = [];

export const dbContactsSlice = createSlice({
  name: 'dbContacts',
  initialState,
  reducers: {
    DB_CONTACTS_CHANGE: (state, action) => {
      return action.payload;
    },
    DB_CONTACTS_CHANGE_UPDATE: (
      state: DatabaseContactResponse[],
      {payload}: PayloadAction<number>,
    ) => {
      const findIndex = state.findIndex(
        (o: DatabaseContactResponse) => +o.contact_id === payload,
      );
      if (findIndex !== -1) {
        state[findIndex] = {
          ...state[findIndex],
          checked: state[findIndex].checked ? !state[findIndex].checked : true,
        };
      }
    },
    DB_CONTACTS_CHANGE_REMOVE_SELECTED: (
      state: DatabaseContactResponse[],
      {payload}: PayloadAction<DatabaseContactResponse[]>,
    ) => {
      payload.forEach((p: DatabaseContactResponse) => {
        const findIndex = state.findIndex(
          (o: DatabaseContactResponse) => +o.contact_id === +p.contact_id,
        );
        if (findIndex !== -1) {
          state[findIndex] = {
            ...state[findIndex],
            checked: false,
          };
        }
      });
    },
    DB_CONTACTS_CHANGE_ADD_SELECTED: (
      state: DatabaseContactResponse[],
      {payload}: PayloadAction<DatabaseContactResponse[]>,
    ) => {
      payload.forEach((p: DatabaseContactResponse) => {
        const findIndex = state.findIndex(
          (o: DatabaseContactResponse) => +o.contact_id === +p.contact_id,
        );
        if (findIndex !== -1) {
          state[findIndex] = {
            ...state[findIndex],
            checked: true,
          };
        }
      });
    },
    DB_CONTACTS_PHONE_STATUS_CHANGE: (
      state: DatabaseContactResponse[],
      {
        payload,
      }: PayloadAction<{contact_id: string; contact_phone_guid: string}>,
    ) => {
      const findIndex = state.findIndex(
        (o: DatabaseContactResponse) => +o.contact_id === +payload.contact_id,
      );
      if (findIndex !== -1) {
        const findPhoneIndex = state[findIndex].contact_phones.findIndex(
          (o: DatabaseContactPhonesResponse) =>
            o.contact_phone_guid === payload.contact_phone_guid,
        );
        if (findPhoneIndex !== -1) {
          const phone = {
            ...state[findIndex].contact_phones[findPhoneIndex],
            active: state[findIndex].contact_phones[findPhoneIndex].active
              ? +state[findIndex].contact_phones[findPhoneIndex].active === 1
                ? 0
                : 1
              : 1,
          };
          console.log(
            '%c burdamıııııı',
            'background: #222; color: #bada55',
            phone,
          );
          state[findIndex].contact_phones[findPhoneIndex] = {...phone};
        }
      }
    },
  },
});

export const {
  DB_CONTACTS_CHANGE,
  DB_CONTACTS_CHANGE_UPDATE,
  DB_CONTACTS_CHANGE_REMOVE_SELECTED,
  DB_CONTACTS_CHANGE_ADD_SELECTED,
  DB_CONTACTS_PHONE_STATUS_CHANGE,
} = dbContactsSlice.actions;

export const getDBContactsStore = (state: {
  dbContacts: DatabaseContactResponse[];
}) => state.dbContacts;

export default dbContactsSlice.reducer;
