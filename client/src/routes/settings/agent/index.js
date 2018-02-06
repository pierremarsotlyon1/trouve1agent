/**
 * Created by pierremarsot on 25/03/2017.
 */
const rootRoute = {
  path: '/settings/agent',

  getComponents(nextState, callback) {
    require.ensure([], function (require) {
      callback(null, require('../../../components/settings/agent/Settings').default);
    })
  }
};

export default rootRoute;