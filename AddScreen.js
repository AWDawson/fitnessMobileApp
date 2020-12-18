import React from 'react';
import { TextInput, Text, View, 
    Image, TouchableOpacity, KeyboardAvoidingView, Alert} 
    from 'react-native';
import { loginStyles,commonStyles,homeStyles,rankingStyles,detailStyles} from './Styles';
import { getDataModel } from './DataModel';
import { Ionicons } from '@expo/vector-icons';
import {Icons} from './mapping'

import { FlatList } from 'react-native-gesture-handler';
import InsetShadow from 'react-native-inset-shadow'
import { Pedometer } from 'expo-sensors';


export class AddScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();
    this.itemId = this.props.route.params.itemId;

    this.state = {
      mode: this.props.route.params.mode,
      calories: '0.0',
      amount: '',
      type: this.props.route.params.mode === 'exercise' ? this.dataModel.exercises[this.itemId].Type:
        this.dataModel.foods[this.itemId].Type
    }
  }

  createRecord = async () =>{
    if(this.state.amount === ''){
        Alert.alert(
            'Missing Input',
            'Here wee need some numerical input!',
            [{ text: 'OK',style: 'OK'}]
          );
        return;
    }
    if(this.state.mode === 'exercise'){
        await this.dataModel.addExerciseRecord(this.itemId,this.state.amount);
    } else {
        await this.dataModel.addFoodRecord(this.itemId,this.state.amount);
    }
    this.props.navigation.navigate("Home", {
        mode:this.state.mode
    })
  }

  computeCalories = (amount) => {
    amount = amount.replace(/[^0-9]/g, '');
    let calories = amount != '' ? (this.props.route.params.mode === 'exercise' ? 
        (Number(amount) * (this.dataModel.exercises[this.itemId].MET * 3.5 * this.dataModel.currentUser.weight) / 200.0):
        (Number(amount) * (1.0 * this.dataModel.foods[this.itemId].Calorie))) : 0;
    this.setState({
        calories : calories.toFixed(1) + '',
        amount : amount
    });
  }

  render() {
      return(
        <KeyboardAvoidingView 
        behavior={'height'}
        keyboardVerticalOffset={0}
        style={this.state.mode === 'exercise' ? commonStyles.commonContainer:homeStyles.foodContainer}>


              <View style={rankingStyles.header}>
                  <Text style={commonStyles.headerText}>
                      {this.state.type}
                  </Text>
                  <TouchableOpacity
                      style={commonStyles.headerLeftIcon}
                      onPress={()=>{
                          this.props.navigation.goBack();                    
                      }}
                  >
                    <Image
                      source={require('./assets/back.png')}
                      style={commonStyles.headerLeftIcon}
                    />           
                  </TouchableOpacity>
              </View>

              <Image 
                  source={Icons[this.itemId]}
                  style={detailStyles.icon}
              />    


              <View style={detailStyles.middle}>
                <Text style={detailStyles.title}>{this.state.mode === 'exercise' ? 'Duration' : 'Quantity'}</Text>
                <View style={detailStyles.value}>
                  <TextInput style={detailStyles.value}
                      autoCapitalize='none'
                      // keyboardType={'numeric'}
                      autoCorrect={false}
                      value={this.state.amount}
                      onChangeText={(text)=>{this.computeCalories(text);}}
                  />
                  {(this.state.mode === 'exercise') && <Text style={detailStyles.unit}>  min</Text>}
                </View>

                <Text style={detailStyles.title}>{this.state.mode === 'exercise' ? 'Total Consumption' : 'Total Intake'}</Text>
                <View>
                  <Text style={detailStyles.value}>{this.state.calories}<Text style={detailStyles.unit}>  kCal</Text></Text>
                </View>
              </View>


              <TouchableOpacity 
                style={loginStyles.buttonContainerSignUp}
                onPress={this.createRecord}
                >
                <Text style={this.state.mode === 'exercise' ? loginStyles.buttonTextSignUp:loginStyles.buttonTextSignUpFood}>Add</Text>
              </TouchableOpacity>



        </KeyboardAvoidingView>
      )

  }
}