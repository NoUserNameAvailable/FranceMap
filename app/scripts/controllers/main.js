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

    $scope.categories = [
      {"nom": "Art museums and galleries in Paris", "checked": false},
      {"nom": "Legislative buildings in Europe", "checked": false},
      {"nom": "Hôtels particuliers in Paris", "checked": false},
      {"nom": "History museums in France", "checked": false},
      {"nom": "History of Paris", "checked": false},
      {"nom": "Legislative buildings in Europe", "checked": false},
    ];

    $scope.changeAdresse = function(){
      leafletData.getDirectiveControls().then(function (controls) {
        var markers = addressPointsToMarkers($scope.listeBrute);
        controls.markers.create(markers, $scope.markers);
        $scope.markers = markers;
      });
    };

    $scope.change = function () {
      var liste = [];
      var listeMusee = [];
      var aucunCheck = true;

      angular.forEach($scope.categories, function (value, key) {
        if (value.checked === true) {
          liste.push(value);
          angular.forEach($scope.listeBrute, function (v, k) {
            if (v.categories.indexOf(value.nom) !== -1) {
              listeMusee.push(v);
            }
          });
          aucunCheck = false;
        }
      });

      //Aucune catégorie checkée
      if(aucunCheck){
        listeMusee = $scope.listeBrute;
      }

      leafletData.getDirectiveControls().then(function (controls) {
        var markers = addressPointsToMarkers(listeMusee);
        controls.markers.create(markers, $scope.markers);
        $scope.markers = markers;
      });


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
        }
      }
    });

    var addressPointsToMarkers = function (points) {
      return points.map(function (ap) {
        return {
          // message: "<h2>"+ap.url+"</h2>",
          // message:  "<expander class=\"expander\" expander-title=\"title\"/>",
          message: "<div map-lat=\""+ap.lat+"\" map-lng=\""+ap.lng+"\" map-domicile=\""+$scope.domicile+"\" map-marker=\"" + ap.url + "\" ng-cloak></div>",
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
          categories: cat
        };
      });
    };

    //var urlLieux = "http://fr.dbpedia.org/sparql?default-graph-uri=&query=select+*+where+%7B%0D%0A%0D%0A%7B%3Fdonnee+%3Chttp%3A%2F%2Ffr.dbpedia.org%2Fproperty%2Fville%3E+%22Paris%22%40fr%7D+UNION+%7B%3Fdonnee+%3Chttp%3A%2F%2Ffr.dbpedia.org%2Fproperty%2Fville%3E+%3Chttp%3A%2F%2Ffr.dbpedia.org%2Fresource%2FParis%3E%7D%0D%0A%7B%3Fdonnee+rdf%3Atype+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FMuseum%3E%7D+UNION+%7B%3Fdonnee+rdf%3Atype+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FArchitecturalStructure%3E%7D%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat.%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flong.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";
    var urlLieux =
    "https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=select+%3Fdonnee+%3Flat+%3Flong+%28concat%28group_concat%28%3FcategorieNom%3Bseparator%3D%22%2C%22%29%29as+%3Fcategories%29++%0D%0Awhere+%7B%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Flocation%3E+%3Fadresse%0D%0A%7B%3Fdonnee+rdf%3Atype+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FMuseum%3E%7D+UNION+%7B%3Fdonnee+rdf%3Atype+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FArchitecturalStructure%3E%7D.%0D%0A%7B%3Fdonnee+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Flocation%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FParis%3E%7DUNION+%7B%3Fdonnee+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fsubject%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FCategory%3AMuseums_in_Paris%3E%7D%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat.%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flong.%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fsubject%3E+%3Fcategorie.%0D%0A%3Fcategorie+rdfs%3Alabel+%3FcategorieNom.%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fthumbnail%3E+%3Fphot.%0D%0AFILTER+NOT+EXISTS+%7B+%3Fdonnee+rdf%3Atype+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FReligiousBuilding%3E+%7D%0D%0A%7Dgroup+by+%3Fdonnee+%3Flat+%3Flong+&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on";
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


    $scope.$on('leafletDirectiveMarker.click', function (event, args) {
      // Args will contain the marker name and other relevant information
    });


    $scope.modalCarte = function (numCarte) {
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


  .directive("mapMarker", ['$http', '$filter', 'dbpedia', function ($http, $filter, dbpedia) {
    var decode = function (code) {
      var x = code;
      var r = /\\u([\d\w]{4})/gi;
      x = x.replace(r, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16));
      });
      x = unescape(x);
      return (x);
    };

    var linkFunction = function (scope, element, attributes) {
      console.log(attributes);

      var urlDonnee = attributes["mapMarker"];
      var urlLieux1 = "https://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=";
      var urlLieux2 =
        "select ?photo ?nom ?resume ?site ?wiki where {" +
        "OPTIONAL {<" + urlDonnee + "> <http://dbpedia.org/ontology/thumbnail> ?photo}." +
        "OPTIONAL {<" + urlDonnee + "> <http://www.w3.org/2000/01/rdf-schema#label> ?nom}." +
        "OPTIONAL {<" + urlDonnee + "> <http://dbpedia.org/ontology/abstract> ?resume}." +
        "OPTIONAL {<" + urlDonnee + "> <http://dbpedia.org/property/website> ?site}." +
        "OPTIONAL {<" + urlDonnee + "> <http://xmlns.com/foaf/0.1/isPrimaryTopicOf> ?wiki}." +
        "filter(langMatches(lang(?nom),\"fr\"))." +
        "filter(langMatches(lang(?resume),\"fr\"))" +
        "}";
      var urlLieux3 = "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on";

      if(attributes['mapDomicile'] !== "undefined"){
        var myDataPromise2 = dbpedia.getDurationTime(attributes['mapDomicile'], attributes['mapLat'], attributes['mapLng'], "walking");
        myDataPromise2.then(function (response) {
          console.log(response);
            scope.walkingDistance = response.rows[0].elements[0].distance.text;
            scope.walkingTime = response.rows[0].elements[0].duration.text;
        }).catch(function (response){
          console.log(response);
        });

        var myDataPromise4 = dbpedia.getDurationTime(attributes['mapDomicile'], attributes['mapLat'], attributes['mapLng'], "driving");
        myDataPromise4.then(function (response) {
            scope.drivingDistance = response.rows[0].elements[0].distance.text;
            scope.drivingTime = response.rows[0].elements[0].duration.text;
        }).catch(function (response){
          console.log(response);
        });

        var myDataPromise5 = dbpedia.getDurationTime(attributes['mapDomicile'], attributes['mapLat'], attributes['mapLng'], "bicycling");
        myDataPromise5.then(function (response) {
          scope.bicyclingDistance = response.rows[0].elements[0].distance.text;
          scope.bicyclingTime = response.rows[0].elements[0].duration.text;
        }).catch(function (response){
          console.log(response);
        });

        var myDataPromise6 = dbpedia.getDurationTime(attributes['mapDomicile'], attributes['mapLat'], attributes['mapLng'], "transit");
        myDataPromise6.then(function (response) {
          scope.transitDistance = response.rows[0].elements[0].distance.text;
          scope.transitTime = response.rows[0].elements[0].duration.text;
        }).catch(function (response){
          console.log(response);
        });

      }

      var myDataPromise = dbpedia.getData(urlLieux1 + $filter('bcEncode')(urlLieux2) + urlLieux3);
      myDataPromise.then(function (response) {
        if (typeof response.data.results.bindings[0].photo !== 'undefined') {
          scope.photo = response.data.results.bindings[0].photo.value;
        }
        scope.nom = response.data.results.bindings[0].nom.value;
        if (typeof response.data.results.bindings[0].site !== 'undefined') {
          scope.site = response.data.results.bindings[0].site.value;
        }
        scope.wiki = response.data.results.bindings[0].wiki.value;
        scope.resume = decode(response.data.results.bindings[0].resume.value);
      });



    };

    return {
      restrict: "AE",
      templateUrl: "views/templates/markerpopup.html",
      link: linkFunction
    };
  }])


  //Controleur des modals
  .controller('ComplexController', ['$scope', '$element', 'title', 'carte', 'close', function ($scope, $element, title, carte, close) {

    $scope.name = null;
    $scope.age = null;
    $scope.title = title;
    $scope.carte = carte;


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
