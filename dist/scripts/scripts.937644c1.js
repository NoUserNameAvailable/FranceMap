"use strict";angular.module("testmapApp",["ngAnimate","nemLogging","ui-leaflet","ui.bootstrap","angularModalService","bc.AngularUrlEncode"]),angular.module("testmapApp").controller("MainCtrl",["$scope","nemSimpleLogger","ModalService","$http","leafletData",function(a,b,c,d,e){a.categories=[{nom:"Art museums and galleries in Paris",checked:!1},{nom:"Legislative buildings in Europe",checked:!1},{nom:"Hôtels particuliers in Paris",checked:!1},{nom:"History museums in France",checked:!1},{nom:"History of Paris",checked:!1},{nom:"Legislative buildings in Europe",checked:!1}],a.changeAdresse=function(){e.getDirectiveControls().then(function(b){var c=f(a.listeBrute);b.markers.create(c,a.markers),a.markers=c})},a.change=function(){var b=[],c=[],d=!0;angular.forEach(a.categories,function(e,f){e.checked===!0&&(b.push(e),angular.forEach(a.listeBrute,function(a,b){-1!==a.categories.indexOf(e.nom)&&c.push(a)}),d=!1)}),d&&(c=a.listeBrute),e.getDirectiveControls().then(function(b){var d=f(c);b.markers.create(d,a.markers),a.markers=d})},angular.extend(a,{center:{lat:48.853,lng:2.35,zoom:13},watchOptions:{markers:{type:null,individual:{type:null}}},events:{map:{enable:["moveend","popupopen"],logic:"emit"},marker:{enable:[],logic:"emit"}},layers:{baselayers:{osm:{name:"OpenStreetMap",type:"xyz",url:"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}},overlays:{realworld:{name:"Real world data",type:"markercluster",visible:!0}}}});var f=function(b){return b.map(function(b){return{message:'<div map-lat="'+b.lat+'" map-lng="'+b.lng+'" map-domicile="'+a.domicile+'" map-marker="'+b.url+'" ng-cloak></div>',lat:b.lat,lng:b.lng,ressource:b.url}})},g=function(a){return a.results.bindings.map(function(a){var b=a.categories.value.split(",");return{url:a.donnee.value,lat:parseFloat(a.lat.value),lng:parseFloat(a["long"].value),categories:b}})},h="https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=select+%3Fdonnee+%3Flat+%3Flong+%28concat%28group_concat%28%3FcategorieNom%3Bseparator%3D%22%2C%22%29%29as+%3Fcategories%29++%0D%0Awhere+%7B%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Flocation%3E+%3Fadresse%0D%0A%7B%3Fdonnee+rdf%3Atype+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FMuseum%3E%7D+UNION+%7B%3Fdonnee+rdf%3Atype+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FArchitecturalStructure%3E%7D.%0D%0A%7B%3Fdonnee+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Flocation%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FParis%3E%7DUNION+%7B%3Fdonnee+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fsubject%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FCategory%3AMuseums_in_Paris%3E%7D%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat.%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flong.%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fsubject%3E+%3Fcategorie.%0D%0A%3Fcategorie+rdfs%3Alabel+%3FcategorieNom.%0D%0A%3Fdonnee+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fthumbnail%3E+%3Fphot.%0D%0AFILTER+NOT+EXISTS+%7B+%3Fdonnee+rdf%3Atype+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FReligiousBuilding%3E+%7D%0D%0A%7Dgroup+by+%3Fdonnee+%3Flat+%3Flong+&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on";d.get(h).then(function(b){a.listeBrute=g(b.data),e.getDirectiveControls().then(function(b){var c=f(a.listeBrute);b.markers.create(c,a.markers),a.markers=c})}),a.$on("leafletDirectiveMarker.click",function(a,b){}),a.modalCarte=function(b){c.showModal({templateUrl:"views/modal/carte.html",controller:"ComplexController",inputs:{title:"A More Complex Example",carte:a.cartes[b]}}).then(function(b){b.element.modal(),b.close.then(function(b){a.complexResult="Name: "+b.name+", age: "+b.age})})}}]).directive("mapMarker",["$http","$filter","dbpedia",function(a,b,c){var d=function(a){var b=a,c=/\\u([\d\w]{4})/gi;return b=b.replace(c,function(a,b){return String.fromCharCode(parseInt(b,16))}),b=unescape(b)},e=function(a,e,f){console.log(f);var g=f.mapMarker,h="https://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=",i="select ?photo ?nom ?resume ?site ?wiki where {OPTIONAL {<"+g+"> <http://dbpedia.org/ontology/thumbnail> ?photo}.OPTIONAL {<"+g+"> <http://www.w3.org/2000/01/rdf-schema#label> ?nom}.OPTIONAL {<"+g+"> <http://dbpedia.org/ontology/abstract> ?resume}.OPTIONAL {<"+g+"> <http://dbpedia.org/property/website> ?site}.OPTIONAL {<"+g+'> <http://xmlns.com/foaf/0.1/isPrimaryTopicOf> ?wiki}.filter(langMatches(lang(?nom),"fr")).filter(langMatches(lang(?resume),"fr"))}',j="&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on";if("undefined"!==f.mapDomicile){var k=c.getDurationTimeWalking(f.mapDomicile,f.mapLat,f.mapLng);k.then(function(b){a.walkingDistance=b.rows[0].elements[0].distance.text,a.walkingTime=b.rows[0].elements[0].duration.text})["catch"](function(a){console.log(a)})}var l=c.getData(h+b("bcEncode")(i)+j);l.then(function(b){"undefined"!=typeof b.data.results.bindings[0].photo&&(a.photo=b.data.results.bindings[0].photo.value),a.nom=b.data.results.bindings[0].nom.value,"undefined"!=typeof b.data.results.bindings[0].site&&(a.site=b.data.results.bindings[0].site.value),a.wiki=b.data.results.bindings[0].wiki.value,a.resume=d(b.data.results.bindings[0].resume.value)})};return{restrict:"AE",templateUrl:"views/templates/markerpopup.html",link:e}}]).controller("ComplexController",["$scope","$element","title","carte","close",function(a,b,c,d,e){a.name=null,a.age=null,a.title=c,a.carte=d,a.close=function(){e({name:a.name,age:a.age},500)},a.cancel=function(){b.modal("hide"),e({name:a.name,age:a.age},500)}}]),angular.module("testmapApp").controller("MarkerpopupCtrl",["$scope",function(a){}]),angular.module("testmapApp").factory("dbpedia",["$http",function(a){var b=function(b){return a({method:"GET",url:b}).then(function(a){return a})},c=function(b,c,d){return a({method:"GET",url:"https://maps.googleapis.com/maps/api/distancematrix/json?origins="+b+"&destinations="+c+","+d+"&mode=walking&key=AIzaSyDYvc9X8K1dIrRsGl-e9DZ3L4vMJkUFe7w"}).then(function(a){return console.log(a),a.data})["catch"](function(a){console.log(a)})},d=function(){return"hello"};return{getData:b,getDurationTimeWalking:c,test:d}}]),angular.module("testmapApp").run(["$templateCache",function(a){a.put("views/main.html",'<div ng-controller="MainCtrl as $ctrl"> <!--&lt;!&ndash;<p><a href class="btn btn-default btn-lg " ng-click="modalCarte(0)">Show Complex</a></p>&ndash;&gt;--> <!--&lt;!&ndash;<p>{{complexResult}}</p>&ndash;&gt;--> <!--&lt;!&ndash;<div class="container fill">&ndash;&gt;--> <!--&lt;!&ndash;<leaflet id="map" events="events" geojson="geojson"></leaflet>&ndash;&gt;--> <!--&lt;!&ndash;</div>&ndash;&gt;--> <!--&lt;!&ndash;<button type="button" class="btn btn-default" ng-click="$ctrl.open(1)">Modifier</button>&ndash;&gt;--> <nav class="navbar navbar-default" role="navigation"> <!-- Brand and toggle get grouped for better mobile display --> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="#">Dégote ta gallerie</a> </div> <!-- Collect the nav links, forms, and other content for toggling --> <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> <ul class="nav navbar-nav"> <li><a href="#">Link</a></li> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown">Catégories <b class="caret"></b></a> <ul class="dropdown-menu"> <li ng-repeat="item in categories"> <div class="checkbox"> <label><input type="checkbox" ng-model="item.checked" ng-click="change()">{{item.nom}}</label> </div> </li> </ul> </li> </ul> <div class="col-sm-3 col-md-3"> <form class="navbar-form" role="search"> <div class="input-group"> <input ng-model="domicile" type="text" class="form-control" placeholder="Mon adresse" name="q"> <div class="input-group-btn" ng-click="changeAdresse()"> <button class="btn btn-default" type="submit"><i class="glyphicon glyphicon-road"></i></button> </div> </div> </form> </div> </div><!-- /.navbar-collapse --> </nav> <div class="mapContainer"> <leaflet lf-center="center" markers="markers" layers="layers" event-broadcast="events" watch-options="watchOptions" width="100%" height="100%"> </leaflet></div> </div>'),a.put("views/modal/carte.html",'<div class="modal fade"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" ng-click="close()" data-dismiss="modal" aria-hidden="true">&times;</button> <h4 class="modal-title">{{title}}</h4> </div> <div class="modal-body"> <p>Here\'s a more complex modal, it contains a form, data is passed to the controller and data is returned from the modal.</p> <form class="form-horizontal" role="form"> <div class="form-group"> <label for="name" class="col-sm-2 control-label">Name</label> <div class="col-sm-10"> <input type="text" class="form-control" id="name" placeholder="Your Name" ng-model="name"> </div> </div> <div class="form-group"> <label for="age" class="col-sm-2 control-label">Age</label> <div class="col-sm-10"> <input type="number" class="form-control" id="inputPassword3" placeholder="Age" ng-model="age"> </div> </div> </form> {{carte}} </div> <div class="modal-footer"> <button type="button" ng-click="close()" class="btn btn-primary" data-dismiss="modal">OK</button> <button type="button" ng-click="cancel()" class="btn">Cancel</button> </div> </div> </div> </div>'),a.put("views/templates/markerpopup.html",'<div ng-controller="MarkerpopupCtrl" ng-cloak> <h3>{{nom}}</h3> <p>{{resume}}</p> <img ng-if="photo" class="markerpopup" src="{{photo}}"> <a target="_blank" href="{{site}}">Site</a> <a target="_blank" href="{{wiki}}">Wiki</a> <h4>Temps :</h4> <p>A pied : {{walkingTime}}({{walkingDistance}})</p> </div>')}]);