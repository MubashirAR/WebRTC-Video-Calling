import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Call from './pages/Call';
import AuthRedirect from './components/HOC/AuthRedirect';
import Connections from './pages/Connections';

export default props => {
  return (
    <Router>
      <Switch>
        <Route path="/"  component={Home} exact/>
        <Route path="/login" component={Login}  exact/>
        <Route path="/register" component={Register}  exact/>
        <Route path="/call" exact>
          <AuthRedirect>
            <Call />
          </AuthRedirect>
        </Route>
        <Route path="/connections" exact>
          <AuthRedirect>
            <Connections />
          </AuthRedirect>
        </Route>
      </Switch>
    </Router>
  );
};
