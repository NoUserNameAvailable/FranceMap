'use strict';

/**
 * @ngdoc function
 * @name testmapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testmapApp
 */
angular.module('testmapApp')
  .controller('MainCtrl', ['$scope', 'nemSimpleLogger', 'ModalService', '$http', 'leafletData', function ($scope, nemSimpleLogger, ModalService, $http, leafletData) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.hello = 'hello';

    nemSimpleLogger.log('hi');



    $scope.categories = [
      {"nom":"Musée scientifique en France", "checked":false},
      {"nom":"http://fr.dbpedia.org/resource/Catégorie:Musée_scientifique_en_France", "checked":false},
    ];

    $scope.change = function (){
      var liste = [];
      var listeMusee = [];

      angular.forEach($scope.categories, function(value, key) {
        if(value.checked === true){
          liste.push(value);
          angular.forEach($scope.listeBrute, function(v, k) {
            if(v.categories.indexOf(value.nom) !==-1 ){
              listeMusee.push(v);
            }
          });
        }
      });

      leafletData.getDirectiveControls().then(function (controls) {
        var markers = addressPointsToMarkers(listeMusee);
        controls.markers.create(markers, $scope.markers);
        $scope.markers = markers;
      });

      console.log($scope.markers);
    };

    angular.extend($scope, {
      center: {
        lat: 48.853,
        lng: 2.35,
        zoom: 13
      },
      watchOptions: {
        markers: {
          type: null,
          individual: {
            type: null
          }
        }
      },
      events: {
        map: {
          enable: ['moveend', 'popupopen'],
          logic: 'emit'
        },
        marker: {
          enable: [],
          logic: 'emit'
        }
      },
      layers: {
        baselayers: {
          osm: {
            name: 'OpenStreetMap',
            type: 'xyz',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        },
        overlays: {
          realworld: {
            name: "Real world data",
            type: "markercluster",
            visible: true
          }
        }
      }
    });

    var addressPointsToMarkers = function (points) {
      return points.map(function (ap) {
        return {
          message: ap.url,
          lat: ap.lat,
          lng: ap.lng,
          ressource: ap.url
        };
      });
    };

    var dataPretty = function (points) {
      return points.results.bindings.map(function (ap) {
        var cat = ap.categories.value.split(",");
        return {
          url: ap.donnee.value,
          lat: parseFloat(ap.lat.value),
          lng: parseFloat(ap.long.value),
          categories : cat
        };
      });
    };

    //var urlLieux = "http://fr.dbpedia.org/sparql?default-graph-uri=&query=select+*+where+%7B%0D%0A%0D%0A%7B%3Fdonnee+%3Chttp%3A%2F%2Ffr.dbpedia.org%2Fproperty%2Fville%3E+%22Paris%22%40fr%7D+UNION+%7B%3Fdonnee+%3Chttp%3A%2F%2Ffr.dbpedia.org%2Fproperty%2Fville%3E+%3Chttp%3A%2F%2Ffr.dbpedia.org%2Fresource%2FParis%3E%7D%0D%0A%7B%3Fdonnee+rdf%3Atype+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FMuseum%3E%7D+UNION+%7B%3Fdonnee+rdf%3Atype+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FArchitecturalStructure%3E%7D%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat.%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flong.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";
    var urlLieux =
"https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=%0D%0A%0D%0Aselect+%3Fdonnee+%3Flat+%3Flong+%28concat%28group_concat%28%3FcategorieNom%3Bseparator%3D%22%2C%22%29%29as+%3Fcategories%29++%0D%0Awhere+%7B%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Flocation%3E+%3Fadresse%0D%0A%7B%3Fdonnee+rdf%3Atype+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FMuseum%3E%7D+UNION+%7B%3Fdonnee+rdf%3Atype+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FArchitecturalStructure%3E%7D.%0D%0A%7B%3Fdonnee+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Flocation%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FParis%3E%7DUNION+%7B%3Fdonnee+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fsubject%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FCategory%3AMuseums_in_Paris%3E%7D%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat.%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flong.%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fsubject%3E+%3Fcategorie.%0D%0A%3Fcategorie+rdfs%3Alabel+%3FcategorieNom.%0D%0AFILTER+NOT+EXISTS+%7B+%3Fdonnee+rdf%3Atype+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FReligiousBuilding%3E+%7D%0D%0A%7Dgroup+by+%3Fdonnee+%3Flat+%3Flong+&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on";
    //Récupération des données et premier affichage
    $http.get(urlLieux)
      .then(function (response) {

        $scope.listeBrute = dataPretty(response.data);
        leafletData.getDirectiveControls().then(function (controls) {
          var markers = addressPointsToMarkers($scope.listeBrute);
          controls.markers.create(markers, $scope.markers);
          $scope.markers = markers;
        });
      });



    $scope.$on('leafletDirectiveMarker.click', function(event, args) {
      // Args will contain the marker name and other relevant information
      console.log(args);


    });


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

angular.module("testmapApp")
  .directive('radioButton', [function () {
    return {
      restrict: 'E',
      scope: {
        pass: "=",
        some: "@",
        properties: "="
      },
      templateUrl: 'view/template/markerpopup.html',
      controller: ["$scope", function ($scope) {
        // Isolated $scope here
      }]
    };
  }]);
