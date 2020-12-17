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
      weightInput:'',
      heightInput:'',
      activeTypeInput:'',
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
      this.state.weightInput,
      this.state.heightInput,
      this.state.activeTypeInput
    );
    if (newUser === null){
      Alert.alert(
        'Duplicate User',
        'User ' + this.state.emailInput + ' already exists.',
        [{ text: 'OK',style: 'OK'}]
      );
      return;
    }

    this.props.navigation.navigate("Home", {
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
    await this.dataModel.loadDailyStats();

    // set interval for step counts
    var start = new Date();
    start.setHours(0,0,0,0);
    var end = new Date();
    end.setHours(23,59,59,999);

    // // get step count
    // Pedometer.getStepCountAsync(start, end).then(
    //   result => {
    //     console.log('Step counter:', result.steps);

    //     // check if current user has today's daily stats record
    //     var ifRecordExists = this.currentUser.objectId in this.dailyStats;

    //     if (ifRecordExists) {
    //       // update steps in local data model
    //       this.dataModel.dailyStats[this.currentUser.objectId].steps = result.steps;
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
    //       this.dataModel.dailyStats[this.currentUser.objectId] = record;
    //     }
    //   },
    //   error => {
    //     Alert.alert(
    //       'Could not get stepCount' + error,
    //       [{ text: 'OK',style: 'OK'}]
    //     );
    //   }
    // );

    this.props.navigation.navigate("Home", {
        mode: "exercise"
    });
    
  }

  render() {
    return (
      <KeyboardAvoidingView 
        style={loginStyles.container}
        behavior={'position'}
        keyboardVerticalOffset={0}>
          {this.state.mode === 'login' ? (
            <View style={loginStyles.topView}>
              <Image 
                source={require('./assets/logo.png')}
                style={loginStyles.logoImage}
              />
              <Text style={loginStyles.title}>Calories</Text>
              <Text style={loginStyles.des}>Your personal calories daily tracker.</Text>
            </View>
          ):(
            <View/>
          )}
        <View style={loginStyles.middleView}>

          <View style={loginStyles.inputRow}>
            <Image 
              source={require('./assets/email.png')}
              style={loginStyles.inputLabelPic}
            />
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
          <Image 
              source={require('./assets/password.png')}
              style={loginStyles.inputLabelPic}
            />
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
          {this.state.mode === 'create' ? (
            <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Height:</Text>
              <TextInput
                style={loginStyles.inputText}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.heightInput}
                onChangeText={(text)=>{this.setState({heightInput: text})}}
              />
            </View>
          ):(
            <View/>
          )}
          {/* ActiveType tells you whether a user is active in sports
              Implement a dropdown menu which user can select their types (accroding to the following fashion)
              value: little or no exercise  ->  activeTypeInput: sedentary
              value: light exercise/sports 1-3 days/week  ->  activeTypeInput: lightly active
              value: moderate exercise/sports 3-5 days/week  ->  activeTypeInput: moderately active
              value: hard exercise/sports 6-7 days a week  ->  activeTypeInput: very active
              value: very hard exercise/sports & physical job or 2x training  ->  activeTypeInput: extra active

          */}
          {this.state.mode === 'create' ? (
            <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>ActiveType:</Text>
              <TextInput
                style={loginStyles.inputText}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.activeTypeInput}
                onChangeText={(text)=>{this.setState({activeTypeInput: text})}}
              />
            </View>
          ):(
            <View/>
          )}
        </View>
        
        {this.state.mode === 'login' ? (

          <View style={loginStyles.bottomView}>
            <TouchableOpacity 
              style={loginStyles.buttonContainerLogIn}
              onPress={this.onLogin}
            >
              <Text style={loginStyles.buttonTextLogIn}>Log In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={loginStyles.buttonContainerSignUp}
              onPress={()=>{
                this.setState({mode: 'create'})
              }}
              >
              <Text style={loginStyles.buttonTextSignUp}>Sign Up</Text>
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