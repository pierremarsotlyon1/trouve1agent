/**
 * Created by pierremarsot on 25/03/2017.
 */
const rootRoute = {
  path: '/info/url-youtube',

  getComponents(nextState, callback) {
    require.ensure([], function (require) {
      callback(null, require('../../components/info/GetUrlYoutube').default);
    })
  }
};

export default rootRoute;