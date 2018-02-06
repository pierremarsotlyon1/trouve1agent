/**
 * Created by pierremarsot on 14/05/2017.
 */
import React from 'react';
import {connect} from 'react-redux';
import Link from 'react-router/lib/Link';
import {browserHistory} from 'react-router';
import {isSportif, isConnected} from '../../tools/auth';

import {logout} from '../../actions/logout';

class Header extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      menuMobile: false,
    };
  }

  componentWillReceiveProps(nextProps){
    if(this.props.token && this.props.token.length > 0){
      if(!nextProps.token || nextProps.token.length === 0){
        browserHistory.push('/');
      }
    }
  }

  handleLogout = (e) => {
    e.preventDefault();

    this.props.dispatch(logout());
  };

  showMenuMobile = (e) => {
    e.preventDefault();

    this.setState({
      menuMobile: !this.state.menuMobile,
    });
  };

  render() {
    const {
      token,
      type
    } = this.props;

    const haveSportif = isSportif();

    const {
      menuMobile
    } = this.state;

    let classMenu =
      menuMobile ? "bar bar--sm bar-1 bg--white" : "bar bar--sm bar-1 hidden-xs hiddem-sm bg--secondary";
    const hrefLogo = isConnected() ? "/explore" : "/";

    let menu = [];

    if (!token || token.length === 0 || (type < 1 || type > 2) ) {
      menu.push(
        <li key="1">
          <Link to="/login">
            Connexion
          </Link>
        </li>
      );

      menu.push(
        <li key="2">
          <Link to="/register">
            Inscription
          </Link>
        </li>
      );
    }
    else {
      menu.push(
        <li key="4">
          <Link to="/explore">
            Explorer
          </Link>
        </li>
      );
      if(haveSportif){
        menu.push(
          <li key="3">
            <Link to="/settings/sportif">
              Mon compte
            </Link>
          </li>
        );
        menu.push(
          <li key="2">
            <Link to="/videos">
              Mes vidéos
            </Link>
          </li>
        );
      }
      else{
        menu.push(
          <li key="3">
            <Link to="/settings/agent">
              Mon compte
            </Link>
          </li>
        );
      }

      menu.push(
        <li key="1">
          <Link to="#" onClick={this.handleLogout}>
            Déconnexion
          </Link>
        </li>
      );
    }

    const urlLogo = process.env.PUBLIC_URL + '/assets/img/logo-trouve1agent.png';

    return (
      <div className="nav-container ">
        <div className="bar bar--sm visible-xs">
          <div className="container">
            <div className="row">
              <div className="col-xs-3 col-sm-2">
                <Link to={hrefLogo}>
                  <img className="logo logo-dark" alt="logo" src={urlLogo}/>
                  <img className="logo logo-light" alt="logo" src={urlLogo}/>
                </Link>
              </div>
              <div className="col-xs-9 col-sm-10 text-right">
                <a href="#" className="hamburger-toggle" data-toggle-className="#menu1;hidden-xs" onClick={this.showMenuMobile}>
                  <i className="icon icon--sm stack-interface stack-menu"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <nav id="menu1" className={classMenu}>
          <div className="container">
            <div className="row">
              <div className="col-md-1 col-sm-2 hidden-xs">
                <div className="bar__module">
                  <Link to={hrefLogo}>
                    <img className="logo logo-dark" alt="logo" src={urlLogo}/>
                    <img className="logo logo-light" alt="logo" src={urlLogo}/>
                  </Link>
                </div>
              </div>
              <div className="col-md-11 col-sm-10 text-right text-left-xs">
                <div className="bar__module">
                  <ul className="menu-horizontal">
                    {menu}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
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

export default connect(mapStateToProps)(Header);