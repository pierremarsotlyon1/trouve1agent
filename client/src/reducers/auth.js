/**
 * Created by pierremarsot on 18/05/2017.
 */
import {
  LOGIN_ERROR,
  LOGIN_SUCCESS,
} from '../actions/login';

import {
  REMOVE_TOKEN,
} from '../actions/logout';

import {
  REGISTER_SUCCESS,
  REGISTER_ERROR,
} from '../actions/register';

import {setLocalStorage, getToken, ID_TOKEN, getLocalStorage, TYPE_ACCOUNT} from '../tools/localStorage';

const initialState = {
  token: getToken(),
  type: getLocalStorage(TYPE_ACCOUNT)
};

export default function login(state = initialState, action = {}){
  switch(action.type){
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      let {token, type_account} = action;
      type_account = Number.parseInt(type_account);

      if(!token || !setLocalStorage(ID_TOKEN, token) || !type_account || !setLocalStorage(TYPE_ACCOUNT, type_account)){
        return {
          ...state,
          token: '',
          type: 0,
        };
      }

      return {
        ...state,
        token: token,
        type: type_account,
      };

    case LOGIN_ERROR:
      return {
        token: '',
        type: 0,
      };

    case REMOVE_TOKEN:
      return {
        ...state,
        token: '',
        type: 0,
      };
    default:
      return state;
  }
}