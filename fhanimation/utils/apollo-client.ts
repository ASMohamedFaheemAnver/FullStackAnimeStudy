import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {SubscriptionClient} from 'subscriptions-transport-ws';
import Constatns from './constatns';

const httpLink = createHttpLink({
  uri: Constatns.APOLLO_HITPOINT_URL,
});

const client = new SubscriptionClient(Constatns.APOLLO_WS_URL, {
  reconnect: true,
  minTimeout: 55000,
});

const wsLink = new WebSocketLink(client);

const errorLink = onError(({graphQLErrors, networkError}) => {
  if (networkError) console.error(networkError);
  if (graphQLErrors) graphQLErrors.map(({message}) => console.error(message));
});

const apolloClient = new ApolloClient({
  link: split(
    ({query}) => {
      const def = getMainDefinition(query);
      return (
        def.kind === 'OperationDefinition' && def.operation === 'subscription'
      );
    },
    wsLink,
    ApolloLink.from([errorLink, httpLink]),
  ),
  cache: new InMemoryCache({
    typePolicies: {
      Fee: {
        fields: {
          tracks: {
            merge(exsiting = [], incomming) {
              return [...incomming];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {fetchPolicy: 'no-cache'},
    query: {fetchPolicy: 'no-cache'},
    mutate: {fetchPolicy: 'no-cache'},
  },
});

export default apolloClient;
