import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NotFound from './components/pages/NotFound';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import ForgetPassword from './components/pages/ForgetPassword';
import Protocol from './components/pages/Protocol';
import DataProtocol from './components/pages/DataProtocol';
import App from './App';

export default () => (
    <Router>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/login" push />} />
            <Route path="/app" component={App} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/protocol" component={Protocol} />
            <Route path="/dataProtocol" component={DataProtocol} />
            <Route path="/forgetPassword" component={ForgetPassword} />
            <Route path="/404" component={NotFound} />
            <Route component={NotFound} />
        </Switch>
    </Router>
)