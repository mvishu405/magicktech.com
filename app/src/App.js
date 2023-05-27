import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'

// Containers
import { DefaultLayout } from './containers';
// Pages
import { Addquotelineitem } from './views/Pages';
import { Login } from './views';

// import { renderRoutes } from 'react-router-config';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
        <Switch>
          <Route exact path="/login/" name="Login Page" component={Login} />
          <Route path="/" name="Home" component={DefaultLayout} />
          <Route path="/addquotelineitem" component={Addquotelineitem}/>
        </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
