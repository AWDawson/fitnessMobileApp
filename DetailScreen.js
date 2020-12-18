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


export class DetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();
    this.record = this.props.route.params.record;

    let calories = this.props.route.params.mode === 'exercise' ? 
        (this.record.Duration * (this.dataModel.exercises[this.record.ExerciseId.objectId].MET * 3.5 * this.dataModel.currentUser.weight) / 200.0) :
        (this.record.Quantity * (1.0 * this.dataModel.foods[this.record.FoodId.objectId].Calorie));

    this.state = {
      mode: this.props.route.params.mode,
      calories: calories.toFixed(1) + '',
      id: this.props.route.params.mode === 'exercise' ? this.record.ExerciseId.objectId:this.record.FoodId.objectId,
      amount: (this.props.route.params.mode === 'exercise' ? this.record.Duration : this.record.Quantity) + '',
      type: this.props.route.params.mode === 'exercise' ? this.dataModel.exercises[this.record.ExerciseId.objectId].Type:
        this.dataModel.foods[this.record.FoodId.objectId].Type
    }
  }

  deleteRecord = async () =>{
    Alert.alert(
        'Alert',
        'Are you sure you want to delete this record?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          { text: 'Delete', onPress: async () => {
              if(this.state.mode === 'exercise'){
                await this.dataModel.deleteExerciseRecord(this.record.objectId);
              } else {
                await this.dataModel.deleteFoodRecord(this.record.objectId);
              }
              this.props.navigation.navigate("Home", {
                mode:this.state.mode
              });
          }
        }
        ],
        { cancelable: false }
      );
  }

  updateRecord = async () =>{
    if(this.state.amount === ''){
        Alert.alert(
            'Missing Input',
            'Here wee need some numerical input!',
            [{ text: 'OK',style: 'OK'}]
          );
        return;
    }
    if(this.state.mode === 'exercise'){
        await this.dataModel.updateExerciseRecord(this.record.objectId,this.record.ExerciseId.objectId,this.state.amount).then(
            record =>{
                this.record = record;
            });
    } else {
        await this.dataModel.updateFoodRecord(this.record.objectId,this.record.FoodId.objectId,this.state.amount).then(
            record =>{
                this.record = record;
            });
    }
    this.props.navigation.navigate("Home", {
        mode:this.state.mode
    });
  }

  computeCalories = (amount) => {
    amount = amount.replace(/[^0-9]/g, '');
    let calories = amount != '' ? (this.props.route.params.mode === 'exercise' ? 
        (Number(amount) * (this.dataModel.exercises[this.record.ExerciseId.objectId].MET * 3.5 * this.dataModel.currentUser.weight) / 200.0):
        (Number(amount) * (1.0 * this.dataModel.foods[this.record.FoodId.objectId].Calorie))) : 0;
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
              <View style={homeStyles.header}>
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
                  <TouchableOpacity 
                    onPress={this.deleteRecord}
                    >
                   <Image
                      source={require('./assets/delete.png')}
                      style={commonStyles.headerRightIcon}
                    />     
                  </TouchableOpacity>
              </View>

              <Image 
                  source={Icons[this.state.id]}
                  style={detailStyles.icon}
              />    


              <View style={detailStyles.middle}>
                <Text style={detailStyles.title}>{this.state.mode === 'exercise' ? 'Duration' : 'Quantity'}</Text>
                <View style={detailStyles.value}>
                  <TextInput style={detailStyles.value}
                      autoCapitalize='none'
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
                onPress={this.updateRecord}
                >
                <Text style={loginStyles.buttonTextSignUp}>Save</Text>
              </TouchableOpacity>



        </KeyboardAvoidingView>
      )

  }
}