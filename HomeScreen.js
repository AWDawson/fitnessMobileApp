import React from 'react';
import {  Text, View, Image, TouchableOpacity}  from 'react-native';
import { homeStyles, commonStyles} from './Styles';
import { getDataModel } from './DataModel';
import { FlatList } from 'react-native-gesture-handler';

export class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();

    this.state = {
      mode: 'exercise',
      calories: '',
      suggestedCal: '',
      recordList: [],
    }
  }

  render() {
    return (
        <View styles={homeStyles.container}>
            <View styles={commonStyles.header}>
                <TouchableOpacity 
                    style={commonStyles.headerLeftIcon}
                    onPress={()=>{
                        this.props.navigation.navigate("User");                    
                    }}
                >
                    <Image 
                        source={require('./assets/my.png')}
                        style={commonStyles.headerLeftIcon}
                    />                
                </TouchableOpacity>
  

                <TouchableOpacity 
                    style={commonStyles.headerRightIcon}
                    onPress={()=>{
                        this.props.navigation.navigate("Ranking");                    
                    }}
                >
                    <Image 
                        source={require('./assets/ranking.png')}
                        style={commonStyles.headerLeftIcon}
                    />
                </TouchableOpacity>
            </View>


        </View>
    )
  }
}