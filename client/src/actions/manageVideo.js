/**
 * Created by pierremarsot on 20/05/2017.
 */
import {postApi, get, removeApi, putApi} from '../tools/api';
import YoutubeUrl from '../tools/YoutubeUrl';
import {add_notification} from './notification';

export const ADD_VIDEO_SUCCESS = 'ADD_VIDEO_SUCCESS';
export const REMOVED_VIDEO_SUCCESS = 'REMOVED_VIDEO_SUCCESS';
export const REMOVED_VIDEO_ERROR = 'REMOVED_VIDEO_ERROR';
export const UPDATE_VIDEO_SUCCESS = 'UPDATE_VIDEO_SUCCESS';
export const UPDATE_VIDEO_ERROR = 'UPDATE_VIDEO_ERROR';
export const SET_VIDEO_TO_UPDATE_SUCCESS = 'SET_VIDEO_TO_UPDATE_SUCCESS';
export const RESET_VIDEO_TO_UPDATE_SUCCESS = 'RESET_VIDEO_TO_UPDATE_SUCCESS';
export const LOAD_VIDEOS_SPORTIF_SUCCESS = 'LOAD_VIDEOS_SPORTIF_SUCCESS';

function load_videos_sportif_success(payload) {
  return {
    type: LOAD_VIDEOS_SPORTIF_SUCCESS,
    videos: payload,
  };
}

export function load_videos_sportif() {
  return dispatch => {
    get('/api/videos')
      .then((response) => {
        return dispatch(load_videos_sportif_success(response));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        return dispatch(add_notification('error', response.error));
      });
  };
}

function add_video_success(payload) {
  return {
    type: ADD_VIDEO_SUCCESS,
    video: payload,
  };
}

export function add_video(url_youtube,
                          id_sport,
                          keywords,) {
  return dispatch => {

    if (!url_youtube || url_youtube.length === 0) {
      dispatch(add_notification('error', 'Vous devez renseigner un url Youtube'));
      return false;
    }

    if(!YoutubeUrl.isYoutubeUrl(url_youtube)){
      dispatch(add_notification('error', 'L\'url renseignée n\'est pas une url Youtube'));
      return false;
    }

    if (!id_sport || id_sport.length === 0) {
      dispatch(add_notification('error', 'Vous devez renseigner votre sport'));
      return false;
    }

    //On récup l'adresse
    postApi('/api/videos', {
      _source: {
        filename: url_youtube,
        id_sport: id_sport,
        keywords_sport: keywords,
      }
    })
      .then((response) => {
        dispatch(add_notification('success', 'Votre vidéo a bien été ajoutée'));
        return dispatch(add_video_success(response));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        return dispatch(add_notification('error', response.error));
      });
  };
}

function removed_video_success(_id) {
  return {
    type: REMOVED_VIDEO_SUCCESS,
    _id: _id,
  };
}

function removed_video_error() {
  return {
    type: REMOVED_VIDEO_ERROR,
  }
}

export function remove_video(_id) {
  return dispatch => {
    if (!_id || _id.length === 0) {
      dispatch(add_notification('error', 'Erreur lors de la récupération de l\'identifiant de la vidéo'));
      return false;
    }

    removeApi('/api/videos/' + _id)
      .then((response) => {
        dispatch(add_notification('success', 'Votre vidéo a bien été supprimée'));
        return dispatch(removed_video_success(_id));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        dispatch(add_notification('error', response.error));
        return dispatch(removed_video_error());
      });
  };
}

function update_video_success(videoUpdated) {
  return {
    type: UPDATE_VIDEO_SUCCESS,
    videoUpdated: videoUpdated,
  }
}

function update_video_error() {
  return {
    type: UPDATE_VIDEO_ERROR
  }
}

export function update_video(_id,
                             url_youtube,
                             id_sport,
                             keywords) {
  return dispatch => {

    if (!_id || _id.length === 0) {
      dispatch(add_notification('error', 'Erreur lors de la récupération de l\'identifiant de la vidéo'));
      return false;
    }

    if(!url_youtube || url_youtube.length === 0){
      dispatch(add_notification('error', 'Vous devez renseigner une url Youtube'));
      return false;
    }

    if(!YoutubeUrl.isYoutubeUrl(url_youtube)){
      dispatch(add_notification('error', 'L\'url renseignée n\'est pas une url Youtube'));
      return false;
    }

    if (!id_sport || id_sport.length === 0) {
      dispatch(add_notification('error', 'Vous devez renseigner votre sport'));
      return false;
    }

    const _source = {
      _source: {
        keywords_sport: keywords,
        filename: url_youtube,
        id_sport: id_sport,
      }
    };

    putApi('/api/videos/' + _id, _source)
      .then(() => {
        dispatch(add_notification('success', 'Votre vidéo a bien été modifiée'));
        return dispatch(update_video_success(
          {
            _id: _id,
            _source: _source._source,
          }
        ));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        return dispatch(add_notification('error', response.error));
      });
  };
}

function set_video_to_update_success(payload) {
  return {
    type: SET_VIDEO_TO_UPDATE_SUCCESS,
    videoToUpdate: payload,
  };
}

export function set_video_to_update(_id) {
  return dispatch => {
    if (!_id || _id.length === 0) {
      dispatch(add_notification('error', 'Erreur lors de la récupération de l\'identifiant de la vidéo'));
      return false;
    }

    get('/api/videos/' + _id)
      .then((response) => {
        return dispatch(set_video_to_update_success(response));
      })
      .catch((response) => {
        if(!response || !response.error){
          return false;
        }
        return dispatch(add_notification('error', response.error));
      });
  }
}

export function reset_video_to_update(){
  return dispatch => {
    return dispatch({
      type: RESET_VIDEO_TO_UPDATE_SUCCESS,
    });
  };
}