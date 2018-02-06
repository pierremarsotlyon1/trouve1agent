/**
 * Created by pierremarsot on 20/05/2017.
 */
import {
  ADD_VIDEO_SUCCESS,
  LOAD_VIDEOS_SPORTIF_SUCCESS,
  REMOVED_VIDEO_ERROR,
  REMOVED_VIDEO_SUCCESS,
  UPDATE_VIDEO_ERROR,
  UPDATE_VIDEO_SUCCESS,
  SET_VIDEO_TO_UPDATE_SUCCESS,
  RESET_VIDEO_TO_UPDATE_SUCCESS,
} from '../actions/manageVideo';

const initialState = {
  videos: [],
  video_to_update: null,
};

export default function manageVideo(state = initialState, action = {}){
  switch(action.type){
    case ADD_VIDEO_SUCCESS:
      const video = action.video;
      if(!video){
        return state;
      }

      return {
        ...state,
        videos: state.videos.concat(video),
      };

    case LOAD_VIDEOS_SPORTIF_SUCCESS:
      const videos = action.videos;
      if(!videos){
        return {
          ...state,
          videos: [],
        };
      }

      return {
        ...state,
        videos: videos,
      };

    case REMOVED_VIDEO_SUCCESS:
      const _id = action._id;

      if(!_id || _id.length === 0){
        return state;
      }

      return {
        ...state,
        videos: state.videos.filter((v) => {
          return v._id !== _id;
        })
      };

    case REMOVED_VIDEO_ERROR:
      return state;

    case UPDATE_VIDEO_SUCCESS:
      const videoUpdated = action.videoUpdated;

      if(!videoUpdated){
        return state;
      }

      let newTabVideos = state.videos.filter((a) => {
        return a._id !== videoUpdated._id;
      });

      return {
        ...state,
        videos: newTabVideos.concat(videoUpdated)
      };

    case SET_VIDEO_TO_UPDATE_SUCCESS:
      const videoToUpdate = action.videoToUpdate;
      if(!videoToUpdate){
        return {
          ...state,
          video_to_update: null,
        };
      }

      return {
        ...state,
        video_to_update: videoToUpdate,
      };

    case RESET_VIDEO_TO_UPDATE_SUCCESS:
      return {
        ...state,
        video_to_update: null,
      };

    default:
      return state;
  }
}