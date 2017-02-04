import { combineReducers } from 'redux';
import multireducer from 'multireducer';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

import info from './info';
import registerNewUser from './registerNewUserReducer';
import activateNewUser from './activateNewUserReducer';
import getUser from './getUserReducer';
import getBlogEntries from './getBlogEntriesReducer';
import getUserEntries from './getUserEntriesReducer';
import getRateEntries from './getRateEntriesReducer';
import getCommentEntries from './getCommentEntriesReducer';
import getSearchEntries from './getSearchEntriesReducer';
import updateUser from './updateUserReducer';
import syncUserData from './syncUserDataReducer';
import getUserContent from './getUserContentReducer';
import msgBox from './msgBoxReducer';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  info,
  registerNewUser,
  activateNewUser,
  getUser,
  getBlogEntries,
  getUserEntries,
  getRateEntries,
  getCommentEntries,
  getSearchEntries,
  updateUser,
  syncUserData,
  syncUserData,
  getUserContent,
  msgBox
});
