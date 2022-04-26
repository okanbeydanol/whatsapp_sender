import {createSlice} from '@reduxjs/toolkit';
import {KeyboardEventName, KeyboardEvent} from 'react-native';

export type KeyboardEvents = {
  type: KeyboardEventName | null;
  event: KeyboardEvent | null;
  status: boolean;
  height: number;
};

const initialState: KeyboardEvents = {
  type: null,
  event: null,
  status: false,
  height: 0,
};

export const keyboardEventsSlice = createSlice({
  name: 'keyboardevents',
  initialState,
  reducers: {
    KEYBOARD_EVENT_CHANGE: (state, action) => {
      const type: KeyboardEventName = action.payload.type;
      if (type === 'keyboardDidHide' || type === 'keyboardWillHide') {
        state.status = false;
        state.height = 0;
      }
      if (type === 'keyboardDidShow' || type === 'keyboardWillShow') {
        state.status = true;
        state.height = action.payload.event.endCoordinates.height;
      }
      state.event = action.payload.event;
      state.type = type;
    },
  },
});

export const {KEYBOARD_EVENT_CHANGE} = keyboardEventsSlice.actions;

export const getkeyboardEventsStore = (state: {
  keyboardevents: KeyboardEvents;
}) => state.keyboardevents;

export default keyboardEventsSlice.reducer;
