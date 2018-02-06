/**
 * Created by pierremarsot on 18/05/2017.
 */
import {postApi} from '../tools/api';
import {add_notification} from './notification';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

function login_success(payload) {
  return {
    type: LOGIN_SUCCESS,
    token: payload.token,
    type_account: payload.type,
  };
}

function login_error() {
  return {
    type: LOGIN_ERROR,
  };
}

export function login(email, password) {
  return dispatch => {
    if (!email || email.length === 0) {
      return dispatch(add_notification('error', 'Vous devez renseigner un email'));
    }

    if (!password || password.length === 0) {
      return dispatch(add_notification('error', 'Vous devez renseigner un mot de passe'));
    }

    postApi('/login', {
      email: email,
      password: password,
    })
      .then((response) => {
        return dispatch(login_success(response));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        return dispatch(add_notification('error', response.error));
      });
  };
}