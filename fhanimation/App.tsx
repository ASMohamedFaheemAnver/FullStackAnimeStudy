import {gql} from '@apollo/client';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FloatingIconContainer from './components/Icon';
import apolloClient from './utils/apollo-client';
import Constants from './utils/constants';

let emittedIconsCount = 0;
let subscriptionPromis: ZenObservable.Subscription;

class App extends React.Component {
  componentWillUnmount() {
    console.log({emit: 'componentWillUnmount'});
    subscriptionPromis.unsubscribe();
  }

  async componentDidMount() {
    console.log({emit: 'componentDidMount'});
    const query = gql`
      query {
        _
      }
    `;
    const rootQueryRes = await apolloClient.query({query});
    console.log({rootQueryRes});
    const subscription = gql`
      subscription ($env: String!) {
        getChatIconEmits(env: $env) {
          type
        }
      }
    `;
    subscriptionPromis = apolloClient
      .subscribe({
        query: subscription,
        variables: {
          env: 'udev',
        },
      })
      .subscribe(subRes => {
        this.addIcon(subRes.data?.getChatIconEmits?.type);
        console.log({type: subRes.data?.getChatIconEmits?.type});
      });
  }

  state: {emittedIcons: {id: number; right: number; type: string}[] | null} = {
    emittedIcons: null,
  };

  getRandomNumber = (max: number, min: number) => {
    return Math.random() * (max - min) + min;
  };

  async onIconClick(type: string) {
    const mutation = gql`
      mutation ($type: String!) {
        emitChatIcon(type: $type)
      }
    `;
    const res = await apolloClient.mutate({
      mutation: mutation,
      variables: {
        type,
      },
    });
  }

  addIcon = (type: string) => {
    emittedIconsCount++;
    this.setState({
      ...this.state,
      emittedIcons:
        this.state.emittedIcons != null
          ? [
              ...this.state.emittedIcons,
              {
                id: emittedIconsCount,
                right: this.getRandomNumber(0, Dimensions.get('window').width),
                type: type,
              },
            ]
          : [
              {
                id: emittedIconsCount,
                right: this.getRandomNumber(0, Dimensions.get('window').width),
                type: type,
              },
            ],
    });
  };

  removeIcon = (id: number) => {
    this.setState({
      ...this.state,
      emittedIcons:
        this.state.emittedIcons != null
          ? this.state.emittedIcons.filter(icon => {
              return icon.id !== id;
            })
          : this.state.emittedIcons,
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.emittedIcons?.map(icon => {
          let source;
          switch (icon.type) {
            case Constants.ANGRY:
              source = require(`./img/angry.png`);
              break;
            case Constants.HAHA:
              source = require(`./img/haha.png`);
              break;
            case Constants.SAD:
              source = require(`./img/sad.png`);
              break;
            case Constants.WOW:
              source = require(`./img/wow.png`);
              break;
            default:
              source = require(`./img/love.png`);
          }
          return (
            <FloatingIconContainer
              icon={source}
              key={icon.id}
              style={{right: icon.right}}
              onComplete={() => {
                this.removeIcon(icon.id);
              }}
            />
          );
        })}

        <View
          style={{
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.onIconClick(Constants.HAHA);
            }}
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'pink',
              borderRadius: 40,
              marginBottom: 5,
            }}>
            <Image
              style={{height: 40, width: 40}}
              source={require('./img/haha.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.onIconClick(Constants.WOW);
            }}
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'pink',
              borderRadius: 40,
              marginBottom: 5,
            }}>
            <Image
              style={{height: 40, width: 40}}
              source={require('./img/wow.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.onIconClick(Constants.LOVE);
            }}
            style={{
              height: 80,
              width: 80,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'pink',
              borderRadius: 40,
              marginBottom: 5,
            }}>
            <Image
              style={{height: 40, width: 40}}
              source={require('./img/love.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.onIconClick(Constants.SAD);
            }}
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'pink',
              borderRadius: 40,
              marginBottom: 5,
            }}>
            <Image
              style={{height: 40, width: 40}}
              source={require('./img/sad.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.onIconClick(Constants.ANGRY);
            }}
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'pink',
              borderRadius: 40,
              marginBottom: 5,
            }}>
            <Image
              style={{height: 40, width: 40}}
              source={require('./img/angry.png')}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
});

export default App;
