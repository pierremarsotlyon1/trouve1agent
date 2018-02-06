/**
 * Created by pierremarsot on 20/05/2017.
 */
const rootRoute = {
  path: '/videos/update/:id',

  getComponents(nextState, callback) {
    require.ensure([], function (require) {
      callback(null, require('../../../components/videos/AddOrUpdateVideo').default);
    })
  }
};

export default rootRoute;