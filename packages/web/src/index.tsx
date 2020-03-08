import React from 'react';
import ReactDOM from 'react-dom';
import { InMemoryCache } from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, Observable, FetchResult } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from '@apollo/react-hooks';
import jwtDecode from 'jwt-decode';
import { App } from './App';
import CssBaseline from '@material-ui/core/CssBaseline';
import './styles.css';
import store from './store';
import { StoreProvider } from 'easy-peasy';
import { URI } from './config/constants';
import { PauseResponseLink } from './PauseResponseLink';

const responseLoggerLink = new ApolloLink((operation, forward) => {
  const op = forward(operation);
  op.subscribe({
    next: res => console.log(res)
  });
  return op;
});

export const pauseResponseLink = new PauseResponseLink();

// Gets a new access token
//  if user is authenticated, but current token is expired
const tokenRefreshLink = new ApolloLink((operation, forward) => {
  const token = store.getState().auth.accessToken;

  // Not a logged in user, so proceed
  if (!token) return forward(operation);

  // Token is not expired, so proceed
  const { exp } = jwtDecode(token);
  if (Date.now() < (exp as number) * 1000) {
    return forward(operation);
  }

  // Token expired, so get a new one before proceeding
  return new Observable<FetchResult>(observer => {
    fetch(`${URI}/refresh_token`, {
      credentials: 'include',
      method: 'POST'
    })
      .then(res => res.json())
      .then(({ accessToken }) => {
        store.getActions().auth.setAccessToken(accessToken);
        forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer)
        });
      });
  });
});

// Adds accesstoken to authorization header
const authLink = setContext((_, { headers }) => {
  const token = store.getState().auth.accessToken;

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const httpLink = createHttpLink({
  uri: `${URI}/graphql`,
  credentials: 'include'
});

const client = new ApolloClient({
  link: ApolloLink.from([
    // responseLoggerLink,
    // pauseResponseLink,
    tokenRefreshLink,
    authLink,
    httpLink
  ]),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <StoreProvider store={store}>
      <CssBaseline>
        <App />
      </CssBaseline>
    </StoreProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
