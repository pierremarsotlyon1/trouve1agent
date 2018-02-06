/**
 * Created by pierremarsot on 14/05/2017.
 */
import React, {PropTypes} from 'react'
import Link from 'react-router/lib/Link';
import {isConnected} from '../../tools/auth';
import './home.css'
import { browserHistory } from 'react-router'

class Home extends React.Component {

  componentDidMount(){
    if(isConnected()){
      browserHistory.push('/explore');
    }
  }

  render(){
    return (
      <div>
        <section className="cover height-80 imagebg switchable presentation" data-overlay="8">
          <div className="container pos-vertical-center">
            <div className="row">
              <div className="col-md-12 text-center">
                <div className="switchable__text">
                  <h1>
                    Fais-toi remarquer !
                  </h1>
                  <p className="lead">
                    Parce que nous souhaitons vous donner toutes les chances pour vous faire recruter par un agent
                  </p>
                  <Link className="btn btn--primary type--uppercase" to="/login">
                                    <span className="btn__text">
                                        Connecte-toi
                                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="text-center">
          <div className="container">
            <div className="row">
              <div className="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
                <h2>Tous les outils dont tu as besoins</h2>
                <p className="lead">
                  Poste tes exploits en vidéo pour permettre de te faire remarquer au près d'agents
                </p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row">
              <div className="col-sm-4">
                <div className="feature feature-3 boxed boxed--lg boxed--border text-center">
                  <i className="icon icon--lg icon-Mail-3"></i>
                  <h4>Réseau social</h4>
                  <p>
                    Regarde les exploits d'autres sportifs et entre en compétition avec eux
                  </p>
                  <a href="/login">
                    En savoir plus
                  </a>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="feature feature-3 boxed boxed--lg boxed--border text-center">
                  <i className="icon icon--lg icon-Air-Balloon"></i>
                  <h4>Recrutement</h4>
                  <p>
                    Poste les meilleures vidéos de toi pour te faire recruter par un agent
                  </p>
                  <a href="/login">
                    En savoir plus
                  </a>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="feature feature-3 boxed boxed--lg boxed--border text-center">
                  <i className="icon icon--lg icon-Bacteria"></i>
                  <h4>Sport-Entreprise</h4>
                  <p>
                    Dispense des formations pour les entreprises et fais-toi recruter / sponsoriser
                  </p>
                  <a href="/login">
                    En savoir plus
                  </a>
                  <span className="label">A venir</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="experience">
          <div className="container">
            <div className="row">
              <div className="col-sm-7 col-md-5 col-sm-offset-5 col-md-offset-7 m-t-15">
                <div className="boxed boxed--lg border--round bg--white">
                  <div className="col-md-10 col-md-offset-1 col-sm-12">
                    <h3>De réelles opportunités</h3>
                    <p className="lead">
                      Marre d'envoyer des CV ou de faire du buzz sur les réseaux sociaux pour que l'on te remarque ?
                      <br/><br/>
                      Alors ta place est ici ! Nous te permettrons de te mettre en avant pour favoriser ta carrière sportive.
                    </p>
                    <hr className="short" />
                    <p>
                      Le meilleur reste à venir !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

Home.propTypes = {
  router: PropTypes.object
};

export default Home;