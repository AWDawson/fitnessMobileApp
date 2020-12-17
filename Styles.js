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

export const commonStyles = StyleSheet.create({
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

    },
  icon:{

  },
});


export const homeStyles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: colors.exercise,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
    // paddingTop: 80
  },
  middle:{
    paddingTop: 100,
    flex: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
    suggestion:{
      color: 'white',
      fontSize: 16,
      opacity: 0.8
    },
    suggestedCal:{
      color: 'white',
    },
    meter:{
      top: 50,
      position:'relative',
      // height: 500
    },
      ellipse:{
        position:'absolute',
        alignSelf: 'center',
        width: 230,
        height: 230,
        resizeMode: 'contain',
      },
      meterValue:{
        color: 'white',
        position:'absolute',
        alignSelf: 'center',
        fontSize: 90,
        
      },
      meterText:{
        color: 'white',
        position:'absolute',
        alignSelf: 'center',
        fontSize: 60,

      },
    list:{

    },
      listTitle:{
        color: 'white'

      },
      listButton:{
        color: 'white'

      },
      listContainer:{

      },
    addButton:{

    },
    addIcon:{

    },
    addText:{
      color: 'white'

    },
  bottom:{
    flex:18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
    normalButton:{

    },
    exerciseButton:{

    },
    mealButton:{

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
      opacity: 0.6,
      borderRadius:20,
      marginTop: 30,
      marginBottom: 10,
    },
      inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 16,
        // borderBottomWidth: 2,
        width: '90%',
        // borderColor: colors.exercise
      },
        inputLabelPic:{
          width: 35,
          height: 35,
          // marginRight: 10,
        },
        inputLabel: {
          flex: 0.3,
          justifyContent: 'flex-end',
          paddingRight: 5,
          textAlign: 'right',
          fontSize: 20
        },
        inputText: {
          flex: 0.8,
          borderColor: colors.outline,
          // marginLeft: 0,
          borderBottomWidth: 1,
          fontSize: 18,
        },
      bottomView: {
        marginBottom:30,
        flex:2,
        flexDirection: 'column',
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
            fontWeight: 'bold'
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
