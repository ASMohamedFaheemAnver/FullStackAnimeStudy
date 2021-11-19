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
      subscription {
        getChatIconEmits {
          type
        }
      }
    `;
    subscriptionPromis = apolloClient
      .subscribe({query: subscription})
      .subscribe(subRes => {
        this.addIcon();
        // console.log({subRes});
      });
  }

  state: {emittedIcons: {id: number; right: number}[] | null} = {
    emittedIcons: null,
  };

  getRandomNumber = (max: number, min: number) => {
    return Math.random() * (max - min) + min;
  };

  async onIconClick() {
    const mutation = gql`
      mutation emitChatIcon($type: String!) {
        emitChatIcon(type: $type)
      }
    `;
    const res = await apolloClient.mutate({
      mutation: mutation,
      variables: {
        type: 'heart',
      },
    });
  }

  addIcon = () => {
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
              },
            ]
          : [
              {
                id: emittedIconsCount,
                right: this.getRandomNumber(0, Dimensions.get('window').width),
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
          return (
            <FloatingIconContainer
              icon={require('./img/love.png')}
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
          }}>
          <TouchableOpacity
            onPress={this.onIconClick}
            style={{
              height: 50,
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'pink',
              borderRadius: 40,
              margin: 20,
            }}>
            <Image
              style={{height: 50, width: 50}}
              source={require('./img/love.png')}
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
