import React from 'react';
import { TextInput, Text, View, 
  Image, TouchableOpacity, KeyboardAvoidingView, Alert} 
  from 'react-native';

import { loginStyles } from './Styles';
import { getDataModel } from './DataModel';

import AV, { Query } from 'leancloud-storage/core';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';


import * as adapters from '@leancloud/platform-adapters-react-native';
import { config } from './leanCloudConfig'
import Fitness from '@ovalmoney/react-native-fitness';
import { Pedometer } from 'expo-sensors';


//const [selectedValue, setSelectedValue] = useState("a");

export class SignupScreen extends React.Component {

  constructor(props) {
    super(props);

    this.dataModel = getDataModel();

    this.state = {
      mode: 'create',
      emailInput: '',
      displayNameInput: '',
      passwordInput: '',
      passwordCheckInput: '',
      genderInput:'',
      ageInput:'',
      weightInput:'',
      heightInput:'',
      activeTypeInput:'',
      reenterPasswordInput:'',
    }
  }

  onCreateAccount = async () => {

    // check that this is a valid email (skipping this)
    // check password rules (skipping this)
    // check that passwords match (skipping this)
    // check that displayName isn't empty (skipping this)

    // check that user doesn't already exist
    const info = ['email', 'password', 'display name', 'gender', 'age', 'weight', 'height', 'active type'];
    let check = [this.state.emailInput,
      this.state.passwordInput,
      this.state.displayNameInput,
      this.state.genderInput,
      this.state.ageInput,
      this.state.weightInput,
      this.state.heightInput,
      this.state.activeTypeInput];
    
    for (let id in check){
      if(check[id] == ''){
        Alert.alert(
          'Missing Input',
          'Information of ' + info[id] + ' is missing!',
          [{ text: 'OK',style: 'OK'}]
        );
        return;
      }   
    }

    if(this.state.passwordInput != this.state.reenterPasswordInput){
      Alert.alert(
        'Password Mismatch',
        'Password and re-entered do not match!',
        [{ text: 'OK',style: 'OK'}]
      );
      return;
    }

    
    await this.dataModel.createUser(
      this.state.emailInput,
      this.state.passwordInput,
      this.state.displayNameInput,
      this.state.genderInput,
      this.state.ageInput,
      this.state.weightInput,
      this.state.heightInput,
      this.state.activeTypeInput
    ).then((newUser) => {
      console.log(newUser);
      Alert.alert(
        'Signup Scuceeded',
        'User ' + this.state.emailInput + ' is created!',
        [{ text: 'OK',style: 'OK'}]
      );
      this.props.navigation.navigate("Login", {
        mode: "login"
      });
    }, (error) => {
      // 登录失败（可能是密码错误）
      Alert.alert(
        'Duplicate User',
        'User ' + this.state.emailInput + ' already exists.',
        [{ text: 'OK',style: 'OK'}]
      );
      return;
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

    this.props.navigation.navigate("Record", {
        mode: "exercise"
    });
    
  }

  render() {
    return (
      <KeyboardAvoidingView 
        style={{
          flex: 1,
          backgroundColor: '#00D0BD',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 20
        }}
        // behavior={"position"}
        keyboardVerticalOffset={0}>
        <View style={{
          flex: 8,
      // flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      backgroundColor: 'white',
      opacity: 0.8,
      borderRadius:20,
      marginTop: 40,
      ...(Platform.OS !== 'android' && {
        zIndex: 10
      })
      // marginBottom: 30,
    }}>

          <View style={loginStyles.inputRowSignUp}>
              <Text style={loginStyles.inputLabel}>Email:</Text>
              <TextInput
                style={loginStyles.inputTextSignUp}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.emailInput}
                onChangeText={(text)=>{this.setState({emailInput: text})}}
              />
          </View>
        
         <View style={loginStyles.inputRowSignUp}>
              <Text style={loginStyles.inputLabel}>Display Name:</Text>
              <TextInput
                style={loginStyles.inputTextSignUp}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.displayNameInput}
                onChangeText={(text)=>{this.setState({displayNameInput: text})}}
              />
          </View>

          <View style={loginStyles.inputRowSignUp}>
              <Text style={loginStyles.inputLabel}>Password:</Text>
              <TextInput
                style={loginStyles.inputTextSignUp}
                textContentType='password'
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.passwordInput}
                onChangeText={(text)=>{this.setState({passwordInput: text})}}
              />
          </View>

          <View  style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingVertical: 13,
              // borderBottomWidth: 2,
              width: '100%',
              ...(Platform.OS !== 'android' && {
                zIndex: 10
              })
          }}>
              <Text style={loginStyles.inputLabel}>Re-enter Password:</Text>
              <TextInput
                style={loginStyles.inputTextSignUp}
                textContentType='password'
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.reenterPasswordInput}
                onChangeText={(text)=>{this.setState({reenterPasswordInput: text})}}
              />
          </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingVertical: 13,
              // borderBottomWidth: 2,
              width: '100%',
              ...(Platform.OS !== 'android' && {
                zIndex: 10
              })
          }}>
              <Text style={loginStyles.inputLabel}>Gender:</Text>

              <DropDownPicker
                items={[
                    {label: 'Male', value: 'male', hidden: true},
                    {label: 'Female', value: 'female'},
                ]}
                placeholder="Select your gender"
                // defaultValue='male'
                containerStyle={loginStyles.inputTextSignUp}
                style={{
                  // flex: 0.7,
                  backgroundColor: '#fafafa',
                }}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                dropDownStyle={{
                  backgroundColor: '#fafafa',
                  ...(Platform.OS !== 'android' && {
                    zIndex: 10
                  })
                }}
                onChangeItem={(itemValue, itemIndex) =>
                  this.setState({genderInput: itemValue})
                }
              />
              {/* <Picker
              selectedValue={this.state.activeTypeInput}
              style={{height: 50, width: 100}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({activeTypeInput: itemValue})
            }>
              <Picker.Item label="male" value="male" />
              <Picker.Item label="female" value="female" />
              </Picker> */}
            </View>

          {this.state.mode === 'create' ? (
            <View style={loginStyles.inputRowSignUp}>
              <Text style={loginStyles.inputLabel}>Age:</Text>
              <TextInput
                style={loginStyles.inputTextSignUp}
                keyboardType={'numeric'}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.ageInput}
                onChangeText={(text)=>{this.setState({ageInput:  text.replace(/[^0-9]/g, '')})}}
              />
            </View>
          ):(
            <View/>
          )}
          {this.state.mode === 'create' ? (
            <View style={loginStyles.inputRowSignUp}>
              <Text style={loginStyles.inputLabel}>Weight (kg):</Text>
              <TextInput
                style={loginStyles.inputTextSignUp}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.weightInput}
                onChangeText={(text)=>{this.setState({weightInput:  text.replace(/[^0-9]/g, '')})}}
              />
            </View>
          ):(
            <View/>
          )}
          {this.state.mode === 'create' ? (
            <View style={loginStyles.inputRowSignUp}>
              <Text style={loginStyles.inputLabel}>Height (cm):</Text>
              <TextInput
                style={loginStyles.inputTextSignUp}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.heightInput}
                onChangeText={(text)=>{this.setState({heightInput:  text.replace(/[^0-9]/g, '')})}}
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
          
            <View  style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingVertical: 13,
              // borderBottomWidth: 2,
              width: '100%',
              ...(Platform.OS !== 'android' && {
                zIndex: 10
              })
          }}>
              <Text style={loginStyles.inputLabel}>Active Type:</Text>

              <DropDownPicker
                items={[
                    {label: 'Little or no exercise', value: 'sedentary', hidden: true},
                    {label: 'Light exercise/sports 1-3 days/week', value: 'activeTypeInput: lightly active'},
                    {label: 'Moderate exercise/sports 3-5 days/week', value: 'activeTypeInput: lightly active'},
                    {label: 'Hard exercise/sports 6-7 days a week', value: 'activeTypeInput: lightly active'},
                    {label: 'Very hard exercise/sports & physical job or 2x training', value: 'activeTypeInput: extra active'},
                ]}
                placeholder="Select your type"
                // defaultValue='sedentary'
                containerStyle={loginStyles.inputTextSignUp}
                style={{
                  backgroundColor: '#fafafa',
                }}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={(itemValue, itemIndex) =>
                  this.setState({activeTypeInput: itemValue})
                }
              />
            {/* <Picker
              selectedValue={this.state.activeTypeInput}
              style={{height: 50, width: 100}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({activeTypeInput: itemValue})
            }>
              <Picker.Item label="little or no exercise" value="sedentary" />
              <Picker.Item label="light exercise/sports 1-3 days/week" value="activeTypeInput: lightly active" />
              <Picker.Item label="moderate exercise/sports 3-5 days/week" value="activeTypeInput: lightly active" />
              <Picker.Item label="hard exercise/sports 6-7 days a week" value="activeTypeInput: lightly active" />
              <Picker.Item label="very hard exercise/sports & physical job or 2x training" value="activeTypeInput: extra active" />

            </Picker> */}
             
            </View>


        </View>
        
   
           
        <View style={loginStyles.bottomViewSignUp}> 
          <TouchableOpacity 
                style={loginStyles.buttonContainerLogIn2}
                onPress={()=>{
                  this.props.navigation.navigate("Login", {
                    mode:'login'
                  })
                }}
                >
                <Text style={loginStyles.buttonTextLogIn}>Cancel</Text>
          </TouchableOpacity>  

          <TouchableOpacity 
                style={loginStyles.buttonContainerSignUp2}
                onPress={this.onCreateAccount}
                >
                <Text style={loginStyles.buttonTextSignUp}>Sign Up</Text>
          </TouchableOpacity>  
        </View>
       

      </KeyboardAvoidingView>
    )
  }
}