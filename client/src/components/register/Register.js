/**
 * Created by pierremarsot on 18/05/2017.
 */
import React from 'react';
import Link from 'react-router/lib/Link';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {isConnected} from '../../tools/auth';
import {register, validate_informations_register} from '../../actions/register';
import Checkbox from 'material-ui/Checkbox';

class Register extends React.Component {
  constructor(props) {
    super(props);

    if (isConnected()) {
      browserHistory.push('/explore');
    }

    this.state = {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      confirm_password: '',
      telephone: '',
      numeroAgrement: '',
      type: 0,
      agreeCGU: false,
      enableBtnRegister: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.token && nextProps.token.length > 0) {
      browserHistory.push('/explore');
    }
  }

  handleNom = (e) => {
    e.preventDefault();

    const nom = e.target.value;

    this.setState({
      nom: nom,
    }, () => {
      this.handleEnableBtnRegister();
    });
  };

  handlePrenom = (e) => {
    e.preventDefault();

    const prenom = e.target.value;

    this.setState({
      prenom: prenom,
    }, () => {
      this.handleEnableBtnRegister();
    });
  };

  handleEmail = (e) => {
    e.preventDefault();

    const email = e.target.value;

    this.setState({
      email: email,
    }, () => {
      this.handleEnableBtnRegister();
    });
  };

  handlePassword = (e) => {
    e.preventDefault();

    const password = e.target.value;

    this.setState({
      password: password,
    }, () => {
      this.handleEnableBtnRegister();
    });
  };

  handleConfirmPassword = (e) => {
    e.preventDefault();

    const confirm_password = e.target.value;

    this.setState({
      confirm_password: confirm_password,
    }, () => {
      this.handleEnableBtnRegister();
    });
  };

  handleTelephone = (e) => {
    e.preventDefault();

    const telephone = e.target.value;

    this.setState({
      telephone: telephone,
    }, () => {
      this.handleEnableBtnRegister();
    });
  };

  handleType = (e) => {
    e.preventDefault();

    const type = e.target.value;

    this.setState({
      type: Number.parseInt(type),
    }, () => {
      this.handleEnableBtnRegister();
    });
  };

  handleNumeroAgrement = (e) => {
    e.preventDefault();

    const numero_agrement = e.target.value;

    this.setState({
      numeroAgrement: numero_agrement,
    }, () => {
      this.handleEnableBtnRegister();
    });
  };

  handleAgreeCGU = (e, isChecked) => {
    this.setState({
      agreeCGU: isChecked,
    }, () => {
      this.handleEnableBtnRegister();
    });
  };

  handleEnableBtnRegister = () => {
    const {
      nom,
      prenom,
      telephone,
      email,
      password,
      confirm_password,
      type,
      numeroAgrement,
      agreeCGU,
    } = this.state;

    validate_informations_register(
      nom,
      prenom,
      telephone,
      email,
      password,
      confirm_password,
      type,
      numeroAgrement
    ).then(() => {
      this.setState({
        enableBtnRegister: !agreeCGU,
      });
    })
      .catch(() => {
        this.setState({
          enableBtnRegister: true,
        });
      });
  };

  handleRegister = (e) => {
    e.preventDefault();

    const {
      nom,
      prenom,
      telephone,
      email,
      password,
      confirm_password,
      type,
      numeroAgrement,
    } = this.state;

    this.props.dispatch(register(
      nom,
      prenom,
      telephone,
      email,
      password,
      confirm_password,
      type,
      numeroAgrement
    ));
  };

  render() {

    const {
      type,
      enableBtnRegister,
      agreeCGU,
    } = this.state;


    let inputs = [];

    inputs.push(
      <div className="col-md-12" key="1">
        <div className="input-select">
          <select onChange={this.handleType}>
            <option selected="" value="Default">Qui êtes-vous ?</option>
            <option value="1">Sportif</option>
            <option value="2">Agent</option>
          </select>
        </div>
      </div>
    );

    if (type !== 0) {
      inputs.push(
        <div className="col-sm-12" key="2">
          <input
            type="text"
            placeholder="Nom"
            onChange={this.handleNom}
          />
        </div>
      );

      inputs.push(
        <div className="col-sm-12" key="3">
          <input
            type="text"
            placeholder="Prénom"
            onChange={this.handlePrenom}
          />
        </div>
      );

      inputs.push(
        <div className="col-sm-12" key="4">
          <input
            type="number"
            placeholder="Telephone"
            onChange={this.handleTelephone}
          />
        </div>
      );

      //Si c'est un agent
      if (type === 2) {
        inputs.push(
          <div className="col-sm-12" key="5">
            <input
              type="text"
              placeholder="Numéro d'agrément"
              onChange={this.handleNumeroAgrement}
            />
          </div>
        )
      }

      inputs.push(
        <div className="col-sm-12" key="6">
          <input
            type="email"
            placeholder="Email"
            onChange={this.handleEmail}
          />
        </div>
      );

      inputs.push(
        <div className="col-sm-12" key="7">
          <input
            type="password"
            placeholder="Mot de passe"
            onChange={this.handlePassword}
          />
        </div>
      );

      inputs.push(
        <div className="col-sm-12" key="8">
          <input
            type="password"
            placeholder="Confirmation du mot de passe"
            onChange={this.handleConfirmPassword}
          />
        </div>
      );

      inputs.push(
        <div className="col-sm-12" key="9">
          <div className="col-sm-1">
            <Checkbox
              checked={agreeCGU}
              onCheck={this.handleAgreeCGU}
              labelStyle={{color: '#03a9f4', checkedColor: '#03a9f4'}}
              iconStyle={{fill: 'white'}}
            />
          </div>
          <span>J'ai lu et j'accepte <Link to="/cgu" className="cursor">les conditions générales d'utilisation</Link></span>
        </div>
      );
    }

    return (
      <section className="imagebg text-center bg--black">
        <div className="row">
          <div className="col-sm-7 col-md-5">
            <h2>Créez votre compte</h2>
            <p className="lead">
              Cela vous permettra de publier / gérer vos annonces
            </p>
            <form>
              <div className="row">
                {inputs}
                <div className="col-sm-12">
                  <button
                    className="btn btn--primary type--uppercase"
                    type="submit"
                    disabled={enableBtnRegister}
                    onClick={this.handleRegister}
                  >
                    Créez votre compte
                  </button>
                </div>
              </div>
            </form>
            <span className="type--fine-print block">Déjà un compte ?
                                <Link to="/login">
                                  Connectez-vous
                                </Link>
                            </span>
          </div>
        </div>
      </section>
    )
  }
}

function mapStateToProps(state) {
  const {auth} = state;
  return {
    token: auth.token,
    type: auth.type,
  };
}

export default connect(mapStateToProps)(Register);