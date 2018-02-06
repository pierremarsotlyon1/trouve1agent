/**
 * Created by pierremarsot on 20/05/2017.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import YouTube from 'react-youtube';
import Link from 'react-router/lib/Link';
const getYouTubeID = require('get-youtube-id');
import Profile from '../../tools/Profile';

import {remove_video} from '../../actions/manageVideo';
import {isSportif} from '../../tools/auth';

class Video extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showContact: false,
      emailSportif: '',
      telephoneSportif: '',
      isSportifAccount: isSportif(),
    };
  }

  removed = (_id) => {
    this.props.dispatch(remove_video(_id));
  };

  updated = (_id) => {
    browserHistory.push('/annonces/update/' + _id);
  };

  showContact = (idSportif) => {

    const profile = new Profile();
    profile.loadProfileSportif(idSportif)
      .then((response) => {
        this.setState({
          showContact: true,
          emailSportif: response._source.email,
          telephoneSportif: response._source.telephone,
        });
      })
      .catch(() => {
        this.setState({
          showContact: false,
          emailSportif: '',
          telephoneSportif: '',
        });
      });
  };

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  render() {
    const {
      video,
      deleted,
      updated,
      contact,
      className,
      showKeywords
    } = this.props;

    const {
      showContact,
      emailSportif,
      telephoneSportif,
      isSportifAccount
    } = this.state;

    const urlYoutube = video._source.filename;
    const idYoutube = getYouTubeID(urlYoutube);

    const keywords = video._source.keywords_sport;
    const nomSport = video._source.nom_sport;
    const classNameLocal = className && className.length > 0 ? className : "col-sm-6 col-xs-12 filter-filter-1";

    let btnDeleted;
    let btnUpdated;
    let btnContact;
    let keywordsBlock = [];

    if (deleted) {
      btnDeleted =
        <button
          onClick={() => this.removed(video._id)}
          className="btn btn--primary-2 type--uppercase m-l-15"
        >
          <span className="btn__text">Supprimer</span>
        </button>
    }

    if (updated) {
      const urlUpdate = "/videos/update/" + video._id;
      btnUpdated =
        <Link to={urlUpdate}>
          <button
            className="btn btn--primary type--uppercase"
          >
            Modifier
          </button>
        </Link>
    }

    if (contact && !isSportifAccount) {
      const urlContact = "/contact/sportif/" + video._parent;
      btnContact =
        <Link to={urlContact}>
          <button
            className="btn btn--primary type--uppercase"
          >
            Contacter le sportif
          </button>
        </Link>

    }

    if (showKeywords && keywords && keywords.length > 0) {
      keywordsBlock.push(<span key="keywords_1" className="h4 inline-block">Mots clefs :</span>);
      keywordsBlock.push(<span key="keywords_2"> {keywords}</span>);
    }

    const sportBlock = [
      <span key="sport_label" className="h4 inline-block">Sport :</span>,
      <span key="sport_value"> {nomSport}</span>
    ];

    return (
      <div className={classNameLocal}>
        <div className="boxed boxed--border">
          <div className="video-cover border--round">
            <YouTube
              videoId={idYoutube}
              onReady={this._onReady}
            />
          </div>
          <div>
            {keywordsBlock}
          </div>
          <div>
            {sportBlock}
          </div>
          <div className="col-md-12 text-center">
            {btnUpdated}
            {btnDeleted}
            <span className="text-center">
            {btnContact}
            </span>
          </div>
        </div>
      </div>
    )
  }
}

Video.propTypes = {
  video: PropTypes.object.isRequired,
  deleted: PropTypes.bool.isRequired,
  updated: PropTypes.bool.isRequired,
  contact: PropTypes.bool.isRequired,
  showKeywords: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export default connect()(Video);