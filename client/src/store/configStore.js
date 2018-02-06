import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

import explore from '../reducers/explore';
import auth from '../reducers/auth';
import profile from '../reducers/profile';
import manageVideo from '../reducers/manageVideo';
import notification from '../reducers/notification';
import sport from '../reducers/sport';

import reduxReset from 'redux-reset'

const logger = createLogger();
const rootReducer = combineReducers(
  {
    explore,
    auth,
    profile,
    manageVideo,
    notification,
    sport
  }
);

const initialState = {};

export default function configureStore() {
  let store;

  if (module.hot) {
    store = createStore(rootReducer, initialState, compose(
      applyMiddleware(thunkMiddleware, logger),
      reduxReset(),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
  } else {
    store = createStore(rootReducer, initialState, compose(
      applyMiddleware(thunkMiddleware),
      reduxReset(),
      f=>f
    ));
  }

  return store;
}
