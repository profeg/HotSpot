var HotSpotApp = angular.module('hotSpot', ['ngRoute']);
 
HotSpotApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/addCollection', {
        templateUrl: 'assets/tpl/edit.html',
        controller: 'CollectionController'
      }).
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

HotSpotApp.directive('clickLink', ['$location', function($location) {
  return {
    link: function(scope, element, attrs) {
    element.on('click', function() {
      scope.$apply(function() {
       $location.path(attrs.clickLink);
      });
    });
    }
  }
}]);


HotSpotApp.controller('MainController', ['$scope', '$rootScope', '$http', function ( $scope, $rootScope, $http ) {
  if ( $rootScope.Collections == undefined ) {
  $http.get('/collections.json')
   .success(function(data) {
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

HotSpotApp.controller('CollectionController', ['$scope','$routeParams','$rootScope', function ( $scope, $routeParams, $rootScope ) {
  if ( $routeParams.collectionId ) {
    $scope.collection = $rootScope.Collections.find( function(el) {
      return el.id == $routeParams.collectionId
    });
  } else {
    // $http.get('/collections.json')
    // .success(function(data) {
    //   $rootScope.Collections = data;
    //   })
    // .error(function() {
    //   // to do somth wher error is occuired
    // });
  }

}]); 

HotSpotApp.controller('HotspotImageController', ['$scope','$routeParams', '$rootScope', '$http', function ( $scope, $routeParams, $rootScope, $http ) {

}]);
