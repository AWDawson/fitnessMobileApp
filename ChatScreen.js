import React from 'react';
import { TextInput, Text, View, Image,
  FlatList, KeyboardAvoidingView } 
  from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { chatStyles, colors } from './Styles';
import { getDataModel } from './DataModel';

export class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    this.self = this.props.route.params.currentUser;
    this.other = this.props.route.params.otherUser;
    this.dataModel = getDataModel();
    this.imageWidth = 225,
    this.imageHeight = 300;

    this.state = {
      messages: [],
      inputText: ''
    }
  }

  componentDidMount = () => {
    this.props.navigation.setOptions({title: this.other.displayName});
    this.subscribeToChat();
  }

  componentWillUnmount = () => {
    this.dataModel.unsubscribeFromChat(this.chat);
  }

  subscribeToChat = async() => {
    this.chat = await this.dataModel
      .getOrCreateChat(this.self, this.other);
    this.dataModel.subscribeToChat(this.chat, this.onChatUpdate);
  }

  onChatUpdate = () => {
    this.setState({messages: this.chat.messages});
  }

  onMessageSend = async () => {
    let messageData = {
      text: this.state.inputText,
      timestamp: Date.now(),
      author: this.self,
    }
    await this.dataModel.addChatMessage(this.chat.key, messageData);
    
    this.setState({
      messages: this.chat.messages,
      inputText: ''
    });
  }

  onTakePicture = () => {
    this.props.navigation.navigate("Camera", {
      chat: this.chat,
      currentUser: this.self
    })
  }

  render() {
    return (
      <KeyboardAvoidingView 
        style={chatStyles.container}
        behavior={"height"}
        keyboardVerticalOffset={100}>
        <View style={chatStyles.messageListContainer}>
          <FlatList
            data={this.state.messages}
            ref={(ref) => {this.flatListRef = ref}}
            onContentSizeChange={() => {
              if (this.flatListRef) {
                this.flatListRef.scrollToEnd();
              }
            }}
            renderItem={({item})=>{
              return (
                <View style={item.author === this.self ? 
                  chatStyles.chatTextSelfContainer :
                  chatStyles.chatTextOtherContainer
                }>
                  {item.type === 'text' ?
                    <Text style={item.author === this.self ? 
                      chatStyles.chatTextSelf :
                      chatStyles.chatTextOther
                    }>
                      {item.text}
                    </Text>
                  :
                  <Image
                    style={{width: this.imageWidth, height: this.imageHeight}}
                    source={{uri: item.imageURL}}
                  />
                }
                </View>
              );
            }}
          />
        </View>
        <View style={chatStyles.inputContainer}>
          <View style={chatStyles.inputRow}>
            <Ionicons 
              name='ios-camera' 
              size={44}
              color={colors.primary}
              onPress={this.onTakePicture}
            />
            <TextInput 
              style={chatStyles.inputBox}
              value={this.state.inputText}
              returnKeyType={'send'}
              onChangeText={(text) => {
                this.setState({inputText: text})
              }}
              onSubmitEditing={this.onMessageSend}/>
            <Ionicons 
              name='md-send' 
              size={36}
              color={colors.primary}
              onPress={this.onMessageSend}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}