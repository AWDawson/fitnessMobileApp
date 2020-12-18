import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';

export const colors = {
  exercise: '#00D0BD',
  food: '#DD42B2',
  primary: '#7986CB', // MD Amber 500
  primaryDark: '#303F9F', // MD Brown 300
  primaryLight: '#E8EAF6', // MD Amber 200
  outline: '#BDBDBD' // MD Gray 400
}

export const detailStyles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: colors.exercise,
    // alignItems: 'center',
    // justifyContent: 'center',
    color: 'white'
  },
  icon:{
    marginTop: 50,
    width:200,
    height:200
  },
  middle:{
    // flex:1,
    marginBottom: 15,
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
  },
  title:{
    marginTop: 20,
    color:"white",
    fontSize:30,
    fontWeight: "600"
  },
  value:{
    flexDirection: "row",
    alignItems: "baseline",
    // marginBottom: 10,
    color:"white",
    fontSize: 60,
    fontWeight: "600"
  },
  unit:{
    color:"white",
    fontSize: 25,
    fontWeight: "600"
  }

})

export const commonStyles = StyleSheet.create({
  commonContainer:{
    flex: 1,
    backgroundColor: colors.exercise,
    alignItems: 'center',
    // justifyContent: 'center',
    color: 'white'
  },
  header:{
    height: 80,
    width:'90%',
    // paddingTop:
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
    headerLeftIcon:{
      // paddingLeft:20,
      width: 40,
      height: 40,
    },
    headerRightIcon:{
      // paddingRight:20,
      width: 40,
      height: 40,
    },
    headerText:{
      width: "100%",
      textAlign:'center',
      position:'absolute',
      fontSize: 20,
      color:"white",
      fontWeight: '700',
      paddingBottom: 8,
    },
  icon:{

  },
});

export const searchStyles = StyleSheet.create({
  optionList:{
    width: '90%',
    marginTop: 10,
    flexWrap: "wrap",
    flexDirection:'row',
    alignItems:"center",
    justifyContent:"flex-start"
  },
    option:{
      width: "23%",
      height: 100,
      margin: "1%",
      marginTop: 20,
      // marginRight: "1%",
      alignItems:"center",
      justifyContent:"flex-start"
    },
      icon:{
        width: 60,
        height: 60
      },
      text:{
        color:"white",
        textAlign: "center",
        fontWeight: "600"
      }
})


export const rankingStyles = StyleSheet.create({
  header:{
    height: 80,
    width:'90%',
    // paddingTop:
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  separator:{
    backgroundColor: "white",
    height: 1,
    width: '100%',
    alignSelf: 'center'
  },
  content:{
    paddingTop:10,
    paddingBottom:10, 
    flexDirection:"row",
    width:"90%",
    alignSelf:"center",
    color:"white",
    alignItems:"center",
    justifyContent:"center"

  },
  index:{
    // paddingLeft:20,
    width:"10%",
    color:"white",
    fontSize: 15,
    fontWeight: '600'
  },
  data:{
    paddingLeft: 10,
    width:"90%",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    color:"white",
  },
  data2:{
    flexDirection:"row",
    alignItems:"center",
    // justifyContent:"space-between",
    color:"white",
  },
  name:{
    color:"white",
    fontSize: 18,
    fontWeight: '600',
    width: 190,
  },
  number:{
    color:"white",
    fontSize: 20,
    fontWeight: '600'
  },
  steps:{
    color:"white",
    fontSize: 15,
    fontWeight: '500'
  }

})

export const homeStyles = StyleSheet.create({
  header:{
    height: 80,
    width:'90%',
    // paddingTop:
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  foodContainer:{
    flex: 1,
    backgroundColor: colors.food,
    alignItems: 'center',
    // justifyContent: 'center',
    color: 'white'
    // paddingTop: 80
  },
  middle:{
    paddingTop: 20,
    flex: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
    suggestion:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    suggestionText:{
      color: 'white',
      fontWeight: "600",
      fontSize: 16,
      opacity: 0.8
    },
    meter:{
      marginTop: 5,
      flex: 3,
      // top: 50,
      position:'relative',
      // height: 500
    },
      ellipse:{
        position:'absolute',
        alignSelf: 'center',
        width: 200,
        height: 200,
        resizeMode: 'contain',
      },
      meterValue:{
        color: 'white',
        position:'absolute',
        alignSelf: 'center',
        fontWeight: '500',
        fontSize: 60,
        top: 50
      },
      meterText:{
        color: 'white',
        position:'absolute',
        alignSelf: 'center',
        fontWeight: '500',
        fontSize: 35,
        top: 120
      },
    list:{
      flex: 3,
      marginTop: 50,
      width: 330,
    },
      listHeader:{
        // width:'100%',
        // marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

      },
      listTitle:{
        color: 'white',
        fontSize: 16,
        fontWeight: '600',

      },
      listButton:{
        color: 'white',
        fontSize: 16,
        fontWeight: '600',

      },
      listContainer:{
        height: 140,
        width: 330,
        borderColor: 'white',
        borderWidth: 3,
        // backgroundColor: "white",
        marginTop: 5,
        // marginBottom: 20,
        // opacity: 0.8,
        borderRadius: 20,
        overflow: "hidden"

      },
    addButton:{
      margin: 20,
      height: 53,
      flexDirection:'row',
      width: 330,
      alignItems: 'center',
      borderWidth: 3,
      borderColor: 'white',
      borderRadius: 20,
      justifyContent: 'center',

    },
    addIcon:{
      // position:'absolute',
      marginRight: 20,
      width: 40,
      height: 40,
    },
    addText:{
      color: 'white',
      fontSize: 20,
      fontWeight: "700",
      // alignSelf: 'flex-end'


    },
  bottom:{
    width:'100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
    buttomIcon:{
      marginTop:15,
      marginBottom:15,
      alignSelf:'center'
    },
    normalButton:{
      width:'50%',
    },
    exerciseActivateButton:{
      width:'50%',
      backgroundColor:colors.exercise,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 3,
    },
    mealActivateButton:{
      width:'50%',
      backgroundColor:colors.food,
      borderTopLeftRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 3,
    }
});

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.exercise,
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: 80
  },
    topView: {
      flex:3.8,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
      logoImage: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 120,
        resizeMode: 'contain',
      },
      title:{
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        paddingTop: 20,
      },
      des:{
        color: 'white',
        opacity: 0.8,
        fontSize: 18,
        paddingTop: 10,
      },
    middleView: {
      flex: 2,
      // flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      backgroundColor: 'white',
      opacity: 0.8,
      borderRadius:20,
      marginTop: 30,
      marginBottom: 10,
      ...(Platform.OS !== 'android' && {
        zIndex: 10
      })
    },
      inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 16,
        // borderBottomWidth: 2,
        width: '100%',
        // borderColor: colors.exercise
      },
      inputRowSignUp: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 13,
        // borderBottomWidth: 2,
        width: '100%',
        // borderColor: colors.exercise
      },
        inputLabelPic:{
          width: 35,
          height: 35,
          marginLeft: 10,
        },
        inputLabel: {
          flex: 0.3,
          justifyContent: 'flex-end',
          paddingRight: 5,
          textAlign: 'right',
          fontSize: 13,
          fontWeight: '600',
          color: colors.exercise
        },
        inputText: {
          flex: 0.8,
          borderColor: colors.outline,
          // marginLeft: 0,
          borderBottomWidth: 1,
          fontSize: 18,
        },
        inputTextSignUp: {
          flex: 0.65,
          height: 30,
          borderColor: colors.outline,
          // marginLeft: 0,
          borderBottomWidth: 1,
          fontSize: 13,
          ...(Platform.OS !== 'android' && {
            zIndex: 10
          })
        },
      bottomView: {
        marginBottom:30,
        flex:2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      },
      bottomViewSignUp:{
        marginBottom:30,
        flex:2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },
        buttonContainerLogIn: {
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 3,
          borderColor: 'white',
          borderRadius: 30,
          // backgroundColor: colors.primary,
          width: 300,
          height: 65
        },
        buttonContainerSignUp: {
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 30,
          backgroundColor: 'white',
          width: 300,
          height: 65,
          marginTop: 10,
        },
        buttonContainerLogIn2: {
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 3,
          borderColor: 'white',
          borderRadius: 50,
          // backgroundColor: colors.primary,
          width: 160,
          height: 65
        },
        buttonContainerSignUp2: {
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 50,
          backgroundColor: 'white',
          width: 160,
          height: 65,
          marginLeft: 10,
          zIndex: 1
        },
        buttonTextLogIn: {
            textAlign: 'center',
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold'
          },
          buttonTextSignUp: {
            textAlign: 'center',
            color: colors.exercise,
            fontSize: 20,
            fontWeight: 'bold',
          },
          buttonTextSignUpFood: {
            textAlign: 'center',
            color: colors.food,
            fontSize: 20,
            fontWeight: 'bold',
          }
});

export const peopleStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.exercise,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20
  },
    peopleListContainer: {
      flex: 0.5,
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      width: '90%',
    },  
      separator: {
        backgroundColor: colors.primaryLight,
        height: 1,
        width: '90%',
        alignSelf: 'center'
      },
      personRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10
      },
        personText: {
          fontSize: 16,
        }
});

export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00D0BD',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
    messageListContainer: {
      flex: 0.9,
      justifyContent: 'center',
      alignItems: 'stretch',
      width: '100%',
      alignSelf: 'center',
      paddingTop: '3%'
    },
      chatTextSelfContainer: {
        alignSelf: 'flex-end',
        padding: 5,
        margin: 5, 
        marginRight: 20,
        marginLeft: 40,
        backgroundColor: 'lightblue',
        borderRadius: 6
      },
        chatTextSelf: {
          fontSize: 18,
          textAlign: 'right',
        },
      chatTextOtherContainer: {
        alignSelf: 'flex-start',
        padding: 5,
        margin: 5, 
        marginLeft: 20,
        marginRight: 40,
        backgroundColor: 'lightgray',
        borderRadius: 6
      },
        chatTextOther: {
          fontSize: 18,
          textAlign: 'left',
        },
    inputContainer: {
      flex: 0.1,
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'stretch'
    },
      inputRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },  
      inputBox: {
        flex: 0.8,
        borderWidth: 1,
        borderColor: colors.primaryDark,
        borderRadius: 6,
        alignSelf: 'center',
        fontSize: 18,
        height: 40,
        padding: 5,
        margin: 5
      }
});
