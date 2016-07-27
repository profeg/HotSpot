var HotSpotApp = angular.module('hotSpot', ['ngRoute']);
 
HotSpotApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/editCollection/:collectionId', {
        templateUrl: 'assets/tpl/edit.html',
        controller: 'CollectionController'
      }).
      when('/showCollections', {
        templateUrl: 'assets/tpl/all.html',
        controller: 'MainController'
      }).
      otherwise({
        redirectTo: '/showCollections'
      });
}]);

HotSpotApp.directive('goLink', ['$location', function($location) {
  return {
    link: function(scope, element, attrs) {
    element.on('click', function() {
      scope.$apply(function() {
       $location.path(attrs.goLink);
      });
    });
    }
  }
}]);


HotSpotApp.controller('MainController', ['$scope', '$rootScope', '$http', function ( $scope, $rootScope, $http ) {
  if ( $rootScope.Collections == undefined ) {
    $http.get('/collections.json')
    .success(function( data ) {
      $rootScope.Collections = data;
    })
    .error(function() {
      // do somth when error
    });
  } 
}]);

HotSpotApp.controller('CollectionController', ['$scope','$routeParams','$rootScope', '$http', function ( $scope, $routeParams, $rootScope , $http) {
    
  $scope.collection = $rootScope.Collections.find( function(el) {
    return el.id == $routeParams.collectionId
  });

  $http.get('/hotspot_collection.json/' + $scope.collection.id )
    .success( function( data ) {
      if ( data == "null" ) {
        $scope.hotspot_collection = {};
      } else {
        $scope.hotspot_collection = data;
      }
    })
    .error( function(){
      // to do somt when errors
    });

  $scope.addHotspot = function( interface ) {

  }

  $scope.saveHotspotCollection = function () {
    var url = '/save_hotspot_collection';
    var data = { title: $scope.hotspot_collection.title, custom_collection_id: $scope.collection.id };
    $http.post( url, data );
    $http.get('/collections.json')
    .success(function( data ) {
      $rootScope.Collections = data;
    })
    .error(function() {
      // do somth when error
    });
  }

  $scope.updateHotspotCollection = function () {
    var url = '/update_hotspot_collection';
    var data = { id: $scope.hotspot_collection.id, title: $scope.hotspot_collection.title, custom_collection_id: $scope.collection.id, template: $scope.hotspot_collection.template };
    $http.put( url, data );
  }


  angular.element(document).ready(function () {
    initMapImage();
  });  
}]); 
