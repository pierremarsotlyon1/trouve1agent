/**
 * Created by pierremarsot on 25/05/2017.
 */
import React from 'react';
import {connect} from 'react-redux';
import EmailSender from '../../tools/EmailSender';
import {browserHistory} from 'react-router';

import {isAgent, isConnected} from '../../tools/auth';
import {add_notification} from '../../actions/notification';

class ContactSportif extends React.Component {
  constructor(props) {
    super(props);

    if(!isConnected() || !isAgent()){
      browserHistory.push('/explore');
    }

    const id = this.props.params.id;
    if(!id){
      browserHistory.push('/explore');
    }

    this.state = {
      message: '',
      id: id,
    };
  }

  handleMessage = (e) => {
    this.setState({
      message: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    EmailSender.sendEmailAgentToSportif(this.state.id, this.state.message)
      .then(() => {
        this.props.dispatch(add_notification('success', 'Votre message a bien été envoyé'));
      })
      .catch((response) => {
        if (!response || !response.error) {
          this.props.dispatch(add_notification('error', 'Erreur lors de l\'envoie du message'));
        }
        this.props.dispatch(add_notification('error', response.error));
      });
  };

  render() {
    return (
      <section className="text-center bg--secondary space--sm">
        <div className="container">
          <div className="row">
            <h3>Contacter le sportif</h3>
          </div>
          <div className="row">
            <div className="col-sm-8 col-md-7">
              <div className="row">
                <form className="text-left form-email">
                  <div className="col-sm-12">
                    <label>Votre message:</label>
                    <textarea
                      rows="6"
                      onChange={this.handleMessage}
                    ></textarea>
                  </div>
                  <div className="col-sm-12 col-md-12 text-center">
                    <button
                      className="btn btn--primary type--uppercase"
                      onClick={this.handleSubmit}
                    >
                      Envoyer votre message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default connect()(ContactSportif);