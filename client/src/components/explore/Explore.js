import React from 'react';
import {connect} from 'react-redux';
import Video from '../video/Video';
import {isConnected} from '../../tools/auth';
import {browserHistory} from 'react-router';
import {SimpleSelect} from 'react-selectize';

import {
  search_video,
  search_more_video,
  search_by_keywords_video,
  search_by_sport_video,
  search_more_by_keywords_video,
  search_more_by_sport_video,
} from '../../actions/explore';

import {load_sports} from '../../actions/sport';

import 'react-selectize/themes/index.css';

const sizeSearchVideo = 10;

class Explore extends React.Component {
  constructor(props) {
    super(props);

    if(!isConnected()){
      browserHistory.push('/');
    }

    this.state = {
      offset: 0,
      keywords: '',
      id_sport: '',
    };
  }

  componentDidMount() {
    this.props.dispatch(search_video(this.state.offset));
    this.props.dispatch(load_sports());
  }

  showMore = (e) => {
    e.preventDefault();

    const offset = this.state.offset + sizeSearchVideo;

    this.setState({
      offset: offset,
    }, () => {
      if (this.state.id_sport && this.state.id_sport.length > 0) {
        this.props.dispatch(search_more_by_sport_video(this.state.offset, this.state.id_sport));
      }
      else {
        this.props.dispatch(search_more_video(this.state.offset));
      }
    });
  };

  /*handleKeywords = (e) => {
    e.preventDefault();

    this.setState({
      keywords: e.target.value,
    });
  };*/

  handleSport = (sport) => {
    this.setState({
      id_sport: sport ? sport.value : '',
    });
  };

  /*handleSearchByKeywords = (e) => {
    e.preventDefault();

    this.setState({
      offset: 0,
    }, () => {
      if (this.state.keywords && this.state.keywords.length > 0) {
        this.props.dispatch(search_by_keywords_video(this.state.offset, this.state.keywords));
      }
      else {
        this.props.dispatch(search_video(this.state.offset));
      }
    });
  };*/

  handleSearchBySport = (e) => {
    e.preventDefault();

    this.setState({
      offset: 0,
    }, () => {
      if (this.state.id_sport && this.state.id_sport.length > 0) {
        this.props.dispatch(search_by_sport_video(this.state.offset, this.state.id_sport));
      }
      else {
        this.props.dispatch(search_video(this.state.offset));
      }
    });
  };

  render() {

    const {
      videos,
      showMoreVideo,
      sports,
    } = this.props;

    const tabVideos = [];
    let btnShowMore;
    let selectSports;

    if (videos.length > 0) {
      for (const video of videos) {
        tabVideos.push(
          <div className="row text-center" key={video._id}>
            <Video
              video={video}
              deleted={false}
              updated={false}
              showKeywords={false}
              contact={true}
              className="col-sm-6 col-sm-offset-3 col-xs-12 filter-filter-1"
            />
          </div>
        )
      }
    }
    else {
      tabVideos.push(
        <div className="boxed boxed--border" key="explore_empty">
          <h5>Pas encore de vidéo <i className="fa fa-meh-o" aria-hidden="true"></i></h5>
        </div>
      );
    }

    if(showMoreVideo && videos.length > 9){
      btnShowMore = <div className="col-md-4 col-md-offset-4 col-sm-12">
        <button
          className="col-md-12 col-sm-12 col-xs-12 btn btn--primary type--uppercase"
          onClick={this.showMore}
        >
          En voir plus
        </button>
      </div>;
    }

    if (sports && sports.length > 0) {
      let optionsSport = [];

      for (const sport of sports) {
        optionsSport.push(
          <option value={sport._id} key={sport._id}>{sport._source.nom_sport}</option>
        );
      }

      selectSports =
        <SimpleSelect
          placeholder="Renseignez le sport pratiqué dans la vidéo"
          onValueChange={this.handleSport}
          theme="material"
          className="col-sm-12 col-md-12"
        >
          {optionsSport}
        </SimpleSelect>
    }

    return (
      <section className="bg--secondary space--sm">
        <div className="container">
          <div className="row m-b-45">
            <form className="form--horizontal">
              <div className="col-sm-9">
                {selectSports}
              </div>
              <div className="col-sm-3">
                <button
                  type="submit"
                  className="btn btn--primary type--uppercase"
                  onClick={this.handleSearchBySport}
                >
                  Rechercher
                </button>
              </div>
            </form>
          </div>
          <div className="row">
            {tabVideos}
            {btnShowMore}
          </div>
        </div>
      </section>
    )
  }
}

function mapStateToProps(state) {
  const {explore, sport} = state;

  if (!explore || !sport) {
    return {
      videos: [],
      sports: [],
    };
  }

  return {
    videos: explore.videos,
    showMoreVideo: explore.showMoreVideo,
    sports: sport.sports,
  };
}

export default connect(mapStateToProps)(Explore);