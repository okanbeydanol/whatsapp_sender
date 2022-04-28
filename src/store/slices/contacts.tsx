import {createSlice} from '@reduxjs/toolkit';

export type ContactsResult = {
  name: string | null;
  lastName: string | null;
  fullName: string | null;
  contacts: [] | null;
  userGuid: string | null;
};

const initialState: ContactsResult[] = [];

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    CONTACTS_CHANGE: (state, action) => {
      return action.payload;
    },
  },
});

export const {CONTACTS_CHANGE} = contactsSlice.actions;

export const getContactsStore = (state: {contacts: ContactsResult[]}) =>
  state.contacts;

export default contactsSlice.reducer;
