/**
 * Created by pierremarsot on 25/03/2017.
 */
const rootRoute = {
  path: '/settings',

  getChildRoutes(partialNextState, callback) {
    require.ensure([], function (require) {
      callback(null, [
        require('./agent/index').default,
        require('./sportif/index').default,
      ]);
    })
  },
};

export default rootRoute;