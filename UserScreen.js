import React from 'react';
import { TextInput, Text, View, 
  Image, TouchableOpacity, KeyboardAvoidingView, Alert} 
  from 'react-native';

import { loginStyles } from './Styles';
import { getDataModel } from './DataModel';

import AV, { Query } from 'leancloud-storage/core';
import {Picker} from '@react-native-picker/picker';
import * as adapters from '@leancloud/platform-adapters-react-native';
import { config } from './leanCloudConfig'
import Fitness from '@ovalmoney/react-native-fitness';
import { Pedometer } from 'expo-sensors';


//const [selectedValue, setSelectedValue] = useState("a");

export class UserScreen extends React.Component {

  constructor(props) {
    super(props);

    this.dataModel = getDataModel();

    this.state = {
      mode: 'create',
      emailInput: this.dataModel.currentUser.email,
      displayNameInput: this.dataModel.currentUser.username,
      passwordInput: '',
      genderInput: this.dataModel.currentUser.gender,
      ageInput: this.dataModel.currentUser.age + '',
      weightInput:this.dataModel.currentUser.weight + '',
      heightInput: this.dataModel.currentUser.height + '',
      activeTypeInput: this.dataModel.currentUser.activeType,
      reenterPasswordInput: '',
    }
  }

  onUpdateAccount = async () => {

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
      }
      return;
    }

    if(this.state.passwordInput != this.state.reenterPasswordInput){
      Alert.alert(
        'Password Mismatch',
        'Password and re-entered do not match!',
        [{ text: 'OK',style: 'OK'}]
      );
      return;
    }

    
    await this.dataModel.updateUserProfile(
      this.currentUser.objectId,
      this.state.passwordInput,
      this.state.displayNameInput,
      this.state.genderInput,
      this.state.ageInput,
      this.state.weightInput,
      this.state.heightInput,
      this.state.activeTypeInput
    ).then((newUser) => {
      Alert.alert(
        'Success',
        'User profile is successfully created!',
        [{ text: 'OK',style: 'OK'}]
      );
    }, (error) => {
      // 登录失败（可能是密码错误）
      Alert.alert(
        'Failed',
        'Failed to update user profile.',
        [{ text: 'OK',style: 'OK'}]
      );
      return;
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
        behavior={"height"}
        keyboardVerticalOffset={10}>
        <View style={{
          height: 640,
      // flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      width: '90%',
      backgroundColor: 'white',
      opacity: 0.6,
      borderRadius:20,
      marginTop: 30,
      marginBottom: 30,
    }}>

          <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Email:</Text>
              <TextInput
                style={loginStyles.inputText}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                editable={false}
                selectTextOnFocus={false}
                value={this.state.emailInput}
                onChangeText={(text)=>{this.setState({emailInput: text})}}
              />
          </View>
        
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

          <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Password:</Text>
              <TextInput
                style={loginStyles.inputText}
                textContentType='password'
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.passwordInput}
                onChangeText={(text)=>{this.setState({passwordInput: text})}}
              />
          </View>

          <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Re-enter Password:</Text>
              <TextInput
                style={loginStyles.inputText}
                textContentType='password'
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.reenterPasswordInput}
                onChangeText={(text)=>{this.setState({reenterPasswordInput: text})}}
              />
          </View>

         
            <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Gender:</Text>
              <Picker
              selectedValue={this.state.activeTypeInput}
              style={{height: 50, width: 100}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({activeTypeInput: itemValue})
            }>
              <Picker.Item label="male" value="male" />
              <Picker.Item label="female" value="female" />
              </Picker>
            </View>
          
          
            <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Age:</Text>
              <TextInput
                style={loginStyles.inputText}
                keyboardType={'numeric'}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.ageInput}
                onChangeText={(text)=>{this.setState({ageInput:  text.replace(/[^0-9]/g, '')})}}
              />
            </View>
          
         
            <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Weight (kg):</Text>
              <TextInput
                style={loginStyles.inputText}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.weightInput}
                onChangeText={(text)=>{this.setState({weightInput:  text.replace(/[^0-9]/g, '')})}}
              />
            </View>
          
            <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Height (cm):</Text>
              <TextInput
                style={loginStyles.inputText}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.heightInput}
                onChangeText={(text)=>{this.setState({heightInput:  text.replace(/[^0-9]/g, '')})}}
              />
            </View>
          
          {/* ActiveType tells you whether a user is active in sports
              Implement a dropdown menu which user can select their types (accroding to the following fashion)
              value: little or no exercise  ->  activeTypeInput: sedentary
              value: light exercise/sports 1-3 days/week  ->  activeTypeInput: lightly active
              value: moderate exercise/sports 3-5 days/week  ->  activeTypeInput: moderately active
              value: hard exercise/sports 6-7 days a week  ->  activeTypeInput: very active
              value: very hard exercise/sports & physical job or 2x training  ->  activeTypeInput: extra active

          */}
          
            <View style={loginStyles.inputRow}>
              <Text style={loginStyles.inputLabel}>Active Type:</Text>
            <Picker
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

        </Picker>
             
            </View>

          <TouchableOpacity 
              style={{ 
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 30,
              backgroundColor: 'white',
              width: 300,
              height: 65,
              marginTop: 10,
            }}
              onPress={this.onCreateAccount}
              >
              <Text style={loginStyles.buttonTextSignUp}>Save</Text>
            </TouchableOpacity>
        </View>
        
        
           
 
       
      </KeyboardAvoidingView>
    )
  }
}