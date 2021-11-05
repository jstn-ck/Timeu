import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './main.scss';
import Login from '@/views/Login/Login';
import Dashboard from '@/views/Dashboard/Dashboard';
import Register from '@/views/Login/Register';
import Reset from '@/views/Login/Reset';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/reset" component={Reset} />
    </Switch>
  </Router>
  , document.getElementById('root'));
