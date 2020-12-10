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

    this.users = {};
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
    await this.loadExercises();
    await this.loadFoods();
    console.log("DailyStats loaded successfully!");
    //this.subscribeToChats();
  }

  loadDailyStats = async () => {
    let date = new Date();
    date.setHours(0,0,0,0);

    const query = new AV.Query('Daily_Stats');
    query.greaterThanOrEqualTo('createdAt',date);
    let lists = await query.find();
    
    lists.forEach(record => {
      let i = record.toJSON();
      this.dailyStats[i.user.objectId] = i;
    });
    console.log('loadDailyStats - the result of query.find() is:' + String(this.dailyStats));
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
      // this.users.push(record.toJSON());
      let i = record.toJSON();
      this.users[i.objectId] = i;
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

  createUser = async (email, pass, dispName, gender, age, wt, ht, activeType) => {

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
    user.set('height', ht);
    user.set('activeType', activeType);
    var recommendCalorie = this.calculateRecommendDailyCalorie(gender, age, wt, ht, activeType);
    user.set('recommendCalorie', recommendCalorie);
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

  updateUserProfile = async (userId, dispName, gender, age, wt, ht, activeType) => {
    const user = AV.Object.createWithoutData('_User', userId);
    user.set('age',  age);
    user.set('gender', gender);
    user.set('weight', wt);
    user.set('height', ht);
    user.set('username', dispName);
    user.set('activeType', activeType);
    var recommendCalorie = this.calculateRecommendDailyCalorie(gender, age, wt, ht, activeType);
    user.set('recommendCalorie', recommendCalorie);
    await user.save().then((updatedUser) => {
      this.users.push(updatedUser.toJSON());
      let thisUser = updatedUser.toJSON();
      this.users[thisUser.objectId] = thisUser;
      this.currentUser = updatedUser;
    }, (error) => {
      console.log(error)
    });
  }

  /**
   * The Basal Metabolic Rate (BMR) is the amount of energy 
   * (calories) your body needs while resting. 
   * This accounts for about 60 to 70 percent of calories burned in a day. 
   * In general, men have a higher BMR than women. 
   * The Mifflin-St Jeor Equation is considered the most accurate equation for calculating BMR 
   * For men:   BMR = 10W + 6.25H - 5A + 5
   * For women: BMR = 10W + 6.25H - 5A - 161
   * where:
      W is body weight in kg
      H is body height in cm
      A is age
    To determine your total daily calorie needs, multiply your BMR by the appropriate activity factor, as follows:
    sedentary (little or no exercise) : Calorie-Calculation = BMR x 1.2
    lightly active (light exercise/sports 1-3 days/week) : Calorie-Calculation = BMR x 1.375
    moderately active (moderate exercise/sports 3-5 days/week) : Calorie-Calculation = BMR x 1.55
    very active (hard exercise/sports 6-7 days a week) : Calorie-Calculation = BMR x 1.725
    extra active (very hard exercise/sports & physical job or 2x training) : Calorie-Calculation = BMR x 1.9
   */
  calculateRecommendDailyCalorie = (gender, age, wt, ht, activeType) => {
    // let wtInLb = wt * 2.2046;
    // let htInInch = ht * 39.3701;
    var BMR = 0;
    if (gender == 'male') {
      BMR = 10 * wt + 6.25 * ht - 5 * age + 5;
    } else{
      BMR = 10 * wt + 6.25 * ht - 5 * age - 161;
    }
    switch(activeType) {
      case 'sedentary':
        BMR *= 1.2;
        break;
      case 'lightly active':
        BMR *= 1.375;
        break;
      case 'moderately active':
        BMR *= 1.55;
        break;
      case 'very active':
        BMR *= 1.725;
        break;
      case 'extra active':
        BMR *= 1.9
        break;
      default:
        // if no record for activeType, assume lightly active
        BMR *= 1.375;
    }
    return BMR;
  }

  /**
   * output: a sorted list contains username and steps
   * example: [['John',10000],['Steve', 8000],['Chris', 5000]]
   */
  getRankedList = () => {
    // convert this.dailyStats to array and then sort based on steps
    var sortable = [];
    for (var id in this.dailyStats) {
      var userId = this.dailyStats[id].user;
      var username = this.users[userId];
      sortable.push([username, this.dailyStats[id].steps]);
    }
    sortable.sort(function(a, b) {
      return b[1] - a[1];
    });
    return sortable;
  }

  getUserForID = (id) => {
    return this.users[id];
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
    let recordExists = this.currentUser.objectId in this.dailyStats;
    
    if (!recordExists){
      item = new AV.Object('Daily_Stats');
      // 'user' is a pointer that points to the current user
      let user = AV.Object.createWithoutData('_User', this.currentUser.objectId);
      item.set('user', user);
      item.set('date', String(start));
      item.set('steps', 0);
    } else {
      item = AV.Object.createWithoutData('Daily_Stats', this.dailyStats[this.currentUser.objectId].objectId);
    }
    let calories = 0
    for (let record of Object.values(this.exerciseRecords)){
      calories -= record.Duration * (this.exercises[record.ExerciseId.objectId].MET * 3.5 * this.currentUser.weight) / 200.0;
    }
    for (let record of Object.values(this.foodRecords)){
      calories += record.Quantity * (1.0 * this.foods[record.FoodId.objectId].Calorie) ;
    }

    console.log(recordExists);
    console.log('calories cal: ' + calories);

    item.set('calorie',calories);
    await item.save().then((record) => {
      let i = record.toJSON();
      this.dailyStats[this.currentUser.objectId] = i;
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