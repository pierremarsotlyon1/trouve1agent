/**
 * Created by pierremarsot on 25/03/2017.
 */
const rootRoute = {
  path: '/',

  getChildRoutes(partialNextState, callback) {
    require.ensure([], function (require) {
      callback(null, [
        require('./explore/index').default,
        require('./login/index').default,
        require('./register/index').default,
        require('./settings/index').default,
        require('./info/index').default,
        require('./cgu/index').default,
        require('./contact/index').default,
        require('./videos/index').default,
      ]);
    })
  },

  getIndexRoute(partialNextState, callback) {
    require.ensure([], function (require) {
      callback(null, {
        component: require('../components/home/Home').default,
      });
    })
  },

  getComponents(nextState, callback) {
    require.ensure([], function (require) {
      callback(null, require('../containers/layout/App').default);
    })
  }
};

export default rootRoute;