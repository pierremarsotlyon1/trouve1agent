/**
 * Created by pierremarsot on 25/03/2017.
 */
const rootRoute = {
  path: '/settings/sportif',

  getComponents(nextState, callback) {
    require.ensure([], function (require) {
      callback(null, require('../../../components/settings/sportif/Settings').default);
    })
  }
};

export default rootRoute;