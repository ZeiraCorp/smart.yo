/**
 * Created by k33g_org on 18/02/16.
 */
var traceur = require('traceur');
traceur.require.makeDefault(function(filename) {
  // don't transpile our dependencies, just our app
  return filename.indexOf('node_modules') === -1;
});
require('./signals');