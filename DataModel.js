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
    this.exercises = {};
    this.foods = {};
    this.exerciseRecords = [];
    this.foodRecords = [];
    this.dailyStats = [];

    this.asyncInit();
  }

  asyncInit = async () => {
    this.loadUsers();
    await this.loadDailyStats();
    await this.loadExercises();
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

  loadExerciseRecords = async () => {
    let date = new Date();
    date.setHours(0,0,0,0);

    const query = new AV.Query('ExerciseRecords');
    query.equalTo('UserId', AV.Object.createWithoutData('_User',this.currentUser.objectId));
    query.greaterThanOrEqualTo('createdAt',date);

    //const query = AV.Query.and(query1, query2);
    let lists = await query.find();
    lists.forEach(record => {
      this.exerciseRecords.push(record.toJSON());
      console.log( this.exerciseRecords);
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
    //console.log('loadUser - the result of query.find() is:', lists);
    lists.forEach(record => {
      this.users.push(record.toJSON());
    });
    //console.log('loadUser - Local model changed to:', this.users);
  }

  loadExercises = async () => {
    const query = new AV.Query('Exercises');
    let lists = await query.find();
    console.log('loadExercises - the result of query.find() is:', lists);
    lists.forEach(item => {
      this.exercises[item.objectId] = item;
    });
  }

  getUsers = () => {
    return this.users;
  }

  createUser = async (email, pass, dispName, gender, age, wt) => {

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


    newUser = await user.signUp().then((user) => {
      // 注册成功
      console.log(`注册成功。objectId：${user.id}`);
      return user;
    }, (error) => {
      // 注册失败（通常是因为用户名已被使用）
      return null;
    });
    
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

  

}


let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}