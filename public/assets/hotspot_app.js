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
      // fake data when error is occurred
      $scope.Collections = [
      {
        "id": 00001,                                                                    // ID of this Collection
        "title": "First Sample Collection",                                             // Name of the Collection
        "description": "This is the description for this collection.",                  // Description
        "featuredimage": "sofa.jpg",                                                    // Featured Image
        "products": [10001,10002,10003, 10004],                                         // List of products in this collection (ordered list)
        "similar-products": [20001,2002,2003,2004],                                     // List of similar products in this collection. 
        "interfaces": {                                                                 // List of Interfaces attached to this Collection, and the HotspotImage used with the Interface
          "slider": 70001,
          "trend": null,
          "gallery": 70002
        }    
      },{
        "id": 00002,                                                                    
        "title": "Second Sample Collection",                                            
        "description": "This is the description for this collection.",                  
        "featuredimage": "sofa.jpg",     
        "products": [10001,10002,10003, 10004],                                        
        "similar-products": [20001,2002,2003,2004],                                     
        "interfaces": {                                                                 
          "slider": 70001,
          "trend": null,
          "gallery": 70002
        }
      },{
        "id": 00003,                                                                    
        "title": "Third Sample Collection",                                             
        "description": "This is the description for this collection.",                  
        "featuredimage": "sofa.jpg",     
        "products": [10001,10002,10003, 10004],                                         
        "similar-products": [20001,2002,2003,2004],                                     
        "interfaces": {                                                                 
          "slider": 70001,
          "trend": null,
          "gallery": 70002
        }
      }
    ]});
  } 
}]);

HotSpotApp.controller('CollectionController', ['$scope','$routeParams','$rootScope', '$http', function ( $scope, $routeParams, $rootScope , $http) {
    
  $scope.collection = $rootScope.Collections.find( function(el) {
    return el.id == $routeParams.collectionId
  });

  $scope.saveHotspotCollection = function () {
    var url = '/create_hotspot_collection';
    var data = { title: $scope.title, custom_collection_id: $scope.collection.id };
    $http.post( url, data );
  }

  $scope.updateHotspotCollection = function () {
    var url = '/update_hotspot_collection';
    var data = { id: $scope.hotspot_collection.id, title: $scope.hotspot_collection.title, custom_collection_id: $scope.collection.id, template: $scope.hotspot_collection.template };
    $http.put( url, data );
  }

  $http.get('/hotspot_collection.json/' + $scope.collection.id )
    .success( function( data ) {
      $scope.hotspot_collection = data;
    })
    .error( function(){
      // to do somt when errors
    });

  angular.element(document).ready(function () {
    initMapImage();
    $('.create').click( function(){
      $('.empty-hotspot-collection').hide();
      $('.create-hotspot-collection').show();
    });
  });  

  

}]); 
