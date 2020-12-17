import React from 'react';
import { TextInput, Text, View, 
  FlatList, TouchableOpacity, Alert } 
  from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { peopleStyles, colors } from './Styles';
import { getDataModel } from './DataModel';

export class RecordScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();

    this.state = {
      records: this.props.route.params.mode === 'exercise' ? Object.values(this.dataModel.exerciseRecords) : Object.values(this.dataModel.foodRecords),
      mode: this.props.route.params.mode
    }

    
  }

  render() {
    return (
      <View style={peopleStyles.container}>
        <View style={peopleStyles.peopleListContainer}>
          <FlatList
            ItemSeparatorComponent={()=>{
              return (
                <View style={peopleStyles.separator}/>
              );
            }}
            data={this.state.records}
            renderItem={({item})=> {
              if (this.state.mode === 'exercise'){
                return (
                  <TouchableOpacity 
                    style={peopleStyles.personRow}
                    onPress={()=> {
                      this.setState({mode : 'food',
                      records: Object.values(this.dataModel.foodRecords)});
                    }}
                  >
                    <Text style={peopleStyles.personText}>{
                    this.dataModel.exercises[item.ExerciseId.objectId].Type + "   Duration: " + item.Duration + "min" 
                    }</Text>
                    <Ionicons name="ios-arrow-dropright" size={24} color="black"/>                
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity 
                    style={peopleStyles.personRow}
                    onPress={()=> {
                      this.setState({mode : 'exercise',
                      records: Object.values(this.dataModel.exerciseRecords)});
                    }}
                  >
                    <Text style={peopleStyles.personText}>{
                      this.dataModel.foods[item.FoodId.objectId].Type + "  Quantity: " + item.Quantity + ""
                    }</Text>
                    <Ionicons name="ios-arrow-dropright" size={24} color="black"/>                
                  </TouchableOpacity>
                );
              }
              
            }}
          />
        </View>
      </View>
    )
  }
}