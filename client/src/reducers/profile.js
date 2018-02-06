/**
 * Created by pierremarsot on 19/05/2017.
 */
import {
  LOAD_PROFILE_AGENT_ERROR,
  LOAD_PROFILE_AGENT_SUCCESS,
  UPDATE_PROFILE_AGENT_SUCCESS,
  UPDATE_PROFILE_AGENT_ERROR,
  LOAD_PROFILE_SPORTIF_ERROR,
  LOAD_PROFILE_SPORTIF_SUCCESS,
  UPDATE_PROFILE_SPORTIF_SUCCESS,
  UPDATE_PROFILE_SPORTIF_ERROR
} from '../actions/profile';

const initialState = {
  agent: null,
  sportif: null,
};

export default function profile(state = initialState, action = {}){
  switch (action.type){
    /***** AGENT *****/
    case LOAD_PROFILE_AGENT_ERROR:
      return {
        ...state,
        agent: null,
      };

    case UPDATE_PROFILE_AGENT_SUCCESS:
    case LOAD_PROFILE_AGENT_SUCCESS:
      const {agent} = action;
      if(!agent){
        return {
          ...state,
          agent: null,
        };
      }

      return {
        ...state,
        agent: agent,
      };

    case UPDATE_PROFILE_AGENT_ERROR:
      return state;


      /***** SPORTIF *****/
    case LOAD_PROFILE_SPORTIF_ERROR:
      return {
        ...state,
        sportif: null,
      };

    case UPDATE_PROFILE_SPORTIF_SUCCESS:
    case LOAD_PROFILE_SPORTIF_SUCCESS:
      const {sportif} = action;
      if(!sportif){
        return {
          ...state,
          sportif: null,
        };
      }

      return {
        ...state,
        sportif: sportif,
      };

    case UPDATE_PROFILE_SPORTIF_ERROR:
      return state;

    default:
      return state;
  }
}