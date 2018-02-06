/**
 * Created by pierremarsot on 15/05/2017.
 */
import {get} from '../tools/api';
import {add_notification} from './notification';

export const SEARCH_VIDEO_SUCCESS = 'SEARCH_VIDEO_SUCCESS';
export const SEARCH_VIDEO_ERROR = 'SEARCH_VIDEO_ERROR';

export const SEARCH_BY_KEYWORDS_VIDEO_SUCCESS = 'SEARCH_BY_KEYWORDS_VIDEO_SUCCESS';
export const SEARCH_BY_KEYWORDS_VIDEO_ERROR = 'SEARCH_BY_KEYWORDS_VIDEO_ERROR';

export const SEARCH_BY_SPORT_VIDEO_SUCCESS = 'SEARCH_BY_SPORT_VIDEO_SUCCESS';
export const SEARCH_BY_SPORT_VIDEO_ERROR = 'SEARCH_BY_SPORT_VIDEO_ERROR';

export const SEARCH_MORE_VIDEO_SUCCESS = 'SEARCH_MORE_VIDEO_SUCCESS';
export const SEARCH_MORE_BY_KEYWORDS_VIDEO_SUCCESS = 'SEARCH_MORE_BY_KEYWORDS_VIDEO_SUCCESS';

export const SEARCH_MORE_BY_SPORT_VIDEO_SUCCESS = 'SEARCH_MORE_BY_SPORT_VIDEO_SUCCESS';

function search_video_success(payload) {
  return {
    type: SEARCH_VIDEO_SUCCESS,
    videos: payload,
  };
}

function search_video_error() {
  return {
    type: SEARCH_VIDEO_ERROR,
  };
}

export function search_video(offset) {
  return dispatch => {
    get("/search/videos", {
      offset: offset,
    })
      .then((response) => {
        return dispatch(search_video_success(response));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        dispatch(add_notification('error', response.error));
        return dispatch(search_video_error());
      });
  };
}

function search_more_video_success(payload) {
  return {
    type: SEARCH_MORE_VIDEO_SUCCESS,
    videos: payload,
  };
}

export function search_more_video(offset) {
  return dispatch => {
    get("/search/videos", {
      offset: offset,
    })
      .then((response) => {
        return dispatch(search_more_video_success(response));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        return dispatch(add_notification('error', response.error));
      });
  };
}

function search_by_sport_video_success(payload) {
  return {
    type: SEARCH_BY_SPORT_VIDEO_SUCCESS,
    videos: payload,
  };
}

function search_by_sport_video_error() {
  return {
    type: SEARCH_BY_SPORT_VIDEO_ERROR,
  };
}

export function search_by_sport_video(offset, id_sport){
  return dispatch => {
    if(!id_sport || id_sport.length === 0){
      return dispatch(add_notification('error', 'Vous devez renseigner un sport'));
    }

    get("/search/sport/videos", {
      offset: offset,
      id_sport: id_sport,
    })
      .then((response) => {
        return dispatch(search_by_sport_video_success(response));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        dispatch(add_notification('error', response.error));
        return dispatch(search_by_sport_video_error());
      });
  };
}

function search_by_keywords_video_success(payload) {
  return {
    type: SEARCH_BY_KEYWORDS_VIDEO_SUCCESS,
    videos: payload,
  };
}

function search_by_keywords_video_error() {
  return {
    type: SEARCH_BY_KEYWORDS_VIDEO_ERROR,
  };
}

export function search_by_keywords_video(offset, keywords) {
  return dispatch => {

    if(!keywords || keywords.length === 0){
      return dispatch(add_notification('error', 'Vous devez renseigner au moins un mot clef'));
    }

    get("/search/keywords/videos", {
      offset: offset,
      keywords: keywords,
    })
      .then((response) => {
        return dispatch(search_by_keywords_video_success(response));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        dispatch(add_notification('error', response.error));
        return dispatch(search_by_keywords_video_error());
      });
  };
}

function search_more_by_keywords_video_success(payload) {
  return {
    type: SEARCH_MORE_BY_KEYWORDS_VIDEO_SUCCESS,
    videos: payload,
  };
}

export function search_more_by_keywords_video(offset, keywords) {
  return dispatch => {
    get("/search/keywords/videos", {
      offset: offset,
      keywords: keywords,
    })
      .then((response) => {
        return dispatch(search_more_by_keywords_video_success(response));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        return dispatch(add_notification('error', response.error));
      });
  };
}

function search_more_by_sport_video_success(payload) {
  return {
    type: SEARCH_MORE_BY_SPORT_VIDEO_SUCCESS,
    videos: payload,
  };
}

export function search_more_by_sport_video(offset, id_sport) {
  return dispatch => {
    get("/search/sport/videos", {
      offset: offset,
      id_sport: id_sport,
    })
      .then((response) => {
        return dispatch(search_more_by_sport_video_success(response));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        return dispatch(add_notification('error', response.error));
      });
  };
}