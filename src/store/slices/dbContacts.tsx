import {createSlice} from '@reduxjs/toolkit';
import {DatabaseContactResponse} from '../../utils/native-contact';

const initialState: DatabaseContactResponse[] = [];

export const dbContactsSlice = createSlice({
  name: 'dbContacts',
  initialState,
  reducers: {
    DB_CONTACTS_CHANGE: (state, action) => {
      return action.payload;
    },
  },
});

export const {DB_CONTACTS_CHANGE} = dbContactsSlice.actions;

export const getDBContactsStore = (state: {
  dbContacts: DatabaseContactResponse[];
}) => state.dbContacts;

export default dbContactsSlice.reducer;
