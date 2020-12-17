import React from 'react';
import { TextInput, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { peopleStyles, colors } from './Styles';
import { getDataModel } from './DataModel';

export class RankingScreen extends React.Component {
    constructor(props) {
      super(props);
  
      this.dataModel = getDataModel();
  
      this.state = {
          rankedList: this.dataModel.getRankedList()
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
              data={this.state.rankedList}
              renderItem={({item})=> {
                  return (
                      <Text style={peopleStyles.personText}>
                        { item[0] + ' ' + item[1] } 
                      </Text>
                  );
                }}
            />
          </View>
        </View>
      )
    }
  }