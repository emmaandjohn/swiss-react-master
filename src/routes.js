import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Activation,
    Article,
    Forgot,
    Home,
    Login,
    Register,
    Community,
    MyProfile,
    User,
    NotFound,
    Suche,
    Videos,
  } from 'containers';


export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home}/>

      { /* Routes requiring login
      <Route onEnter={requireLogin}>
        <Route path="chat" component={Chat}/>
        <Route path="loginSuccess" component={LoginSuccess}/>
      </Route>
      */ }

      { /* Routes */ }
      { /* <Route path="about" component={About}/> */ }
      <Route path="login" component={Login}/>
      <Route path="registrieren" component={Register}/>
      <Route path="community" component={Community}/>
      <Route path="community/:id" component={Article}/>
      <Route path="meinprofil" component={MyProfile}/>
      <Route path="user/:nickname" component={User}/>
      <Route path="suche" component={Suche}/>
      <Route path="videos" component={Videos}/>
      { /*<Route path="survey" component={Survey}/>
        <Route path="widgets" component={Widgets}/> */ }
      <Route path="activation" component={Activation}/>
      <Route path="forgot" component={Forgot}/>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
