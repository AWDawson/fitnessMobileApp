import React from 'react';
import { TextInput, Text, View, 
  Image, TouchableOpacity, KeyboardAvoidingView, Alert} 
  from 'react-native';

import { loginStyles } from './Styles';
import { getDataModel } from './DataModel';

import AV, { Query } from 'leancloud-storage/core';
import * as adapters from '@leancloud/platform-adapters-react-native';
import { config } from './leanCloudConfig'
import Fitness from '@ovalmoney/react-native-fitness';
import { Pedometer } from 'expo-sensors';



export class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();

    this.state = {
      mode: 'login',
      emailInput: '',
      displayNameInput: '',
      passwordInput: '',
      passwordCheckInput: '',
      genderInput:'',
      ageInput:'',
      weightInput:''
    }
  }

  onCreateAccount = async () => {

    // check that this is a valid email (skipping this)
    // check password rules (skipping this)
    // check that passwords match (skipping this)
    // check that displayName isn't empty (skipping this)

    // check that user doesn't already exist
    
    let newUser = await this.dataModel.createUser(
      this.state.emailInput,
      this.state.passwordInput,
      this.state.displayNameInput,
      this.state.genderInput,
      this.state.ageInput,
      this.state.weightInput
    );
    if (newUser === null){
      Alert.alert(
        'Duplicate User',
        'User ' + this.state.emailInput + ' already exists.',
        [{ text: 'OK',style: 'OK'}]
      );
      return;
    }

    this.props.navigation.navigate("Record", {
      currentUser: newUser,
      mode: "exercise"
    });
  }



  onLogin = async () => {

    let success =  await AV.User.loginWithEmail(this.state.emailInput, this.state.passwordInput).then((user) => {
      // 登录成功
      console.log("Login Success");
      this.dataModel.currentUser = user.toJSON();
      console.log(user);
      return true;
    }, (error) => {
      // 登录失败（可能是密码错误）
      Alert.alert(
        'Login Failed',
        'No match found for this email and password.',
        [{ text: 'OK',style: 'OK'}]
      );
      return false;
    });
    
    if (!success){
      return;
    }
    
    await this.dataModel.loadExerciseRecords();
    await this.dataModel.loadFoodRecords();


    // // set interval for step counts
    // var start = new Date();
    // start.setHours(0,0,0,0);
    // var end = new Date();
    // end.setHours(23,59,59,999);

    // // get step count
    // Pedometer.getStepCountAsync(start, end).then(
    //   result => {
    //     console.log('Step counter:', result.steps);

    //     // check if current user has today's daily stats record
    //     var ifRecordExists = false;
    //     for (let idx in this.dataModel.dailyStats) {
    //       let item = this.dataModel.dailyStats[idx];
    //       if (item.user.objectId === this.dataModel.currentUser.objectId && item.date === String(start)) {
    //         ifRecordExists = true;
    //         // update steps in local data model
    //         this.dataModel.dailyStats[idx].steps = result.steps;
    //         break;
    //       }
    //     }

    //     if (ifRecordExists) {
    //       // fetch the record
    //       console.log("Record found");
    //       var user = AV.Object.createWithoutData('_User', this.dataModel.currentUser.objectId);
    //       var query = new AV.Query('Daily_Stats').equalTo('date', String(start));
    //       query.first().then((dailyRecord) => {
    //         dailyRecord.set('steps', result.steps);
    //         dailyRecord.save();
    //       });
    //     } else {
    //       // create a new record
    //       console.log("Record not found");
    //       var dailyRecord = new AV.Object('Daily_Stats');
    //       // 'user' is a pointer that points to the current user
    //       var user = AV.Object.createWithoutData('_User', this.dataModel.currentUser.objectId);
    //       dailyRecord.set('user', user);
    //       dailyRecord.set('date', String(start));
    //       dailyRecord.set('steps', result.steps);
    //       dailyRecord.set('calorie', 0);
    //       dailyRecord.save();
    //       console.log("dailyRecord saved");
    //       let record = dailyRecord.toJSON();
    //       this.dataModel.dailyStats[record.objectId] = record;
    //     }
    //   },
    //   error => {
    //     Alert.alert(
    //       'Could not get stepCount' + error,
    //       [{ text: 'OK',style: 'OK'}]
    //     );
    //   }
    // );

    this.props.navigation.navigate("Record", {
        mode: "exercise"
    });
    
  }

  render() {
    return (
      <KeyboardAvoidingView 
        style={loginStyles.container}
        behavior={"height"}
        keyboardVerticalOffset={10}>
        <View style={loginStyles.topView}>
          <Image 
            source={require('./assets/logo.png')}
            style={loginStyles.logoImage}
          />
        </View>
        <View style={loginStyles.middleView}>
          <View style={loginStyles.inputRow}>
            <Text 
              style={loginStyles.inputLabel}
            >Email:</Text>
            <TextInput
              style={loginStyles.inputText}
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              autoCompleteType='email'
              textContentType='emailAddress'
              value={this.state.emailInput}
              onChangeText={(text)=>{this.setState({emailInput: text})}}
            />
          </View>
          {this.state.mode === 'create' ? (
            <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Display Name:</Text>
              <TextInput
                style={loginStyles.inputText}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.displayNameInput}
                onChangeText={(text)=>{this.setState({displayNameInput: text})}}
              />
            </View>
          ):(
            <View/>
          )}
          <View style={loginStyles.inputRow}>
            <Text style={loginStyles.inputLabel}>Password:</Text>
            <TextInput
              style={loginStyles.inputText}
              autoCapitalize='none'
              autoCorrect={false}
              textContentType='password'
              value={this.state.passwordInput}
              onChangeText={(text)=>{this.setState({passwordInput: text})}}
          />
          </View>
          {this.state.mode === 'create' ? (
            <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Re-enter Password:</Text>
              <TextInput
                style={loginStyles.inputText}
                autoCapitalize='none'
                autoCorrect={false}
                textContentType='password'  
                value={this.state.passwordCheckInput}
                onChangeText={(text)=>{this.setState({passwordCheckInput: text})}}
              />
            </View>
          ):(
            <View/>
          )}
          {this.state.mode === 'create' ? (
            <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Gender:</Text>
              <TextInput
                style={loginStyles.inputText}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.genderInput}
                onChangeText={(text)=>{this.setState({genderInput: text})}}
              />
            </View>
          ):(
            <View/>
          )}
          {this.state.mode === 'create' ? (
            <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Age:</Text>
              <TextInput
                style={loginStyles.inputText}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.ageInput}
                onChangeText={(text)=>{this.setState({ageInput: text})}}
              />
            </View>
          ):(
            <View/>
          )}
          {this.state.mode === 'create' ? (
            <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Weight:</Text>
              <TextInput
                style={loginStyles.inputText}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.weightInput}
                onChangeText={(text)=>{this.setState({weightInput: text})}}
              />
            </View>
          ):(
            <View/>
          )}
        </View>
        {this.state.mode === 'login' ? (

          <View style={loginStyles.bottomView}>
            <TouchableOpacity 
              style={loginStyles.buttonContainer}
              onPress={()=>{
                this.setState({mode: 'create'})
              }}
              >
              <Text style={loginStyles.buttonText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={loginStyles.buttonContainer}
              onPress={this.onLogin}
            >
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

        ):(

          <View style={loginStyles.bottomView}>
            <TouchableOpacity 
              style={loginStyles.buttonContainer}
              onPress={()=>{
                this.setState({mode: 'login'})
              }}
              >
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={loginStyles.buttonContainer}
              onPress={this.onCreateAccount}
              >
              <Text style={loginStyles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    )
  }
}