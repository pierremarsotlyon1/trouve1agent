/**
 * Created by pierremarsot on 25/05/2017.
 */
const getYouTubeID = require('get-youtube-id');

class YoutubeUrl {
  constructor(){

  }

  static isYoutubeUrl(url){
    if(!url || url.length === 0){
      return false;
    }

    if(!url.includes('www.youtube.com')){
      return false;
    }

    if(!url.includes('watch')){
      return false;
    }

    const id = getYouTubeID(url);
    if(!id || id.length === 0){
      return false;
    }

    return true;
  }
}

export default YoutubeUrl;