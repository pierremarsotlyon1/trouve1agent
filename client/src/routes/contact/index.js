/**
 * Created by pierremarsot on 25/03/2017.
 */
const rootRoute = {
  path: '/contact/sportif/:id',

  getComponents(nextState, callback) {
    require.ensure([], function (require) {
      callback(null, require('../../components/contact/ContactSportif').default);
    })
  }
};

export default rootRoute;