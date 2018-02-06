/**
 * Created by pierremarsot on 19/05/2017.
 */
import {get, putApi} from '../tools/api';
import {add_notification} from './notification';

export const LOAD_PROFILE_AGENT_SUCCESS = 'LOAD_PROFILE_AGENT_SUCCESS';
export const LOAD_PROFILE_AGENT_ERROR = 'LOAD_PROFILE_AGENT_ERROR';

export const UPDATE_PROFILE_AGENT_SUCCESS = 'UPDATE_PROFILE_AGENT_SUCCESS';
export const UPDATE_PROFILE_AGENT_ERROR = 'UPDATE_PROFILE_AGENT_ERROR';

export const UPDATE_PASSWORD_AGENT_SUCCESS = 'UPDATE_PASSWORD_AGENT_SUCCESS';
export const UPDATE_PASSWORD_AGENT_ERROR = 'UPDATE_PASSWORD_AGENT_ERROR';


export const LOAD_PROFILE_SPORTIF_SUCCESS = 'LOAD_PROFILE_SPORTIF_SUCCESS';
export const LOAD_PROFILE_SPORTIF_ERROR = 'LOAD_PROFILE_SPORTIF_ERROR';

export const UPDATE_PROFILE_SPORTIF_SUCCESS = 'UPDATE_PROFILE_SPORTIF_SUCCESS';
export const UPDATE_PROFILE_SPORTIF_ERROR = 'UPDATE_PROFILE_SPORTIF_ERROR';

export const UPDATE_PASSWORD_SPORTIF_SUCCESS = 'UPDATE_PASSWORD_SPORTIF_SUCCESS';
export const UPDATE_PASSWORD_SPORTIF_ERROR = 'UPDATE_PASSWORD_SPORTIF_ERROR';


/********* AGENT **********/


function load_profile_agent_success(payload) {
  return {
    type: LOAD_PROFILE_AGENT_SUCCESS,
    agent: payload,
  };
}

function load_profile_agent_error() {
  return {
    type: LOAD_PROFILE_AGENT_ERROR,
  };
}

export function load_profile_agent() {
  return dispatch => {
    get('/api/agent')
      .then((response) => {
        return dispatch(load_profile_agent_success(response))
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        dispatch(add_notification('error', response.error));
        return dispatch(load_profile_agent_error());
      });
  };
}

function update_profile_agent_success(payload) {
  return {
    type: UPDATE_PROFILE_AGENT_SUCCESS,
    agent: payload,
  };
}

function update_profile_agent_error() {
  return {
    type: UPDATE_PROFILE_AGENT_ERROR
  };
}

export function update_profile_agent(nom, prenom, telephone, numeroAgrement) {
  return dispatch => {
    if (!nom || nom.length === 0) {
      dispatch(add_notification('error', 'Vous devez renseigner un nom'));
      return dispatch(update_profile_agent_error());
    }

    if (!prenom || prenom.length === 0) {
      dispatch(add_notification('error', 'Vous devez renseigner un prénom'));
      return dispatch(update_profile_agent_error());
    }

    if (!telephone || telephone.length === 0) {
      dispatch(add_notification('error', 'Vous devez renseigner un telephone'));
      return dispatch(update_profile_agent_error());
    }

    if(!numeroAgrement || numeroAgrement.length === 0){
      dispatch(add_notification('error', 'Vous devez renseigner un numéro d\'agrément'));
      return dispatch(update_profile_agent_error());
    }

    putApi('/api/agent', {
      _source: {
        nom: nom,
        prenom: prenom,
        telephone: telephone,
        numero_agrement: numeroAgrement,
      }
    })
      .then((response) => {
        dispatch(add_notification('success', 'Votre profil a bien été modifié'));
        return dispatch(update_profile_agent_success(response));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        dispatch(add_notification('error', response.error));
        return dispatch(update_profile_agent_error());
      });
  };
}

function update_password_agent_success(){
  return {
    type: UPDATE_PASSWORD_AGENT_SUCCESS,
  };
}

function update_password_agent_error(){
  return {
    type: UPDATE_PASSWORD_AGENT_ERROR,
  };
}

export function update_password_agent(newPassword, confirmNewPassword){
  return dispatch => {
    if(!newPassword || newPassword.length === 0){
      dispatch(add_notification('error', 'Vous devez renseigner un mot de passe'));
      return dispatch(update_password_agent_error());
    }

    if(!confirmNewPassword || confirmNewPassword.length === 0){
      dispatch(add_notification('error', 'Vous devez confirmer votre mot de passe'));
      return dispatch(update_password_agent_error());
    }

    if(newPassword !== confirmNewPassword){
      dispatch(add_notification('error', 'Les mots de passe ne sont pas identique'));
      return dispatch(update_password_agent_error());
    }

    putApi('/api/agent/password', {
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    })
      .then((response) => {
        dispatch(add_notification('success', 'Votre mot de passe a bien été modifié'));
        return dispatch(update_password_agent_success());
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        dispatch(add_notification('error', response.error));
        return dispatch(update_password_agent_error());
      });
  };
}


/********* SPORTIF **********/

function load_profile_sportif_success(payload) {
  return {
    type: LOAD_PROFILE_SPORTIF_SUCCESS,
    sportif: payload,
  };
}

function load_profile_sportif_error() {
  return {
    type: LOAD_PROFILE_SPORTIF_ERROR,
  };
}

export function load_profile_sportif() {
  return dispatch => {
    get('/api/sportif')
      .then((response) => {
        return dispatch(load_profile_sportif_success(response))
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        dispatch(add_notification('error', response.error));
        return dispatch(load_profile_sportif_error());
      });
  };
}

function update_profile_sportif_success(payload) {
  return {
    type: UPDATE_PROFILE_SPORTIF_SUCCESS,
    sportif: payload,
  };
}

function update_profile_sportif_error() {
  return {
    type: UPDATE_PROFILE_SPORTIF_ERROR
  };
}

export function update_profile_sportif(nom, prenom, telephone) {
  return dispatch => {
    if (!nom || nom.length === 0) {
      dispatch(add_notification('error', 'Vous devez renseigner un nom'));
      return dispatch(update_profile_sportif_error());
    }

    if (!prenom || prenom.length === 0) {
      dispatch(add_notification('error', 'Vous devez renseigner un prénom'));
      return dispatch(update_profile_sportif_error());
    }

    if (!telephone || telephone.length === 0) {
      dispatch(add_notification('error', 'Vous devez renseigner un telephone'));
      return dispatch(update_profile_sportif_error());
    }

    putApi('/api/sportif', {
      _source: {
        nom: nom,
        prenom: prenom,
        telephone: telephone,
      }
    })
      .then((response) => {
        dispatch(add_notification('success', 'Votre profil a bien été modifié'));
        return dispatch(update_profile_sportif_success(response));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        dispatch(add_notification('error', response.error));
        return dispatch(update_profile_sportif_error());
      });
  };
}

function update_password_sportif_success(){
  return {
    type: UPDATE_PASSWORD_SPORTIF_SUCCESS,
  };
}

function update_password_sportif_error(){
  return {
    type: UPDATE_PASSWORD_SPORTIF_ERROR,
  };
}

export function update_password_sportif(newPassword, confirmNewPassword){
  return dispatch => {
    if(!newPassword || newPassword.length === 0){
      dispatch(add_notification('error', 'Vous devez renseigner un mot de passe'));
      return dispatch(update_password_sportif_error());
    }

    if(!confirmNewPassword || confirmNewPassword.length === 0){
      dispatch(add_notification('error', 'Vous devez confirmer votre mot de passe'));
      return dispatch(update_password_sportif_error());
    }

    if(newPassword !== confirmNewPassword){
      dispatch(add_notification('error', 'Les mots de passe ne sont pas identique'));
      return dispatch(update_password_sportif_error());
    }

    putApi('/api/sportif/password', {
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    })
      .then((response) => {
        dispatch(add_notification('success', 'Votre mot de passe a bien été modifié'));
        return dispatch(update_password_sportif_success());
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        dispatch(add_notification('error', response.error));
        return dispatch(update_password_sportif_error());
      });
  };
}