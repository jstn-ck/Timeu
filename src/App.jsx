import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './main.scss';
import Login from '@/views/Auth/Login';
import Dashboard from '@/views/Dashboard/Dashboard';
import Register from '@/views/Auth/Register';
import Reset from '@/views/Auth/Reset';

// Main view components which will render first at Dom init
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