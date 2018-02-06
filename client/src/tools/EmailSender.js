/**
 * Created by pierremarsot on 25/05/2017.
 */
import {postApi} from './api';

class EmailSender {
  constructor() {

  }

  static sendEmailAgentToSportif(idSportif, message) {
    return new Promise((resolve, reject) => {
      console.log('message : ', message);
      if (!message || message.length === 0) {
        return reject('Votre message ne peut être vide');
      }

      const _source = {
          message: message,
          id_sportif: idSportif,
      };

      postApi('/api/contact/sportif', {
        _source: _source
      })
        .then((response) => {
          return resolve(response);
        })
        .catch((response) => {
          return reject(response);
        });
    });
  }
}

export default EmailSender;