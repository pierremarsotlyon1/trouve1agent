/**
 * Created by pierremarsot on 19/05/2017.
 */
import React from 'react';
import {connect} from 'react-redux';
import {isConnected, isAgent} from '../../../tools/auth';
import {browserHistory} from 'react-router';

import {
  load_profile_agent,
  update_profile_agent,
  update_password_agent
} from '../../../actions/profile';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    if(!isConnected() || !isAgent()){
      browserHistory.push('/');
    }

    this.state = {
      agent: null,
      tabAccountInformations: true,
      tabAccountPassword: false,
      newPassword: '',
      confirmNewPassword: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.agent) {
      this.setState({
        agent: nextProps.agent,
      });
    }
  }

  componentDidMount() {
    this.props.dispatch(load_profile_agent());
  }

  handleNom = (e) => {
    e.preventDefault();

    const agent = this.state.agent;

    agent._source.nom = e.target.value;

    this.setState({
      agent: agent,
    });
  };

  handlePrenom = (e) => {
    e.preventDefault();

    const agent = this.state.agent;

    agent._source.prenom = e.target.value;

    this.setState({
      agent: agent,
    });
  };

  handleTelephone = (e) => {
    e.preventDefault();

    const agent = this.state.agent;

    agent._source.telephone = e.target.value;

    this.setState({
      agent: agent,
    });
  };

  handleNumeroAgrement = (e) => {
    e.preventDefault();

    const agent = this.state.agent;

    agent._source.numero_agrement = e.target.value;

    this.setState({
      agent: agent,
    });
  };

  handleSaveProfile = (e) => {
    e.preventDefault();

    const agent = this.state.agent;

    this.props.dispatch(update_profile_agent(agent._source.nom, agent._source.prenom, agent._source.telephone, agent._source.numero_agrement));
  };

  handleTabAccountPassword = (e) => {
    e.preventDefault();
    this.setState({
      tabAccountInformations: false,
      tabAccountPassword: true,
    });
  };

  handleTabAccountInformations = (e) => {
    e.preventDefault();
    this.setState({
      tabAccountInformations: true,
      tabAccountPassword: false,
    });
  };

  handleNewPassword = (e) => {
    e.preventDefault();

    this.setState({
      newPassword: e.target.value,
    });
  };

  handleConfirmNewPassword = (e) => {
    e.preventDefault();

    this.setState({
      confirmNewPassword: e.target.value,
    });
  };

  handleChangePassword = (e) => {
    e.preventDefault();

    this.props.dispatch(update_password_agent(this.state.newPassword, this.state.confirmNewPassword));
  };

  render() {
    const {agent} = this.props;
    const {tabAccountInformations, tabAccountPassword, newPassword, confirmNewPassword} = this.state;

    //On initialise les informations du formulaire "informations gérant"
    const nom = agent ? agent._source.nom : '';
    const prenom = agent ? agent._source.prenom : '';
    const email = agent ? agent._source.email : '';
    const telephone = agent ? agent._source.telephone : '';
    const numeroAgrement = agent ? agent._source.numero_agrement : '';

    //On regarde quelle tab on va afficher
    let tab = undefined;
    if (tabAccountInformations) {
      tab = <div id="account-profile" className="account-tab">
        <h4>Mes informations</h4>
        <form>
          <div className="row">
            <div className="col-sm-6">
              <label>Nom</label>
              <input type="text" value={nom} onChange={this.handleNom}/>
            </div>
            <div className="col-sm-6">
              <label>Prénom</label>
              <input type="text" value={prenom} onChange={this.handlePrenom}/>
            </div>
            <div className="col-sm-12">
              <label>Telephone</label>
              <input type="text" value={telephone} onChange={this.handleTelephone}/>
            </div>
            <div className="col-sm-12">
              <label>Numéro d'agrément</label>
              <input
                type="text"
                placeholder="Numéro d'agrément"
                value={numeroAgrement}
                onChange={this.handleNumeroAgrement}
              />
            </div>
            <div className="col-md-5 col-sm-6 text-center">
              <button
                type="submit"
                className="btn btn--primary type--uppercase"
                onClick={this.handleSaveProfile}
              >
                Sauvegarder mes informations
              </button>
            </div>
          </div>
        </form>
      </div>;
    }
    else if (tabAccountPassword) {
      tab = <div id="account-password" className="account-tab">
        <h4>Changement du mot de passe</h4>
        <form>
          <div className="row">
            <div className="col-sm-6">
              <label>Nouveau mot de passe</label>
              <input type="password" name="new-password" value={newPassword} onChange={this.handleNewPassword}/>
            </div>
            <div className="col-sm-6">
              <label>Confirmer le mot de passe:</label>
              <input type="password" name="new-password-confirm" value={confirmNewPassword}
                     onChange={this.handleConfirmNewPassword}/>
            </div>
            <div className="col-md-6 col-sm-6">
              <button
                type="submit"
                className="btn btn--primary type--uppercase"
                onClick={this.handleChangePassword}
              >
                Changer mon mot de passe
              </button>
            </div>
          </div>
        </form>
      </div>
    }

    return (
      <section className="bg--secondary space--sm">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="boxed boxed--lg boxed--border">
                <div className="text-block">
                  <ul className="menu-vertical">
                    <li>
                      <a href="#account-profile" onClick={this.handleTabAccountInformations}>
                        Mes informations
                      </a>
                    </li>
                    <li>
                      <a href="#account-password" onClick={this.handleTabAccountPassword}>
                        Modifier mon mot de passe</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="boxed boxed--lg boxed--border">
                {tab}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

function mapStateToProps(state) {
  const {profile} = state;
  return {
    agent: profile.agent,
  };
}

export default connect(mapStateToProps)(Settings);