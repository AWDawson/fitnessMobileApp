import React from 'react';
import { TextInput, Text, View, 
  FlatList, TouchableOpacity, Alert, Image} 
  from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { peopleStyles, colors, commonStyles, rankingStyles, homeStyles } from './Styles';
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
      <View style={this.state.mode === 'exercise' ? commonStyles.commonContainer:homeStyles.foodContainer}>

          <View style={rankingStyles.header}>
                <Text style={commonStyles.headerText}>
                    {this.state.mode === 'exercise'? "Exercise":"Food"} <Text>Record</Text>
                </Text>
                <TouchableOpacity
                    style={commonStyles.headerLeftIcon}
                    onPress={()=>{
                        this.props.navigation.navigate("Home");                    
                    }}
                >
                <Image 
                    source={require('./assets/back.png')}
                    style={commonStyles.headerLeftIcon}
                />                
                </TouchableOpacity>
          </View>

          <FlatList
            ItemSeparatorComponent={()=>{
              return (
                <View style={rankingStyles.separator}/>
              );
            }}
            data={this.state.records}
            renderItem={({item, index})=> {
              index += 1;
                return (
                  <View style={rankingStyles.content}>
                    <Text style={rankingStyles.index}>
                      {index} 
                    </Text>

                      {this.state.mode === 'exercise' ? (
                      <View style={rankingStyles.data}>
                        <Text style={rankingStyles.name}>
                          {this.dataModel.exercises[item.ExerciseId.objectId].Type}
                        </Text>
                        <View style={rankingStyles.data2}>
                          <Text style={rankingStyles.number}>
                          {item.Duration} <Text style={rankingStyles.steps}>mins</Text>
                          </Text>
                          <TouchableOpacity 
                            onPress={()=> {
                              this.props.navigation.navigate("Detail",{mode: this.state.mode});                    
                            }}
                        >
                          <Ionicons name="ios-arrow-dropright" size={24} color="white" style={{paddingLeft:40}}/> 
                          </TouchableOpacity>
                        </View>
                      </View>
                      ):(
                      <View style={rankingStyles.data}>
                        <Text style={rankingStyles.name}>
                          {this.dataModel.foods[item.FoodId.objectId].Type}
                        </Text>
                        <View style={rankingStyles.data2}>
                          <Text style={rankingStyles.number}>
                          x {item.Quantity}
                          </Text>
                          <TouchableOpacity 
                            onPress={()=> {
                              this.props.navigation.navigate("Detail",{mode: this.state.mode});                    
                            }}
                          >
                          <Ionicons name="ios-arrow-dropright" size={24} color="white"/> 
                          </TouchableOpacity>
                        </View>
                      </View>        
                      )}
               
                  </View> 
                )
              
            }}
          />
      </View>
    )
  }
}