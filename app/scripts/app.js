'use strict';

/**
 * @ngdoc overview
 * @name testmapApp
 * @description
 * # testmapApp
 *
 * Main module of the application.
 */
angular
  .module('testmapApp', [
    'ngAnimate',
    'nemLogging',
    'ui-leaflet',
    'ui.bootstrap',
    'angularModalService',
    'bc.AngularUrlEncode'
  ]);
