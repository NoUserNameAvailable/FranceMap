'use strict';

/**
 * @ngdoc function
 * @name testmapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testmapApp
 */
angular.module('testmapApp')
  .controller('MainCtrl', ['$scope', 'nemSimpleLogger', 'ModalService', '$http', function ($scope, nemSimpleLogger, ModalService, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.hello = 'hello';

    nemSimpleLogger.log('hi');

    var carte0 = 'vide';
    var carte1 = '';
    var carte2 = '';
    var carte3 = '';
    $scope.cartes = [carte0, carte1, carte2, carte3];


    $scope.modalCarte = function (numCarte) {

      console.log($scope.cartes[numCarte]);

      ModalService.showModal({
        templateUrl: 'views/modal/carte.html',
        controller: 'ComplexController',
        inputs: {
          title: 'A More Complex Example',
          carte: $scope.cartes[numCarte]
        }
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          $scope.complexResult = 'Name: ' + result.name + ', age: ' + result.age;
        });
      });

    };

    $scope.$on("leafletDirectiveGeoJson.myMap.mouseover", function(ev, leafletPayload) {
      countryMouseover(leafletPayload.leafletObject.feature, leafletPayload.leafletEvent);
    });

    $scope.$on("leafletDirectiveGeoJson.myMap.click", function(ev, leafletPayload) {
      countryClick(leafletPayload.leafletObject, leafletPayload.leafletEvent);
    });

    angular.extend($scope, {
      center: {
        lat: 40.8471,
        lng: 14.0625,
        zoom: 2
      },
      legend: {
        colors: ['#CC0066', '#006699', '#FF0000', '#00CC00', '#FFCC00'],
        labels: ['Oceania', 'America', 'Europe', 'Africa', 'Asia']
      }
    });

    function getColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    function style(feature) {
      return {
        fillColor: getColor(),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7
      };
    }

    function countryMouseover(feature, leafletEvent) {
      console.log("mouse over");
      var layer = leafletEvent.target;
      layer.setStyle({
        weight: 2,
        color: '#666',
        fillColor: 'white'
      });
      layer.bringToFront();
      $scope.selectedCountry = feature;
      console.log(feature);
    }

    // Get the countries geojson data from a JSON
    $http.get("data/regions-2016.json").success(function (data, status) {
      angular.extend($scope, {
        geojson: {
          data: data,
          style: style,
          resetStyleOnMouseout: true
        },
        selectedCountry: {}
      });
    });

  }])



  //Controleur des modals
  .controller('ComplexController', ['$scope', '$element', 'title', 'carte', 'close', function ($scope, $element, title, carte, close) {

    $scope.name = null;
    $scope.age = null;
    $scope.title = title;
    $scope.carte = carte;

    console.log($scope.carte);

    //  This close function doesn't need to use jQuery or bootstrap, because
    //  the button has the 'data-dismiss' attribute.
    $scope.close = function () {
      close({
        name: $scope.name,
        age: $scope.age
      }, 500); // close, but give 500ms for bootstrap to animate
    };

    //  This cancel function must use the bootstrap, 'modal' function because
    //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function () {

      //  Manually hide the modal.
      $element.modal('hide');

      //  Now call close, returning control to the caller.
      close({
        name: $scope.name,
        age: $scope.age
      }, 500); // close, but give 500ms for bootstrap to animate
    };

  }]);
