/**
 * Created by pierremarsot on 15/05/2017.
 */
import {
  SEARCH_MORE_VIDEO_SUCCESS,
  SEARCH_VIDEO_ERROR,
  SEARCH_VIDEO_SUCCESS,
  SEARCH_BY_KEYWORDS_VIDEO_ERROR,
  SEARCH_BY_KEYWORDS_VIDEO_SUCCESS,
  SEARCH_MORE_BY_KEYWORDS_VIDEO_SUCCESS,
  SEARCH_BY_SPORT_VIDEO_ERROR,
  SEARCH_BY_SPORT_VIDEO_SUCCESS,
  SEARCH_MORE_BY_SPORT_VIDEO_SUCCESS,
} from '../actions/explore';

const initialState = {
  videos: [],
  showMoreVideo: true,
};

export default function explore(state = initialState, action = {}) {
  switch (action.type) {
    case SEARCH_BY_SPORT_VIDEO_SUCCESS:
    case SEARCH_VIDEO_SUCCESS:
      const videos = action.videos;

      if (!videos || videos.length === 0) {
        return {
          ...state,
          videos: []
        };
      }

      return {
        ...state,
        videos: videos,
        showMoreVideo: true,
      };

    case SEARCH_MORE_BY_SPORT_VIDEO_SUCCESS:
    case SEARCH_MORE_BY_KEYWORDS_VIDEO_SUCCESS:
    case SEARCH_MORE_VIDEO_SUCCESS:
      const videos_more = action.videos;

      if (!videos_more || videos_more.length === 0) {
        return {
          ...state,
          showMoreVideo: false,
        };
      }

      return {
        ...state,
        videos: state.videos.concat(videos_more),
        showMoreVideo: true,
      };

    case SEARCH_BY_KEYWORDS_VIDEO_SUCCESS:
      const videos_keywords = action.videos;
      if (!videos_keywords) {
        return {
          ...state,
          videos: [],
          showMoreVideo: false,
        };
      }

      return {
        ...state,
        videos: videos_keywords,
        showMoreVideo: true,
      };

    case SEARCH_BY_SPORT_VIDEO_ERROR:
    case SEARCH_VIDEO_ERROR:
    case SEARCH_BY_KEYWORDS_VIDEO_ERROR:
      return {
        ...state,
        videos: [],
        showMoreVideo: false,
      };

    default:
      return state;
  }
}