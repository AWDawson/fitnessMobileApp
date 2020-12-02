import firebase from 'firebase';
import '@firebase/firestore';
import '@firebase/storage';
import { firebaseConfig } from './Secrets';

import AV from 'leancloud-storage/core';
import * as adapters from '@leancloud/platform-adapters-react-native';
import { config } from './leanCloudConfig'



class DataModel {
  constructor() {
    if (firebase.apps.length === 0) { // aka !firebase.apps.length
      firebase.initializeApp(firebaseConfig);
    }
    AV.setAdapters(adapters);
    AV.init(config);


    this.usersRef = firebase.firestore().collection('users');
    this.chatsRef = firebase.firestore().collection('chats');
    this.storageRef = firebase.storage().ref();

    this.users = [];
    this.currentUser = {};
    this.exerciseRecords = [];
    this.foodRecords = [];
    this.dailyStats = [];

    this.chats = [];
    this.chatListeners = [];
    this.asyncInit();
  }

  asyncInit = async () => {
    this.loadUsers();
    this.loadChats();
    await this.loadDailyStats();
    console.log("DailyStats loaded successfully!");
    //this.subscribeToChats();
  }

  loadDailyStats = async () => {
    const query = new AV.Query('Daily_Stats');
    let lists = await query.find();
    console.log('loadDailyStats - the result of query.find() is:', lists);
    lists.forEach(record => {
      this.dailyStats.push(record.toJSON());
    });
  }

  loadUsers = async () => {
    // let querySnap = await this.usersRef.get();
    // querySnap.forEach(qDocSnap => {
    //   let key = qDocSnap.id;
    //   let data = qDocSnap.data();
    //   data.key = key;
    //   this.users.push(data);
    // });

    const query = new AV.Query('_User');
    let lists = await query.find();
    console.log('loadUser - the result of query.find() is:', lists);
    lists.forEach(record => {
      this.users.push(record.toJSON());
    });
    console.log('loadUser - Local model changed to:', this.users);
  }

  getUsers = () => {
    return this.users;
  }

  createUser = async (email, pass, dispName, wt, gender, age) => {

    // 创建实例
    const user = new AV.User();

    // 等同于 user.set('username', 'Tom')
    user.setUsername(dispName);
    user.setPassword(pass);

    // 可选
    user.setEmail(email);

    // 设置其他属性的方法跟 AV.Object 一样
    user.set('gender', gender);
    user.set('age', age);
    user.set('weight', wt);


    await user.signUp();
    console.log(`注册成功。objectId：${user.id}`);
    console.log(user);

    this.users.push(user);
    return newUser;
  }

  getUserForID = (id) => {
    for (let user of this.users) {
      if (user.key === id) {
        return user;
      }
    }
    // will return undefined. No haiku this time...
  }

  loadChats = async () => {
    let querySnap = await this.chatsRef.get();
    querySnap.forEach(async qDocSnap => {
      let data = qDocSnap.data();
      let thisChat = {
        key: qDocSnap.id,
        participants: [],
        messages: []
      }
      for (let userID of data.participants) {
        let user = this.getUserForID(userID);
        thisChat.participants.push(user);
      }

      let messageRef = qDocSnap.ref.collection("messages");
      let messagesQSnap = await messageRef.get();
      messagesQSnap.forEach(qDocSnap => {
        let messageData = qDocSnap.data();
        messageData.author = this.getUserForID(messageData.author);
        messageData.key = qDocSnap.id;
        thisChat.messages.push(messageData);
      });
      this.chats.push(thisChat);
    });
  }  

  subscribeToChat = (chat, notifyOnUpdate) => {
    this.chatSnapshotUnsub = this.chatsRef.doc(chat.key)
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot((querySnap) => {
        chat.messages = [];
        querySnap.forEach((qDocSnap) => {
          let messageObj = qDocSnap.data();
          messageObj.key = qDocSnap.id;
          messageObj.author = this.getUserForID(messageObj.author);
          chat.messages.push(messageObj);
        });
        notifyOnUpdate(); // call back to the subscriber
    });
  }

  unsubscribeFromChat = (chat) => {
    // don't really need 'chat' but could need it in the future
    if (this.chatSnapshotUnsub) {
      this.chatSnapshotUnsub();
    }
  }

  addChatListener = (listener, chatID) => {
    this.subscribeToChat(chatID);
    this.chatListeners.push({
      listener: listener,
      chatID: chatID
    });
  }

  notifyChatListeners = (_chatID) => {
    this.chatListeners.forEach(({listener, chatID}) => {
      if (chatID === _chatID) {
        listener.onChatUpdate();
      }
    });
  }

  getOrCreateChat = async (user1, user2) => {

    // look for this chat in the existing data model 'chats' array
    // if it's here, we know it's already in Firebase
    for (let chat of this.chats) {
      // we need to use user keys to look for a match
      // and we need to check for each user in each position
      if (( chat.participants[0].key === user1.key && 
            chat.participants[1].key === user2.key) ||
          ( chat.participants[0].key === user2.key &&
            chat.participants[1].key === user1.key)){
        return chat; // if found, return it and we're done
      }
    }

    // chat not found, gotta create it. Create an object for the FB doc
    let newChatDocData = { participants: [user1.key, user2.key] };
    // add it to firebase
    let newChatDocRef = await this.chatsRef.add(newChatDocData);
    // create a local chat object with full-fledged user objects (not just keys)
    let newChat = {
      participants: [user1, user2],
      key: newChatDocRef.id, // use the Firebase ID
      messages: []
    }
    // add it to the data model's chats, then return it
    this.chats.push(newChat);
    return newChat;
  }

  getChatForID = (id) => {
    for (let chat of this.chats) {
      if (chat.key === id) {
        return chat;
      }
    }
    // the chat was not found
    // should throw an error prob'ly
    // return undefined
    // [[almost accidental haiku]]
  }

  addChatMessage = async (chatID, message) => { // doesn't need to be async?

    let messagesRef = this.chatsRef.doc(chatID).collection('messages');

    let fbMessageObject = {
      type: 'text',
      text: message.text,
      timestamp: message.timestamp,
      author: message.author.key,
    }

    messagesRef.add(fbMessageObject); // onSnapshot will update local model
  }

  addChatImage = async (chat, author, imageObject) => {
    let messagesRef = this.chatsRef.doc(chat.key).collection('messages');

    let fileName = '' + Date.now();
    let imageRef = this.storageRef.child(fileName);

    let response = await fetch(imageObject.uri);
    let imageBlob = await response.blob();

    // then upload it to Firebase Storage
    await imageRef.put(imageBlob);

    // ... and update the current image Document in Firestore
    let downloadURL = await imageRef.getDownloadURL();

    let fbMessageObject = {
      type: 'image',
      imageURL: downloadURL,
      timestamp: Date.now(),
      author: author.key,
      width: imageObject.width,
      height: imageObject.height
    }

    messagesRef.add(fbMessageObject);
  }

}


let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}