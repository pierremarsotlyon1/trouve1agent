/**
 * Created by pierremarsot on 23/05/2017.
 */
import {get} from '../tools/api';

class Profile {
  constructor() {

  }

  loadProfileSportif = (idSportif) => {
    return new Promise((resolve, reject) => {
      get('/api/sportif/' + idSportif)
        .then((response) => {
          return resolve(response);
        })
        .catch((response) => {
          return reject(response);
        });
    });
  };
}

export default Profile;