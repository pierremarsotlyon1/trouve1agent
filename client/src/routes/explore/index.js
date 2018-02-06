/**
 * Created by pierremarsot on 25/03/2017.
 */
const rootRoute = {
  path: '/explore',

  getComponents(nextState, callback) {
    require.ensure([], function (require) {
      callback(null, require('../../components/explore/Explore').default);
    })
  }
};

export default rootRoute;