import {createSlice} from '@reduxjs/toolkit';

export interface SocketConnectionResponse {
  messages: any;
  connected: boolean;
  disconnected: boolean;
  id: number | null;
  ownerGuid: string | null;
}

const initialState: SocketConnectionResponse = {
  messages: null,
  connected: false,
  disconnected: true,
  id: null,
  ownerGuid: null,
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    SOCKET_CONNECTION: (state, action) => {
      return action.payload;
    },
  },
});

export const {SOCKET_CONNECTION} = socketSlice.actions;

export const getSocketStore = (state: {socket: SocketConnectionResponse}) =>
  state.socket;

export default socketSlice.reducer;
