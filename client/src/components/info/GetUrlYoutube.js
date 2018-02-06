/**
 * Created by pierremarsot on 25/05/2017.
 */
import React from 'react';
import Link from 'react-router/lib/Link';

import './get-url-youtube.css';

const GetUrlYoutube = () => (
  <section className="bg--secondary space--sm">
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center">
          <h2>
            Importer une vidéo sur Youtube
          </h2>
        </div>
      </div>
      <div className="row">
        <h4>
          1. Accédez à <Link to="https://www.youtube.com" target="_blanck">Youtube</Link>
        </h4>
        <h4>
          2. Connectez-vous à votre compte Youtube
        </h4>
        <h4>
          3. Cliquez sur le bouton d'upload d'une vidéo dans le menu du haut : <img className="img-upload-video" src="/assets/img/upload-youtube.png"/>
        </h4>
        <h4>
          4. Importer votre vidéo dans l'emplacement voulu
        </h4>
        <p><strong>Important:</strong> mettre la confidentialité en <strong>Public</strong></p>
        <h4>
          5. Une fois l'importation terminée, cliquez sur "Publier"
        </h4>
        <h4>
          6. Cliquez sur "l'image de votre vidéo" qui se situe à gauche des informations suivantes : titre, partage, réseaux sociaux ...
        </h4>
        <h4>
          7. Le lien de votre vidéo se situe dans votre barre d'adresse (https://www.youtube.com/watch?v=...)
        </h4>
      </div>
    </div>
  </section>
);

export default GetUrlYoutube;