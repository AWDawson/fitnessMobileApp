import React from 'react';
import {  Text, View, Image, TouchableOpacity}  from 'react-native';
import { homeStyles, commonStyles} from './Styles';
import { getDataModel } from './DataModel';
import { FlatList } from 'react-native-gesture-handler';
import InsetShadow from 'react-native-inset-shadow'
import { Pedometer } from 'expo-sensors';


export class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();

    this.state = {
      mode: 'exercise',
      calories: '',
      suggestedCal: '',
      recordList: Object.values(this.dataModel.exerciseRecords),
    }
  }



  render() {
    return (
        <View style={this.state.mode === 'exercise' ? commonStyles.commonContainer:homeStyles.foodContainer}>
            <View style={homeStyles.header}>
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
                        // this.onRanking();
                        this.props.navigation.navigate("Ranking");                    
                    }}
                >
                    <Image 
                        source={require('./assets/ranking.png')}
                        style={commonStyles.headerLeftIcon}
                    />
                </TouchableOpacity>
            </View>

            <View style={homeStyles.middle}>
                <View style={homeStyles.suggestion}>
                    <Text style={homeStyles.suggestionText}>
                        We recommend you intake
                    </Text>
                    <Text style={homeStyles.suggestionText}>
                        {this.state.suggestedCal} kCal per day.
                    </Text>
                </View>


                <View style={homeStyles.meter}>
                    <Image 
                        source={require('./assets/ellipse.png')}
                        style={homeStyles.ellipse}
                    />

                    <Text style={homeStyles.meterValue}>
                        100{this.state.calories}
                    </Text>

                    <Text style={homeStyles.meterText}>
                        kCal
                    </Text>
                </View>

                <View style={homeStyles.list}>  
                    <View style={homeStyles.listHeader}>
                        <Text style={homeStyles.listTitle}>
                            Recent
                        </Text>

                        <TouchableOpacity 
                            style={homeStyles.listButton}
                            onPress={()=>{
                                this.props.navigation.navigate("Record",{
                                mode: (this.state.mode === 'exercise' ? "exercise":"food")
                              });                    
                            }}
                        >
                            <Text style={homeStyles.listButton}>
                                See All
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={homeStyles.listContainer}>
                        <FlatList
                            ItemSeparatorComponent={()=>{
                                return (
                                    <View style={peopleStyles.separator}/>
                                );
                                }}
                                data={this.state.recordList}
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

                <TouchableOpacity 
                        style={homeStyles.addButton}
                        onPress={()=>{
                            this.props.navigation.navigate("Add");                    
                        }}
                >
                    <Image 
                        source={require('./assets/add.png')}
                        style={homeStyles.addIcon}
                    />
                    <Text style={homeStyles.addText}>
                        {this.state.mode === 'exercise' ? 
                            ('Add an exercise!'):('Add a meal!')}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={homeStyles.bottom}>
                    <TouchableOpacity 
                        style= {this.state.mode === 'exercise' ? homeStyles.normalButton:homeStyles.exerciseActivateButton}
                        onPress={()=>{
                            this.setState({
                                mode: 'exercise'
                            });                    
                        }}
                    >
                    <Image 
                        source={require('./assets/exercise.png')}
                        style={homeStyles.buttomIcon}
                    />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style= {this.state.mode === 'meal' ? homeStyles.normalButton:homeStyles.mealActivateButton}
                        onPress={()=>{
                            this.setState({
                                mode: 'meal'
                            });                    
                        }}
                    >
                    <Image 
                        source={require('./assets/meal.png')}
                        style={homeStyles.buttomIcon}
                    />
                    </TouchableOpacity>
            </View>


        </View>
    )
  }
}