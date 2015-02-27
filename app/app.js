import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import philHelper from './helpers/phil';

Ember.MODEL_FACTORY_INJECTIONS = true;

Ember.Handlebars.registerBoundHelper('phil', philHelper);

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
