let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
var users = [];
var messages = [];
var friends = [];
var conversations = [];
const CONNECTION = 'connection';
const ERROR = 'error';
const USER_CONNECT = 'user_connect';

//Socket Retrieve DATA
const USER_OWNER_DATA = 'user_owner_data';
const USER_BADGE = 'user_badge';
const USER_BADGE_TOTAL = 'user_badge_total';
const USER_RETRIVE_CONVERSATIONS = 'user_retrieve_conversations';
const USER_MESSAGE_RECEIVE = 'user_message_receive';
const USER_MESSAGE_SEND_ROOM = 'user_message_send_room';
const USER_MESSAGE_DELIVERED_ROOM = 'user_message_delivered_room';
const USER_ALL_MESSAGES_DELIVERED_ROOM = 'user_all_messages_delivered';
const USER_MESSAGE_DELIVERED = 'user_message_delivered';
const USER_MESSAGE_READ_ROOM = 'user_message_read_room';
const USER_MESSAGE_READ = 'user_message_read';
const USER_MESSAGES_ROOM = 'user_messages_room';
const USER_MESSAGES = 'user_messages';
const USER_RETRIVE_MESSAGES = 'user_retrive_messages';
const USER_STATUS_CHANGE_ROOM = 'user_status_change_room';
const USER_STATUS_CHANGE = 'user_status_change';
const USER_RETRIVE_STATUS = 'user_retrive_status';
const USER_FRIENDS = 'user_friends';
const USER_FRIEND = 'user_friend';
const USER_CONTACT_DATA = 'user_contact_data';
const USER_UPDATE_PROFILE = 'user_update_profile';

io.on(CONNECTION, socket => {
  socket.on(USER_CONNECT, userData => {
    socket.ownerGuid = userData.ownerGuid;
    var ownerGuid = userData.ownerGuid;
    const findFriends = friends.filter(o => o.ownerGuid === userData.ownerGuid);
    const find = users.find(o => o.ownerGuid === userData.ownerGuid);
    if (find) {
      find.ownerGuid = userData.ownerGuid;
      find.name = userData.name;
      find.lastName = userData.lastName;
      find.fullName = userData.fullName;
      find.areaCode = userData.areaCode;
      find.digit = userData.digit;
      find.countryCode = userData.countryCode;
      find.image = userData.image;
      find.friends = findFriends;
      find.connected = true;
      find.status = 1;
    } else {
      users.push({
        ownerGuid: ownerGuid,
        name: userData.name,
        lastName: userData.lastName,
        fullName: userData.fullName,
        areaCode: userData.areaCode,
        digit: userData.digit,
        image: userData.image,
        countryCode: userData.countryCode,
        friends: findFriends,
        connected: true,
        status: 1,
      });
    }
  });
  socket.on(ERROR, err => {
    console.log('error', err);
  });
  socket.on(USER_OWNER_DATA, callback => {
    callback(false);
  });
  socket.on(USER_RETRIVE_CONVERSATIONS, ({ownerGuid}, callback) => {
    const findConversations = conversations.filter(
      o => o.ownerGuid === ownerGuid,
    );
    findConversations.forEach(conversation => {
      const find = users.find(o => o.ownerGuid === conversation.nounGuid);
      if (find) {
        conversation.nounInfo = {
          name: find.name,
          lastName: find.lastName,
          fullName: find.fullName,
          image: find.image,
          digit: find.digit,
          countryCode: find.countryCode,
          areaCode: find.areaCode,
          connected: find.connected,
          status: find.status,
        };
      } else {
        conversation.nounInfo = null;
      }
    });
    callback(findConversations);
  });
  socket.on(USER_RETRIVE_MESSAGES, ({nounGuid, ownerGuid}, callback) => {
    const SearchMessages = messages.filter(
      o =>
        (o.ownerGuid === ownerGuid && o.nounGuid === nounGuid) ||
        (o.nounGuid === ownerGuid && o.ownerGuid === nounGuid),
    );
    callback(SearchMessages);
  });
  socket.on(USER_MESSAGE_SEND_ROOM, data => {
    send_message(data).then(() => {
      notification_count_handler({
        friendGuid: data.friendGuid,
        nounGuid: data.nounGuid,
        ownerGuid: data.ownerGuid,
      });
    });
  });

  socket.on(USER_ALL_MESSAGES_DELIVERED_ROOM, ({ownerGuid}) => {
    const searchMessages = messages.filter(
      o =>
        o.nounGuid === ownerGuid &&
        o.delivered === false &&
        o.readStatus === false &&
        o.readTime === null,
    );
    searchMessages.forEach(message => {
      message.delivered = true;
      io.emit(
        USER_MESSAGE_DELIVERED + '-' + message.ownerGuid,
        message.ownerGuid,
      );
    });
  });

  socket.on(USER_MESSAGE_DELIVERED_ROOM, ({ownerGuid, nounGuid}) => {
    const searchMessages = messages.filter(
      o =>
        o.nounGuid === ownerGuid &&
        o.delivered === false &&
        o.readStatus === false &&
        o.readTime === null,
    );
    searchMessages.forEach(message => {
      message.delivered = true;
    });
    console.log(
      '%c  data.ownerGuid',
      'background: #222; color: #bada55',
      ownerGuid,
    );
    console.log(
      '%c  data.nounGuid',
      'background: #222; color: #bada55',
      nounGuid,
    );
    io.emit(USER_MESSAGE_DELIVERED + '-' + nounGuid, ownerGuid);
  });
  socket.on(USER_MESSAGES_ROOM, guidS => {
    const SearchMessages = [...messages].filter(
      o =>
        (o.nounGuid === guidS.nounGuid && o.ownerGuid === guidS.ownerGuid) ||
        (o.ownerGuid === guidS.nounGuid && o.nounGuid === guidS.ownerGuid),
    );
    io.emit(USER_MESSAGES + '-' + guidS.ownerGuid, SearchMessages);
  });
  socket.on(USER_MESSAGE_READ_ROOM, data => {
    const searchMessages = messages.filter(
      o =>
        o.nounGuid === data.ownerGuid &&
        o.ownerGuid === data.nounGuid &&
        o.readStatus === false &&
        o.readTime === null,
    );
    searchMessages.forEach(message => {
      message.readTime = data.readTime;
      message.delivered = true;
      message.readStatus = true;
    });
    io.emit(USER_MESSAGE_READ + '-' + data.nounGuid, data.ownerGuid);
    notification_count_handler({
      nounGuid: data.ownerGuid,
      ownerGuid: data.nounGuid,
      friendGuid: data.friendGuid,
    });
  });
  socket.on(USER_STATUS_CHANGE_ROOM, data => {
    const index = users.findIndex(o => o.ownerGuid === data.nounGuid);
    if (index !== -1) {
      users[index].status = data.status;
      users[index].time = data.time;

      data.image = users[index].image;
      data.fullName = users[index].fullName;
      users[index].friends.forEach(friend => {
        io.emit(USER_STATUS_CHANGE + '-' + friend.nounGuid, data);
      });
    }
  });
  socket.on(USER_RETRIVE_STATUS, (nounGuid, callback) => {
    const findIndex = users.findIndex(o => o.ownerGuid === nounGuid);

    if (findIndex !== -1) {
      const data = {
        nounGuid: nounGuid,
        status: users[findIndex].status,
        time: users[findIndex].time,
        image: users[findIndex].image,
        fullName: users[findIndex].fullName,
      };
      callback(data);
    } else {
      callback([]);
    }
  });

  socket.on('typing', data => {
    io.emit('typing-' + data.ownerGuid + '-' + data.nounGuid);
  });
  socket.on('disconnect', () => {});
  socket.on(USER_FRIENDS, callback => {
    const findFriends = friends.filter(o => o.ownerGuid === socket.ownerGuid);
    const contacts = [];
    findFriends.forEach(friend => {
      const find = users.find(o => o.ownerGuid === friend.nounGuid);
      if (find) {
        contacts.push({
          contactGuid: find.ownerGuid,
          name: find.name,
          lastName: find.lastName,
          fullName: find.fullName,
          image: find.image,
          digit: find.digit,
          countryCode: find.countryCode,
          areaCode: find.areaCode,
          connected: find.connected,
          status: find.status,
        });
      }
    });
    callback(contacts);
  });

  socket.on(USER_FRIEND, ({nounGuid, ownerGuid}, callback) => {
    let find = friends.find(
      o => o.ownerGuid === ownerGuid && o.nounGuid === nounGuid,
    );
    let findNoun = friends.find(
      o => o.ownerGuid === nounGuid && o.nounGuid === ownerGuid,
    );
    if (!find) {
      const user = users.find(o => o.ownerGuid === nounGuid);
      const user2 = users.find(o => o.ownerGuid === ownerGuid);

      find = {
        friendGuid: findNoun ? findNoun.friendGuid : generateUUID(),
        ownerGuid: ownerGuid,
        nounGuid: nounGuid,
        fullName: user.fullName,
        image: user.image,
        digit: user.digit,
        countryCode: user.countryCode,
        areaCode: user.areaCode,
        connected: user.connected,
        status: user.status,
      };

      user2.friends.push(find);
      friends.push(find);
    } else {
      const user = users.find(o => o.ownerGuid === nounGuid);
      find.fullName = user.fullName;
      find.name = user.name;
      find.lastName = user.lastName;
      find.image = user.image;
      find.digit = user.digit;
      find.countryCode = user.countryCode;
      find.areaCode = user.areaCode;
      find.connected = user.connected;
      find.status = user.status;
    }

    if (!findNoun) {
      const user2 = users.find(o => o.ownerGuid === nounGuid);
      const user = users.find(o => o.ownerGuid === ownerGuid);

      findNoun = {
        friendGuid: find ? find.friendGuid : generateUUID(),
        ownerGuid: nounGuid,
        nounGuid: ownerGuid,
        fullName: user.fullName,
        image: user.image,
        digit: user.digit,
        countryCode: user.countryCode,
        areaCode: user.areaCode,
        connected: user.connected,
        status: user.status,
      };
      user2.friends.push(findNoun);
      friends.push(findNoun);
    } else {
      const user = users.find(o => o.ownerGuid === ownerGuid);
      find.fullName = user.fullName;
      find.name = user.name;
      find.lastName = user.lastName;
      find.image = user.image;
      find.digit = user.digit;
      find.countryCode = user.countryCode;
      find.areaCode = user.areaCode;
      find.connected = user.connected;
      find.status = user.status;
    }

    callback(find);
  });

  socket.on(USER_CONTACT_DATA, (phones, callback) => {
    let contact = null;
    if (phones && phones.length > 0) {
      phones.forEach(phone => {
        const findIndex = users.findIndex(
          o =>
            o.countryCode === phone.countryCode &&
            o.digit === phone.digit &&
            o.areaCode === phone.areaCode,
        );
        if (findIndex !== -1 && contact === null) {
          return (contact = users[findIndex]);
        }
      });
    }
    callback(contact);
  });
  socket.on(USER_BADGE_TOTAL, callback => {
    const totalUnreadMessageCountMe = messages.filter(
      o => o.nounGuid === socket.ownerGuid && o.readStatus === false,
    );
    callback(totalUnreadMessageCountMe.length);
  });

  socket.on(USER_UPDATE_PROFILE, (userData, callback) => {
    const find = users.find(o => o.ownerGuid === userData.ownerGuid);
    if (find) {
      find.name = userData.name;
      find.lastName = userData.lastName;
      find.fullName = userData.fullName;
      find.areaCode = userData.areaCode;
      find.digit = userData.digit;
      find.countryCode = userData.countryCode;
      find.image = userData.image;
      callback(find);
    }
  });

  function generateUUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
      },
    );
    return uuid;
  }

  //Functions
  function send_message(data) {
    return new Promise(function (resolve, reject) {
      const message = {
        friendGuid: data.friendGuid,
        messageGuid: data.messageGuid,
        nounGuid: data.nounGuid,
        ownerGuid: data.ownerGuid,
        readStatus: false,
        sendTime: data.sendTime,
        readTime: data.readTime,
        delivered: false,
        type: data.type,
      };
      if (message.type === 'text') {
        message.text = data.text;
      }
      if (message.type === 'media') {
        message.buffer = data.buffer;
      }
      messages.push(message);
      io.emit(USER_MESSAGE_RECEIVE + '-' + data.nounGuid, message);
      resolve(true);
    });
  }

  function notification_count_handler(data) {
    const findConversation = conversations.find(
      o =>
        o.friendGuid === data.friendGuid &&
        o.nounGuid === data.nounGuid &&
        o.ownerGuid === data.ownerGuid,
    );
    const findMessages = messages.filter(
      o => o.nounGuid === data.nounGuid && o.ownerGuid === data.ownerGuid,
    );
    const findMessagesMe = messages.filter(
      o => o.nounGuid === data.ownerGuid && o.ownerGuid === data.nounGuid,
    );
    const unreadMessageCountMe = findMessagesMe.filter(
      o => o.readStatus === false,
    );
    const totalUnreadMessageCount = messages.filter(
      o => o.nounGuid === data.ownerGuid && o.readStatus === false,
    );
    if (!findConversation) {
      const conversation = {
        friendGuid: data.friendGuid,
        ownerGuid: data.ownerGuid,
        nounGuid: data.nounGuid,
        messageCount: findMessagesMe.length + findMessages.length,
        unreadMessageCount: unreadMessageCountMe.length,
        totalUnreadMessageCount: totalUnreadMessageCount.length,
        lastMessage:
          findMessages.length > 0
            ? findMessages[findMessages.length - 1]
            : null,
      };
      const find = users.find(o => o.ownerGuid === conversation.nounGuid);
      if (find) {
        conversation.nounInfo = {
          name: find.name,
          lastName: find.lastName,
          fullName: find.fullName,
          image: find.image,
          digit: find.digit,
          countryCode: find.countryCode,
          areaCode: find.areaCode,
          connected: find.connected,
          status: find.status,
        };
      } else {
        conversation.nounInfo = null;
      }

      conversations.push(conversation);
      io.emit(USER_BADGE + '-' + conversation.ownerGuid, conversation);
    } else {
      findConversation.messageCount =
        findMessagesMe.length + findMessages.length;
      findConversation.unreadMessageCount = unreadMessageCountMe.length;
      findConversation.totalUnreadMessageCount = totalUnreadMessageCount.length;
      findConversation.lastMessage =
        findMessages.length > 0 ? findMessages[findMessages.length - 1] : null;

      const find = users.find(o => o.ownerGuid === findConversation.nounGuid);
      if (find) {
        findConversation.nounInfo = {
          name: find.name,
          lastName: find.lastName,
          fullName: find.fullName,
          image: find.image,
          digit: find.digit,
          countryCode: find.countryCode,
          areaCode: find.areaCode,
          connected: find.connected,
          status: find.status,
        };
      } else {
        findConversation.nounInfo = null;
      }

      io.emit(USER_BADGE + '-' + findConversation.ownerGuid, findConversation);
    }

    const findConversationMe = conversations.find(
      o =>
        o.friendGuid === data.friendGuid &&
        o.nounGuid === data.ownerGuid &&
        o.ownerGuid === data.nounGuid,
    );
    const unreadMessageCount = findMessages.filter(o => o.readStatus === false);
    const totalUnreadMessageCountMe = messages.filter(
      o => o.nounGuid === data.nounGuid && o.readStatus === false,
    );
    if (!findConversationMe) {
      const conversation = {
        friendGuid: data.friendGuid,
        ownerGuid: data.nounGuid,
        nounGuid: data.ownerGuid,
        messageCount: findMessagesMe.length + findMessages.length,
        unreadMessageCount: unreadMessageCount.length,
        totalUnreadMessageCount: totalUnreadMessageCountMe.length,
        lastMessage:
          findMessages.length > 0
            ? findMessages[findMessages.length - 1]
            : null,
      };
      const find = users.find(o => o.ownerGuid === conversation.nounGuid);
      if (find) {
        conversation.nounInfo = {
          name: find.name,
          lastName: find.lastName,
          fullName: find.fullName,
          image: find.image,
          digit: find.digit,
          countryCode: find.countryCode,
          areaCode: find.areaCode,
          connected: find.connected,
          status: find.status,
        };
      } else {
        conversation.nounInfo = null;
      }
      conversations.push(conversation);
      io.emit(USER_BADGE + '-' + conversation.ownerGuid, conversation);
    } else {
      findConversationMe.messageCount =
        findMessagesMe.length + findMessages.length;
      findConversationMe.unreadMessageCount = unreadMessageCount.length;
      findConversationMe.lastMessage =
        findMessages.length > 0 ? findMessages[findMessages.length - 1] : null;
      findConversationMe.totalUnreadMessageCount =
        totalUnreadMessageCountMe.length;
      io.emit(
        USER_BADGE + '-' + findConversationMe.ownerGuid,
        findConversationMe,
      );
    }
  }
});
var port = 1414;
http.listen(port, () => {
  console.log('port:', port);
});
