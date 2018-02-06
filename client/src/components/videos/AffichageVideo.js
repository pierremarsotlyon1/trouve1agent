/**
 * Created by pierremarsot on 20/05/2017.
 */
import React from 'react';
import {connect} from 'react-redux';
import Link from 'react-router/lib/Link';
import Video from '../video/Video';
import {isConnected, isSportif} from '../../tools/auth';
import {browserHistory} from 'react-router';

import {load_videos_sportif} from '../../actions/manageVideo';

class AffichageVideo extends React.Component {
  constructor(props) {
    super(props);

    if(!isConnected() || !isSportif()){
      browserHistory.push('/');
    }
  }

  componentDidMount() {
    this.props.dispatch(load_videos_sportif());
  }

  render() {

    const {videos} = this.props;

    const tabVideos = [];

    for (const video of videos) {
      tabVideos.push(
        <Video
          video={video}
          deleted={true}
          updated={true}
          contact={false}
          showKeywords={true}
          className="col-sm-6 col-sm-offset-3 col-xs-12 filter-filter-1"
          key={video._id}
        />
      );
    }

    if (tabVideos.length === 0) {
      tabVideos.push(
        <div className="boxed boxed--border" key="videos_empty">
          <h5>Vous n'avez pas encore de vidéo</h5>
          <p>
            Dépéchez-vous d'en ajouter pour pouvoir être recruté !
          </p>
        </div>
      );
    }

    return (
      <section className="bg--secondary space--sm">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-b-45">
              <Link to="/videos/add" className="pull-right">
                <button
                  className="btn btn--primary type--uppercase"
                >
                  Ajouter une vidéo
                </button>
              </Link>
            </div>
          </div>
          <div className="row">
            {tabVideos}
          </div>
        </div>
        <Link className="back-to-top inner-link active" to="/videos/add">
          <i className="stack-interface stack-plus-circled"></i>
        </Link>
      </section>
    )
  }
}

function mapStateToProps(state) {
  const {manageVideo} = state;
  return {
    videos: manageVideo.videos,
  };
}

export default connect(mapStateToProps)(AffichageVideo);