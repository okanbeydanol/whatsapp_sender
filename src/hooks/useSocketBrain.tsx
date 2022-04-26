import {batch, useDispatch, useSelector} from 'react-redux';
import {io} from 'socket.io-client';

import {
  USER_ALL_MESSAGES_DELIVERED_ROOM,
  USER_BADGE,
  USER_BADGE_TOTAL,
  USER_CONNECT,
  USER_MESSAGE_DELIVERED_ROOM,
  USER_MESSAGE_READ_ROOM,
  USER_MESSAGE_SEND_ROOM,
  USER_RETRIVE_CONVERSATIONS,
  USER_RETRIVE_MESSAGES,
  USER_RETRIVE_STATUS,
  USER_STATUS_CHANGE,
  USER_STATUS_CHANGE_ROOM,
  USER_UPDATE_PROFILE,
} from '../constants';
import moment from 'moment';
import {
  slice_user_retrive_badge,
  slice_user_retrive_conversations,
  slice_user_retrive_messages,
  slice_user_retrive_status,
  slice_user_retrive_badge_total_update,
} from '../store/slices/socket/socket-brain';
import {getLoginStore} from '../store/slices/login';
import {AppState, AppStateStatus, NativeEventSubscription} from 'react-native';
import uuid from 'react-native-uuid';
import {OwnerResponse} from '../utils/native-contact';

const useSocketBrain = () => {
  const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    transports: ['websocket'],
  };
  const socket = io('http://192.168.1.20:1414', connectionConfig);
  let appState: NativeEventSubscription;
  const dispatch = useDispatch();
  const loginStore = useSelector(getLoginStore);

  const user_connect = (ownerData: OwnerResponse) => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit(USER_CONNECT, ownerData);
  };

  const user_send_status_change = (status: number) => {
    socket.emit(USER_STATUS_CHANGE_ROOM, {
      nounGuid: loginStore.userGuid,
      status: status,
      time: moment(),
    });
  };

  const user_send_all_delivered_info = () => {
    socket.emit(USER_ALL_MESSAGES_DELIVERED_ROOM, {
      ownerGuid: loginStore.userGuid,
    });
  };

  const user_send_delivered_info = (nounGuid: any) => {
    socket.emit(USER_MESSAGE_DELIVERED_ROOM, {
      ownerGuid: loginStore.userGuid,
      nounGuid,
    });
  };

  const user_listen_status_change = () => {
    if (!socket.hasListeners(USER_STATUS_CHANGE + '-' + loginStore.userGuid)) {
      socket.on(
        USER_STATUS_CHANGE + '-' + loginStore.userGuid,
        (status: any) => {
          dispatch(slice_user_retrive_status(status));
        },
      );
    }
  };

  const user_get_badge = () => {
    socket.emit(USER_BADGE_TOTAL, (total: any) => {
      dispatch(slice_user_retrive_badge_total_update(total));
    });
  };

  const user_listen_badge = () => {
    if (!socket.hasListeners(USER_BADGE + '-' + loginStore.userGuid)) {
      socket.on(USER_BADGE + '-' + loginStore.userGuid, (badge: any) => {
        batch(() => {
          dispatch(slice_user_retrive_badge(badge));
        });
      });
    }
  };

  const user_retrive_conversations = () => {
    socket.emit(
      USER_RETRIVE_CONVERSATIONS,
      {ownerGuid: loginStore.userGuid},
      (conversations: any) => {
        dispatch(slice_user_retrive_conversations(conversations));
      },
    );
  };

  const user_send_read_info = (data: any) => {
    const readTime = moment();
    data.readTime = readTime;
    data.readStatus = true;
    data.delivered = true;
    data.ownerGuid = loginStore.userGuid;
    socket.emit(USER_MESSAGE_READ_ROOM, data);
  };

  const user_send_message = (data: any) => {
    return new Promise(resolve => {
      const messageGuid = uuid.v4();
      const sendTime = moment();

      const messageData = {
        friendGuid: data.friendGuid,
        messageGuid,
        text: data.text,
        ownerGuid: loginStore.userGuid,
        nounGuid: data.nounGuid,
        readStatus: false,
        delivered: false,
        sendTime,
        readTime: null,
        type: 'text',
      };
      resolve(messageData);
      socket.emit(USER_MESSAGE_SEND_ROOM, messageData);
    });
  };

  const user_get_messages = (nounGuid: string) => {
    socket.emit(
      USER_RETRIVE_MESSAGES,
      {nounGuid, ownerGuid: loginStore.userGuid},
      (messages: any) => {
        dispatch(slice_user_retrive_messages(messages));
      },
    );
  };
  const user_get_status = (nounGuid: string) => {
    socket.emit(USER_RETRIVE_STATUS, nounGuid, (status: any) => {
      console.log(
        '%c  USER_RETRIVE_STATUS',
        'background: #222; color: #bada55',
        status,
      );
      dispatch(slice_user_retrive_status(status));
    });
  };

  const user_listen_app_state = () => {
    if (typeof appState === 'undefined') {
      appState = AppState.addEventListener(
        'change',
        (state: AppStateStatus) => {
          if (state === 'background') {
            user_send_status_change(0);
          } else if (state === 'active') {
            user_send_status_change(1);
          }
        },
      );
    }
  };

  const user_update_profile = (ownerData: OwnerDataResponse) => {
    socket.emit(USER_UPDATE_PROFILE, ownerData, (callback: any) => {
      dispatch(slice_user_update_profile(callback));
    });
  };
  return {
    user_connect,
    user_listen_status_change,
    user_listen_app_state,
    user_get_status,
    user_send_status_change,
    user_get_badge,
    user_get_messages,
    user_retrive_conversations,
    user_send_delivered_info,
    user_send_all_delivered_info,
    user_send_read_info,
    user_send_message,
    user_listen_badge,
    user_update_profile,
  };
};

export default useSocketBrain;
