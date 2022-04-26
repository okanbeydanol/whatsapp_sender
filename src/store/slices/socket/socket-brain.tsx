import {createSlice} from '@reduxjs/toolkit';
import moment from 'moment';
export interface SocketConnectionResponse {
  contactGuid: string;
  fullName: string;
  name: string;
  lastName: string;
  areaCode: string;
  countryCode: string;
  digit: string;
  image: string;
  status: number;
  connected: boolean;
}

const initialState = {
  conversations: [],
  messages: [],
  status: 0,
  badge: {},
};

export const socketBrainSlice = createSlice({
  name: 'socketBrain',
  initialState,
  reducers: {
    slice_user_retrive_conversations: (state, action) => {
      console.log(
        '%c action.payload',
        'background: #222; color: #bada55',
        action.payload,
      );
      state.conversations = action.payload;
    },
    slice_user_retrive_conversation_lastMessage_update_message_receive: (
      state: any,
      action,
    ) => {
      if (action.payload.lastMessage !== null) {
        const {messageGuid} = action.payload;
        const findIndex: any = state.conversations.findIndex(
          (o: any) => o.friendGuid === action.payload.friendGuid,
        );
        if (
          findIndex !== -1 &&
          state.conversations[findIndex].lastMessage.messageGuid !== messageGuid
        ) {
          state.conversations[findIndex].lastMessage = action.payload;
          state.conversations[findIndex].unreadMessageCount += 1;
        }
        console.log(
          '%c  string',
          'background: #222; color: #bada55',
          action.payload,
        );
      }
    },
    slice_user_retrive_conversation_lastMessage_update_read_status: (
      state: any,
      action: any,
    ) => {
      state.conversations.map((o: any) => {
        if (
          o.nounGuid === action.payload &&
          o.lastMessage.readStatus === false &&
          o.lastMessage.readTime === null
        ) {
          o.lastMessage.delivered = true;
          o.lastMessage.readStatus = true;
          o.lastMessage.readTime = moment();
        }
      });
    },
    slice_user_retrive_conversation_lastMessage_update_delivered_status: (
      state: any,
      action: any,
    ) => {
      console.log(
        '%c action.payload.nounGuid1',
        'background: #222; color: #bada55',
        action.payload,
      );
      state.conversations.map((o: any) => {
        if (
          o.nounGuid === action.payload &&
          o.lastMessage.delivered === false &&
          o.lastMessage.readStatus === false &&
          o.lastMessage.readTime === null
        ) {
          console.log(
            '%c action.payload.nounGuid',
            'background: #222; color: #bada55',
            action.payload,
          );
          o.lastMessage.delivered = true;
        }
      });
    },
    slice_user_retrive_conversations_update: (state: any, action: any) => {
      if (action.payload.lastMessage !== null) {
        const findIndex: any = state.conversations.findIndex(
          (o: any) => o.friendGuid === action.payload.friendGuid,
        );
        if (findIndex !== -1) {
          state.conversations[findIndex] = action.payload;
        } else {
          state.conversations.push(action.payload);
        }
      }
    },
    slice_user_retrive_messages: (state, action) => {
      action.payload.push(
        {
          messageGuid: '213123123321',
          text: null,
          ownerGuid: '13e45bf6-aba3-4b9b-bec5-39bb35363ba2',
          nounGuid: '41a88c9f-e4ca-4d41-a1ba-2327f0df41f1',
          readStatus: false,
          sendTime: moment(),
          readTime: null,
          delivered: false,
          friendGuid: '033fd9cf-3f9a-4bbf-a7c9-3392fe6c2b20',
          type: 'contact', //text media location contract file sound
          contact: {
            ownerGuid: '9999999',
            name: 'Okan Beydanol',
            image: 'assets/images/profile.png',
            numberInfo: {
              areaCode: '90',
              digits: '5382665669',
            },
          },
        },
        {
          messageGuid: '213123123321',
          text: null,
          ownerGuid: '13e45bf6-aba3-4b9b-bec5-39bb35363ba2',
          nounGuid: '41a88c9f-e4ca-4d41-a1ba-2327f0df41f1',
          readStatus: false,
          sendTime: moment(),
          readTime: null,
          type: 'media', //text media location contract file sound
          media:
            'https://www.hobisi.com/wp-content/uploads/2019/05/resim-nedir-turleri-ve-stilleri.jpg',
          delivered: false,
          friendGuid: '033fd9cf-3f9a-4bbf-a7c9-3392fe6c2b20',
        },
        {
          messageGuid: '21312312334444421',
          text: null,
          ownerGuid: '13e45bf6-aba3-4b9b-bec5-39bb35363ba2',
          nounGuid: '41a88c9f-e4ca-4d41-a1ba-2327f0df41f1',
          readStatus: false,
          sendTime: moment(),
          readTime: null,
          type: 'media', //text media location contract file sound
          media:
            'https://helpx.adobe.com/content/dam/help/en/stock/how-to/visual-reverse-image-search/jcr_content/main-pars/image/visual-reverse-image-search-v2_intro.jpg',
          delivered: false,
          friendGuid: '033fd9cf-3f9a-4bbf-a7c9-3392fe6c2b20',
        },
        {
          messageGuid: '233212312334444421',
          text: null,
          ownerGuid: '13e45bf6-aba3-4b9b-bec5-39bb35363ba2',
          nounGuid: '41a88c9f-e4ca-4d41-a1ba-2327f0df41f1',
          readStatus: false,
          sendTime: moment(),
          readTime: null,
          type: 'media', //text media location contract file sound
          media:
            'https://i.insider.com/5df3c6e5fd9db232853181e5?width=600&format=jpeg&auto=webp',
          delivered: false,
          friendGuid: '033fd9cf-3f9a-4bbf-a7c9-3392fe6c2b20',
        },
      );
      state.messages = action.payload;
    },
    slice_user_retrive_message_update_message_receive: (
      state: any,
      action: any,
    ) => {
      state.messages.push(action.payload);
    },
    slice_user_retrive_message_update_delivered_status: (
      state: any,
      action: any,
    ) => {
      state.messages.map((o: any) => {
        if (
          o.nounGuid === action.payload &&
          o.delivered === false &&
          o.readStatus === false &&
          o.readTime === null
        ) {
          o.delivered = true;
        }
      });
    },
    slice_user_retrive_message_update_read_status: (
      state: any,
      action: any,
    ) => {
      state.messages.map((o: any) => {
        if (
          o.nounGuid === action.payload &&
          o.readStatus === false &&
          o.readTime === null
        ) {
          o.readStatus = true;
          o.readTime = moment();
        }
      });
    },
    slice_user_retrive_message_update: (state: any, action: any) => {
      state.messages.push(action.payload);
      //delivered oldumu update et read oldumu da
    },
    slice_user_retrive_status: (state, action) => {
      state.status = action.payload;
    },
    slice_user_retrive_badge: (state, action) => {
      state.badge = action.payload;
    },
    slice_user_retrive_badge_total_update: (state, action) => {
      state.badge = {totalUnreadMessageCount: action.payload};
    },
  },
});

export const {
  slice_user_retrive_messages,
  slice_user_retrive_message_update_message_receive,
  slice_user_retrive_message_update_delivered_status,
  slice_user_retrive_message_update_read_status,
  slice_user_retrive_message_update,
  slice_user_retrive_status,
  slice_user_retrive_badge,
  slice_user_retrive_badge_total_update,
  slice_user_retrive_conversations,
  slice_user_retrive_conversations_update,
  slice_user_retrive_conversation_lastMessage_update_message_receive,
  slice_user_retrive_conversation_lastMessage_update_delivered_status,
  slice_user_retrive_conversation_lastMessage_update_read_status,
} = socketBrainSlice.actions;

export const listen_slice_user_retrive_conversations = (state: {
  socketBrain: {conversations: []};
}) => state.socketBrain.conversations;
export const listen_slice_user_retrive_messages = (state: {
  socketBrain: {messages: []};
}) => state.socketBrain.messages;
export const listen_slice_user_retrive_status = (state: {
  socketBrain: {status: number};
}) => state.socketBrain.status;
export const listen_slice_user_retrive_badge = (state: {
  socketBrain: {badge: any};
}) => state.socketBrain.badge;
export default socketBrainSlice.reducer;
