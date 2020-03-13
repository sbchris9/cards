import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Content } from './components/Content';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { theme } from './config/theme';
import { useMeLazyQuery } from './generated/graphql';
import { useStoreState } from 'easy-peasy';
import { URI } from './config/constants';
import { DisplaySpinner } from './components/DisplaySpinner';
import { useStoreActions } from './hooks';

export const AppBase: React.FC = () => {
  const { accessToken } = useStoreState(store => store.auth);
  const [meQuery, { data, error }] = useMeLazyQuery({
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    meQuery();
  }, [meQuery, accessToken]);

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <TopBar user={error ? undefined : data?.me} />
        <Content>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
          </Switch>
        </Content>
        <Footer />
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setAccessToken } = useStoreActions(actions => actions.auth);

  useEffect(() => {
    fetch(`${URI}/refresh_token`, {
      method: 'POST',
      credentials: 'include'
    })
      .then(async res => {
        const { accessToken } = await res.json();
        setAccessToken(accessToken);
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
      });
  }, [setAccessToken]);

  if (isLoading) {
    return <DisplaySpinner />;
  }

  return <AppBase />;
};
