/**
 * Created by pierremarsot on 18/05/2017.
 */
import {postApi} from '../tools/api';
import {add_notification} from './notification';

export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_ERROR = 'REGISTER_ERROR';

function register_success(payload) {
  return {
    type: REGISTER_SUCCESS,
    token: payload.token,
    type_account: payload.type,
  };
}

function register_error() {
  return {
    type: REGISTER_ERROR,
  };
}

export function register(nom, prenom, telephone, email, password, confirmPassword, type, numero_agrement) {
  return dispatch => {

    validate_informations_register(nom, prenom, telephone, email, password, confirmPassword, type, numero_agrement)
      .then(() => {
        postApi('/register', {
          nom: nom,
          prenom: prenom,
          telephone: telephone,
          email: email,
          password: password,
          confirm_password: confirmPassword,
          type: type,
          numero_agrement: numero_agrement,
        })
          .then((response) => {
            return dispatch(register_success(response));
          })
          .catch((response) => {
            if(!response || !response.error){
              return false;
            }
            dispatch(add_notification('error', response.error));
            return dispatch(register_error());
          });
      })
      .catch((error) => {
        dispatch(add_notification('error', error));
        return dispatch(register_error());
      });
  };
}

export function validate_informations_register(nom, prenom, telephone, email, password, confirmPassword, type, numero_agrement){
  return new Promise((resolve, reject) => {
    if (!nom || nom.length === 0) {
      return reject('Vous devez renseigner un nom');
    }

    if (!prenom || nom.length === 0) {
      return reject('Vous devez renseigner un prénom');
    }

    if (!telephone || telephone.length !== 10) {
      return reject('Vous devez renseigner un numéro de telephone');
    }

    if (!email || email.length === 0) {
      return reject('Vous devez renseigner un email');
    }

    if (!password || password.length === 0) {
      return reject('Vous devez renseigner un mot de passe');
    }

    if (!confirmPassword || confirmPassword.length === 0) {
      return reject('Vous devez confirmer votre mot de passe');
    }

    if (confirmPassword !== password) {
      return reject('Les mots de passe ne sont pas identique');
    }

    if(!type || type < 1 || type > 2){
      return reject('Vous devez selectionner un type de compte');
    }

    if(type === 2){
      if(!numero_agrement || numero_agrement.length === 0){
        return reject('Vous devez renseigner un numéro d\'agrément');
      }
    }

    return resolve();
  });
}