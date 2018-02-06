/**
 * Created by pierremarsot on 31/05/2017.
 */
import {
  LOAD_SPORTS_ERROR,
  LOAD_SPORTS_SUCCESS,
} from '../actions/sport';

const initialState = {
  sports: [],
};

export default function sport(state = initialState, action = {}){
  switch(action.type){
    case LOAD_SPORTS_SUCCESS:
      const sports = action.sports;
      if(!sports){
        return {
          ...state,
          sports: [],
        };
      }

      return {
        ...state,
        sports: sports,
      };

    case LOAD_SPORTS_ERROR:
      return {
        ...state,
        sports: [],
      };

    default:
      return state;
  }
}