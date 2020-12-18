import React from 'react';
import {  Text, View, Image, TouchableOpacity}  from 'react-native';
import { homeStyles, commonStyles, rankingStyles, searchStyles} from './Styles';
import { getDataModel } from './DataModel';
import { Ionicons } from '@expo/vector-icons';
import {Icons} from './mapping'

import { FlatList } from 'react-native-gesture-handler';
import InsetShadow from 'react-native-inset-shadow'
import { Pedometer } from 'expo-sensors';

class OptionList extends React.Component {
    constructor(props) {
        super(props);

    }

    render(){
        console.log(Icons)

        let list = this.props.list.map((item)=>
            <TouchableOpacity
                key = {item.objectId}
                style={searchStyles.option}
                onPress={()=>{
                    this.props.navigation.navigate("Add",{
                        mode : ('MET' in item) ? 'exercise' : 'food',
                        itemId: item.objectId
                    });                    
                }}
            >
                <Image
                    source={Icons[item.objectId]}
                    style={searchStyles.icon}
                />
                <Text style={searchStyles.text}>
                    {item.Type}
                </Text>
            </TouchableOpacity>
        )
        // console.log(list)
        return (
            <View style={searchStyles.optionList}>
                {list}
            </View>
        )
    }
}

export class SearchScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();

    this.state = {
        mode: this.props.route.params.mode,
        options: this.props.route.params.mode === 'exercise' ? Object.values(this.dataModel.exercises) : Object.values(this.dataModel.foods),
    }
  }

  render() {
    return (
        <View style={this.state.mode === 'exercise' ? commonStyles.commonContainer:homeStyles.foodContainer}>

            <View style={rankingStyles.header}>
                <Text style={commonStyles.headerText}>
                    {this.state.mode === 'exercise'? "Add An Exercise":"Add A Meal"}
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

            <View>
                <OptionList list={this.state.options} navigation={this.props.navigation}/>
            </View>
        </View>
    )
  }
}