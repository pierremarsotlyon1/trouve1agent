/**
 * Created by pierremarsot on 25/03/2017.
 */
const rootRoute = {
  path: '/videos',

  getChildRoutes(partialNextState, callback) {
    require.ensure([], function (require) {
      callback(null, [
        require('./add/index').default,
        require('./update/index').default,
      ]);
    })
  },

  getIndexRoute(partialNextState, callback) {
    require.ensure([], function (require) {
      callback(null, {
        component: require('../../components/videos/AffichageVideo').default,
      });
    })
  },

  getComponents(nextState, callback) {
    require.ensure([], function (require) {
      callback(null, require('../../containers/videos/ManageVideo').default);
    })
  }
};

export default rootRoute;