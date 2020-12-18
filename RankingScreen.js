import React from 'react';
import { TextInput, Text, View, FlatList, TouchableOpacity, Alert , Image} from 'react-native';
import { peopleStyles, colors, commonStyles, rankingStyles } from './Styles';
import { getDataModel } from './DataModel';
import { Pedometer } from 'expo-sensors';
import AV from 'leancloud-storage/core';
import * as adapters from '@leancloud/platform-adapters-react-native';
import { config } from './leanCloudConfig'

export class RankingScreen extends React.Component {
    constructor(props) {
      super(props);
  
      this.dataModel = getDataModel();
  
      this.state = {
        rankedList: this.dataModel.getRankedList()
        // rankedList: [],
      }
    }

    componentDidMount() {
        // this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
        
        // set interval for step counts
        var start = new Date();
        start.setHours(0,0,0,0);
        var end = new Date();
        end.setHours(23,59,59,999);
        
        // get step count
        Pedometer.getStepCountAsync(start, end).then(
            result => {
            console.log('Step counter:', result.steps);
    
            // check if current user has today's daily stats record
            var ifRecordExists = this.dataModel.currentUser.objectId in this.dataModel.dailyStats;
    
            if (ifRecordExists) {
                // update steps in local data model
                this.dataModel.dailyStats[this.dataModel.currentUser.objectId].steps = result.steps;
                // fetch the record
                console.log("Record found");
                var user = AV.Object.createWithoutData('_User', this.dataModel.currentUser.objectId);
                var query = new AV.Query('Daily_Stats').equalTo('date', String(start)).equalTo('user', user);
                query.first().then((dailyRecord) => {
                dailyRecord.set('steps', result.steps);
                dailyRecord.save();
                });
            } else {
                // create a new record
                console.log("Record not found");
                var dailyRecord = new AV.Object('Daily_Stats');
                // 'user' is a pointer that points to the current user
                var user = AV.Object.createWithoutData('_User', this.dataModel.currentUser.objectId);
                dailyRecord.set('user', user);
                dailyRecord.set('date', String(start));
                dailyRecord.set('steps', result.steps);
                dailyRecord.set('calorie', 0);
                dailyRecord.save();
                console.log("dailyRecord saved");
                let record = dailyRecord.toJSON();
                this.dataModel.dailyStats[this.dataModel.currentUser.objectId] = record;
            }
            },
            error => {
            // Alert.alert(
            //   'Could not get stepCount' + error,
            //   [{ text: 'OK',style: 'OK'}]
            // );
            }
        );
        this.dataModel.loadDailyStats();
        this.setState({rankedList: this.dataModel.getRankedList()});
    }

    // componentWillUnmount() {
    //     this.focusUnsubscribe();
    // }

    // componentDidMount() {
    //     this.setState({rankedList: this.dataModel.getRankedList()});
    // }
  
    render() {
        console.log('ranking:', this.state.rankedList);
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
                  <View style={rankingStyles.separator}/>
                );
              }}
              data={this.state.rankedList}
              renderItem={({item, index})=> {
                index += 1;
                return (
                  <View style={rankingStyles.content}>
                    <Text style={rankingStyles.index}>
                      {index} 
                    </Text>

                    <View style={rankingStyles.data}>
                      <Text style={rankingStyles.name}>
                      {item[0]} 
                      </Text>
                      <Text style={rankingStyles.number}>
                      {item[1]} <Text style={rankingStyles.steps}>Steps</Text>
                      </Text>   
                    </View>                  
                  </View>                  

                );
              }}
            />
          </View>
      )
    }
  }