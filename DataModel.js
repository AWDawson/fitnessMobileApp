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
    this.exerciseRecords = {};
    this.foodRecords = {};
    this.dailyStats = {};

    this.asyncInit();
  }

  asyncInit = async () => {
    this.loadUsers();
    await this.loadDailyStats();
    await this.loadExercises();
    await this.loadFoods();
    console.log("DailyStats loaded successfully!");
    //this.subscribeToChats();
  }

  loadDailyStats = async () => {
    const query = new AV.Query('Daily_Stats');
    let lists = await query.find();
    console.log('loadDailyStats - the result of query.find() is:', lists);
    lists.forEach(record => {
      let i = record.toJSON();
      this.dailyStats[i.objectId] = i;
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
      this.exerciseRecords[record.id] = record.toJSON();
      console.log( this.exerciseRecords);
    });
  }

  loadFoodRecords = async () => {
    let date = new Date();
    date.setHours(0,0,0,0);

    const query = new AV.Query('FoodRecords');
    query.equalTo('UserId', AV.Object.createWithoutData('_User',this.currentUser.objectId));
    query.greaterThanOrEqualTo('createdAt',date);

    //const query = AV.Query.and(query1, query2);
    let lists = await query.find();
    lists.forEach(record => {
      this.foodRecords[record.id] = record.toJSON();
    });
  }

  loadUsers = async () => {
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
      let i = item.toJSON();
      console.log(i.objectId);
      this.exercises[i.objectId] = i;
    });
  }

  loadFoods = async () => {
    const query = new AV.Query('Foods');
    let lists = await query.find();
    console.log('loadExercises - the result of query.find() is:', lists);
    lists.forEach(item => {
      let i = item.toJSON();
      console.log(i.objectId);
      this.foods[i.objectId] = i;
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

  
  addExerciseRecord = async (exerciseId, duration) => {
    const ExerciseRecords = AV.Object.extend('ExerciseRecords');

    const exerciseRecord = new ExerciseRecords();

    exerciseRecord.set('UserId',  AV.Object.createWithoutData('_User',this.currentUser.objectId));
    exerciseRecord.set('ExerciseId',  AV.Object.createWithoutData('Exercises',exerciseId));
    exerciseRecord.set('Duration',  duration);

    await exerciseRecord.save().then((exerciseRecord) => {
      let record = exerciseRecord.toJSON();
      this.exerciseRecords[record.objectId] = record;
    }, (error) => {
      console.log(error)
    });

    await this.updateCalories();
  }
  
  addFoodRecord = async (foodId, quantity) => {
    const FoodRecords = AV.Object.extend('FoodRecords');

    const foodRecord = new FoodRecords();

    foodRecord.set('UserId',  AV.Object.createWithoutData('_User',this.currentUser.objectId));
    foodRecord.set('FoodId',  AV.Object.createWithoutData('Foods',foodId));
    foodRecord.set('Quantity',  quantity);

    await foodRecord.save().then((foodRecord) => {
      let record = foodRecord.toJSON();
      this.foodRecords[record.objectId] = record;
    }, (error) => {
      console.log(error)
    });

    await this.updateCalories();
  }

  updateExerciseRecord = async (recordId,exerciseId,duration) => {
    const record = AV.Object.createWithoutData('ExerciseRecords',recordId);
    record.set('ExerciseId',  AV.Object.createWithoutData('Exercises',exerciseId));
    record.set('Duration',  duration);
    await record.save().then((exerciseRecord) => {
      let record = exerciseRecord.toJSON();
      this.exerciseRecords[record.objectId] = record;
    }, (error) => {
      console.log(error)
    });

    await this.updateCalories();
  }

  updateFoodRecord = async (recordId,foodId,quantity) => {
    const record = AV.Object.createWithoutData('FoodRecords',recordId);
    record.set('FoodId',  AV.Object.createWithoutData('Foods',foodId));
    record.set('Quantity',  quantity);
    await record.save().then((foodRecord) => {
      let record = foodRecord.toJSON();
      this.foodRecords[record.objectId] = record;
    }, (error) => {
      console.log(error)
    });

    await this.updateCalories();
  }

  deleteExerciseRecord = async (recordId) => {
    const record = AV.Object.createWithoutData('ExerciseRecords',recordId);
    await record.destroy().then(() => {
      delete this.exerciseRecords[recordId];
    });

    await this.updateCalories();
  }
  
  deleteFoodRecord = async (recordId) => {
    const record = AV.Object.createWithoutData('FoodRecords',recordId);
    await record.destroy().then(() => {
      delete this.foodRecords[recordId];
    });

    await this.updateCalories();
  }

  updateCalories = async () => {
    var start = new Date();
    start.setHours(0,0,0,0);
    let item;
    let recordExists = false;
    for (let idx in this.dailyStats) {
        item = this.dailyStats[idx];
        if (item.user.objectId === this.currentUser.objectId && item.date === String(start)) {
          recordExists = true;
          break;
        }
    }
    if (!recordExists){
      item = new AV.Object('Daily_Stats');
      // 'user' is a pointer that points to the current user
      let user = AV.Object.createWithoutData('_User', this.currentUser.objectId);
      item.set('user', user);
      item.set('date', String(start));
      item.set('steps', 0);
    } else {
      item = AV.Object.createWithoutData('Daily_Stats', item.objectId);
    }
    let calories = 0
    for (let record of Object.values(this.exerciseRecords)){
      calories -= record.Duration * (this.exercises[record.ExerciseId.objectId].MET * 3.5 * this.currentUser.weight) / 200.0;
    }
    for (let record of Object.values(this.foodRecords)){
      calories += record.Quantity * (1.0 * this.foods[record.FoodId.objectId].Calorie) ;
    }

    item.set('calorie',calories);
    await item.save().then((record) => {
      let item = record.toJSON();
      this.dailyStats[item.objectId] = item;
    });
  }

}


let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}