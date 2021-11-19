import {gql} from '@apollo/client';
import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FloatingIconContainer from './components/Icon';
import apolloClient from './utils/apollo-client';

let heartCount = 0;
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
        this.addHeart();
        // console.log({subRes});
      });
  }

  state: {hearts: {id: number; right: number}[] | null} = {
    hearts: null,
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

  addHeart = () => {
    heartCount++;
    this.setState({
      ...this.state,
      hearts:
        this.state.hearts != null
          ? [
              ...this.state.hearts,
              {
                id: heartCount,
                right: this.getRandomNumber(0, Dimensions.get('window').width),
              },
            ]
          : [
              {
                id: heartCount,
                right: this.getRandomNumber(0, Dimensions.get('window').width),
              },
            ],
    });
  };

  removeHeart = (id: number) => {
    this.setState({
      ...this.state,
      hearts:
        this.state.hearts != null
          ? this.state.hearts.filter(heart => {
              return heart.id !== id;
            })
          : this.state.hearts,
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.hearts?.map(heart => {
          return (
            <FloatingIconContainer
              iconName="heart"
              key={heart.id}
              style={{right: heart.right}}
              onComplete={() => {
                this.removeHeart(heart.id);
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
            <FontAwesomeIcon color="red" size={25} name="heart" />
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
