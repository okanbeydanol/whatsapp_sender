import {createSlice, SliceCaseReducers} from '@reduxjs/toolkit';
import {ContactResponse} from '../../utils/native-contact';

const initialState: ContactResponse[] = [];

export const contactsSlice = createSlice<
  ContactResponse[],
  SliceCaseReducers<any>
>({
  name: 'contacts',
  initialState,
  reducers: {
    CONTACTS_CHANGE: (state, action) => {
      return action.payload;
    },
  },
});

export const {CONTACTS_CHANGE} = contactsSlice.actions;

export const getContactsStore = (state: {contacts: ContactResponse[]}) =>
  state.contacts;

export default contactsSlice.reducer;
