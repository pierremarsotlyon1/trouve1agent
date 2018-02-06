/**
 * Created by pierremarsot on 20/05/2017.
 */
import React from 'react';
import Link from 'react-router/lib/Link';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {isConnected, isSportif} from '../../tools/auth';
import ReactTooltip from 'react-tooltip'
import {SimpleSelect} from 'react-selectize';

import {add_video, update_video, set_video_to_update, reset_video_to_update} from '../../actions/manageVideo';
import {load_sports} from '../../actions/sport';

import './add-or-update-video.css';
import 'react-selectize/themes/index.css';

class AddOrUpdateVideo extends React.Component {
  constructor(props) {
    super(props);

    if (!isConnected() || !isSportif()) {
      browserHistory.push('/');
    }

    this.state = {
      _id: '',
      _source: {
        filename: '',
        keywords_sport: '',
        id_sport: '',
      },
      adding: true,
      updating: false,
      canAddOrUpdate: false,
    };
  }

  componentDidMount() {
    //On charge les sports
    this.props.dispatch(load_sports());

    const _id = this.props.params.id;

    if (_id && _id.length > 0) {
      //On est en train d'update une vidéo
      this.setState({
        adding: false,
        updating: true,
      });

      this.props.dispatch(reset_video_to_update());

      //On va rechercher la vidéo
      this.props.dispatch(set_video_to_update(_id));
    }

    this.canAddOrUpdate();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.adding) {
      if (nextProps.videos.length > this.props.videos.length) {
        browserHistory.push('/videos');
      }
    }
    else if (this.state.updating) {
      if (!this.props.video_to_update && nextProps.video_to_update) {
        const videoToUpdate = nextProps.video_to_update;
        this.setState({
          _id: videoToUpdate._id,
          _source: videoToUpdate._source,
        }, () => {
          this.canAddOrUpdate();
        });
      }
      else {
        if (this.props.videos !== nextProps.videos) {
          browserHistory.push('/videos');
        }
        else {
          const videoToUpdate = nextProps.video_to_update;
          this.setState({
            _id: videoToUpdate._id,
            _source: videoToUpdate._source,
          }, () => {
            this.canAddOrUpdate();
          });
        }
      }
    }
  }

  canAddOrUpdate = () => {
    const _source = this.state._source;

    this.setState({
      canAddOrUpdate: _source.filename && _source.filename.length > 0
      && _source.id_sport && _source.id_sport.length > 0
    });
  };

  setSource = (_source) => {
    this.setState({
      _source: _source
    }, () => {
      this.canAddOrUpdate();
    });
  };

  handleKeywords = (e) => {
    const {_source} = this.state;

    _source.keywords_sport = e.target.value;

    this.setSource(_source)
  };

  handleFilename = (e) => {
    const {_source} = this.state;

    _source.filename = e.target.value;

    this.setSource(_source)
  };

  handleSubmitVideo = (e) => {
    e.preventDefault();

    const {_source} = this.state;

    this.props.dispatch(add_video(
      _source.filename,
      _source.id_sport,
      _source.keywords_sport,
    ));
  };

  handleUpdatedVideo = (e) => {
    e.preventDefault();

    const {_source, _id} = this.state;

    this.props.dispatch(update_video(
      _id,
      _source.filename,
      _source.id_sport,
      _source.keywords_sport,
    ));
  };

  handleSport = (val) => {
    const {_source} = this.state;

    _source.id_sport = val ? val.value : '';

    this.setSource(_source);
  };


  render() {

    const {_source, adding, updating, canAddOrUpdate} = this.state;
    const {sports} = this.props;

    let buttonFormulaire = undefined;
    let selectSports = undefined;

    if (adding) {
      buttonFormulaire =
        <button disabled={!canAddOrUpdate} type="submit" className="btn btn--primary" onClick={this.handleSubmitVideo}>
          Ajouter la vidéo</button>;
    }
    else if (updating) {
      buttonFormulaire =
        <button disabled={!canAddOrUpdate} type="submit" className="btn btn--primary" onClick={this.handleUpdatedVideo}>
          Modifier la vidéo</button>;
    }

    if (sports && sports.length > 0) {
      let optionsSport = [];
      let defaultValue;

      for (const sport of sports) {
        if(sport._id === _source.id_sport){
          defaultValue = {label: sport._source.nom_sport, value: sport._id};
        }

        optionsSport.push(
          <option value={sport._id} key={sport._id}>{sport._source.nom_sport}</option>
        );
      }

      console.log(defaultValue);

      selectSports =
        <SimpleSelect
          placeholder="Renseignez le sport pratiqué dans la vidéo"
          onValueChange={this.handleSport}
          theme="material"
          defaultValue={defaultValue}
          className="col-sm-12 col-md-12"
        >
          {optionsSport}
        </SimpleSelect>
    }

    return (
      <section className="bg--secondary space--sm">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-sm-12 col-xs-12 col-md-offset-3">
              <form>
                <div className="row m-b-15">
                  <h4>Informations :</h4>
                  <div className="col-sm-12">
                    <label>Url Youtube</label>
                    <input
                      type="text"
                      className="validate-required"
                      placeholder="https://www.youtube.com/watch?v="
                      value={_source.filename}
                      onChange={this.handleFilename}
                    />
                    <Link to="/info/url-youtube" className="get-url-youtube">
                      Comment obtenir mon url Youtube ?
                    </Link>
                  </div>
                  <div className="col-sm-12">
                    {selectSports}
                  </div>
                  <div className="col-sm-12">
                    <label
                      data-tip="Mots clefs qui représente le contenu de votre vidéo : 'football compétition course ...'">Mots
                      clefs <i className="fa fa-question-circle" aria-hidden="true"></i></label>
                    <input type="text" placeholder="Athlétisme, course à pied ..." className="validate-required"
                           value={_source.keywords_sport}
                           onChange={this.handleKeywords}/>
                  </div>
                </div>

                <div className="col-sm-12">
                  {buttonFormulaire}
                </div>
              </form>
            </div>
          </div>
        </div>
        <ReactTooltip />
      </section>
    )
  }
}

function mapStateToProps(state) {
  const {manageVideo, sport} = state;
  return {
    video_to_update: manageVideo.video_to_update,
    videos: manageVideo.videos,
    sports: sport.sports,
  };
}

export default connect(mapStateToProps)(AddOrUpdateVideo);