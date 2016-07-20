var HotSpotApp = angular.module('hotSpot', ['ngRoute']);
HotSpotApp.value('Collections', [
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
    ]);
 
HotSpotApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/editCollection/:collectionId', {
        templateUrl: 'assets/tpl/edit.html',
        controller: 'EditCollectionController'
      }).
      when('/showCollections', {
        templateUrl: 'assets/tpl/all.html',
        controller: 'ShowAllCollectionsController'
      }).
      otherwise({
        redirectTo: '/showCollections'
      });
}]);

HotSpotApp.controller('ShowAllCollectionsController', ['$scope', 'Collections', function ($scope, Collections) {
  $scope.Collections = Collections;
}]);

HotSpotApp.controller('EditCollectionController', ['$scope','$routeParams','Collections', function ($scope, $routeParams, Collections) {
 $scope.collection = Collections.find( function(el) {
  return el.id == $routeParams.collectionId
 });


}]); 