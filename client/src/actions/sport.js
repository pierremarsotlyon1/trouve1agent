/**
 * Created by pierremarsot on 31/05/2017.
 */
import {get} from '../tools/api';
import {add_notification} from './notification';

export const LOAD_SPORTS_SUCCESS = 'LOAD_SPORTS_SUCCESS';
export const LOAD_SPORTS_ERROR = 'LOAD_SPORTS_ERROR';

function load_sports_success(sports) {
  return {
    type: LOAD_SPORTS_SUCCESS,
    sports: sports,
  };
}

function load_sports_error() {
  return {
    type: LOAD_SPORTS_ERROR,
  };
}

export function load_sports() {
  return dispatch => {
    get('/sports')
      .then((sports) => {
      if(!sports){
        return dispatch(load_sports_error());
      }

      //On trie les sports par ordre alphabétique
      if(sports && sports.length > 0){
        sports = sports.sort((a, b) => {
          return a._source.nom_sport > b._source.nom_sport ? 1 : -1;
        });
      }
        return dispatch(load_sports_success(sports));
      })
      .catch((response) => {
        dispatch(load_sports_error());
        return dispatch(add_notification('error', response.error));
      });
  };
}