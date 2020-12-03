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
    this.mode = this.props.route.params.mode;

    this.state = {
      records: this.mode === 'exercise' ? this.dataModel.exerciseRecords : this.dataModel.foodRecords
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
              if (this.mode === 'exercise'){
                return (
                  <TouchableOpacity 
                    style={peopleStyles.personRow}
                    onPress={()=> {
                      this.props.navigation.navigate('Chat', {
                        currentUser: this.currentUser,
                        otherUser: item
                      });
                    }}
                  >
                    <Text style={peopleStyles.personText}>{item.ExerciseId.objectId + "  " + item.Duration + "min"}</Text>
                    <Ionicons name="ios-arrow-dropright" size={24} color="black"/>                
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity 
                    style={peopleStyles.personRow}
                    onPress={()=> {
                      this.props.navigation.navigate('Chat', {
                        currentUser: this.currentUser,
                        otherUser: item
                      });
                    }}
                  >
                    <Text style={peopleStyles.personText}>{item.Type}</Text>
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