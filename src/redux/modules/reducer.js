import { combineReducers } from 'redux';
import multireducer from 'multireducer';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

/*import auth from './auth';
import counter from './counter';
import {reducer as form} from 'redux-form';*/
import info from './info';
//import widgets from './widgets';
import registerNewUser from './registerNewUserReducer';
import activateNewUser from './activateNewUserReducer';
import getUser from './getUserReducer';
import getBlogEntries from './getBlogEntriesReducer';
import updateUser from './updateUserReducer';
import syncUserData from './syncUserDataReducer';
import getUserContent from './getUserContentReducer';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  /*auth,
  form,
  multireducer: multireducer({
    counter1: counter,
    counter2: counter,
    counter3: counter
  }),
  widgets,*/
  info,
  registerNewUser,
  activateNewUser,
  getUser,
  getBlogEntries,
  updateUser,
  syncUserData,
  getUserContent
});
