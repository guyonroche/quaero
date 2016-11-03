import React, {Component} from 'react';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

import Dialogs from './components/dialogs';
import Header from './components/header';
import Footer from './components/footer';

import Home from './components/home';
import SignUp from './components/sign-up';
import Question from './components/question';

const App = () => (
  <div>
    <Dialogs />
    
    <Header />

    <Router history={hashHistory}>
      <Route path="/" component={Home} />
      <Route path="/signup" component={SignUp} />
      <Route path="/question/:id" component={Question} />
    </Router>

    <Footer />
  </div>
);


export default App;
