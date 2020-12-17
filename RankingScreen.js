import React from 'react';
import { TextInput, Text, View, FlatList, TouchableOpacity, Alert , Image} from 'react-native';
import { peopleStyles, colors, commonStyles, rankingStyles } from './Styles';
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
        <View style={commonStyles.commonContainer}>
          <View style={rankingStyles.header}>
                <Text style={commonStyles.headerText}>
                  Exercise Ranking
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
                  <View style={peopleStyles.separator}/>
                );
              }}
              data={this.state.rankedList}
              renderItem={({item, index})=> {
                index += 1;
                return (
                    <Text style={peopleStyles.personText}>
                      {index + item[0] + ' ' + item[1] } 
                    </Text>
                );
              }}
            />
          </View>
      )
    }
  }