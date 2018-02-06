/**
 * Created by pierremarsot on 01/06/2017.
 */
import React from 'react';

const Footer = () => (
  <footer className="footer-7 text-center-xs bg--secondary  ">
    <div className="container">
      <div className="row">
        <div className="col-sm-6"><span
          className="type--fine-print">©<span className="update-year">2017 </span>
              trouve1agent.com — Tous droits réservés</span></div>
        <div className="col-sm-6 text-right text-center-xs">
          <ul className="social-list list-inline">
            <li>
              <a href="https://twitter.com/trouve1agent" target="_blanck">
                <i className="socicon socicon-twitter icon icon--xs"></i>
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/trouve1agent" target="_blanck">
                <i className="socicon socicon-facebook icon icon--xs"></i>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/groups/12049488" target="_blanck">
                <i className="socicon socicon-linkedin icon icon--xs"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;