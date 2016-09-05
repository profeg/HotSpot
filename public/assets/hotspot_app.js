var HotSpotApp = angular.module('hotSpot', ['ngRoute']);

HotSpotApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/editCollection/:collectionId', {
                templateUrl: 'assets/tpl/edit.html',
                controller: 'CollectionController'
            }).
            when('/showCollections', {
                templateUrl: 'assets/tpl/all.html',
                controller: 'MainController'
            }).
            when('/addHotspots/:interface', {
                templateUrl: 'assets/tpl/add_hotspots.html',
                controller: 'HotspotsController'
            }).
            otherwise({
                redirectTo: '/showCollections'
            });
    }]);
HotSpotApp.directive('goLink', ['$location', function ($location) {
    return {
        link: function (scope, element, attrs) {
            element.on('click', function () {
                scope.$apply(function () {
                    $location.path(attrs.goLink);
                });
            });
        }
    }
}]);

HotSpotApp.directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                //call the function that was passed
                initMapImage();
                scope.$apply(attrs.imageonload);
            });
        }
    };
});

HotSpotApp.controller('HotspotsController', ['$scope', '$rootScope', '$http', '$routeParams', function ($scope, $rootScope, $http, $routeParams) {
    $http.get('/interface.json/' + $routeParams.interface)
        .success(function (data) {
            $scope.interface = data;
            $http.get('/hotspots.json/' + $scope.interface.id)
                .success(function (data) {
                    $scope.hotspots = data;
                });
        });

    $scope.saveHotspots = function () {
        if ($scope.hotspots.length > 0) {
            var url = '/save_hotspots';
            var data = {interface_id: $scope.interface.id, hotspots: $scope.hotspots};
            $http.post(url, data);
        }
    };
    $scope.deleteHotspot = function (id) {
        for (var i = $scope.hotspots.length - 1; i >= 0; i--) {
            if ($scope.hotspots[i].id == id) {
                $scope.hotspots.splice(i, 1);
                break;
            }
        }
        var url = ('/delete_hotspot/' + id);
        $http.post(url);
    };
    $scope.addHotspot = function (evt) {
        var rect = $('.imgmap')[0].getBoundingClientRect();
        var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
        var scrollLeft = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
        var elementLeft = rect.left + scrollLeft;
        var elementTop = rect.top + scrollTop;
        var x = evt.pageX - elementLeft;
        var y = evt.pageY - elementTop;
        $scope.hotspots.push({x: x, y: y, icon_scale: 8, position: 'Top'});
    };
}]);
HotSpotApp.controller('MainController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    if ($rootScope.Collections == undefined) {
        $http.get('/collections.json')
            .success(function (data) {
                $rootScope.Collections = data;
            });
    }
}]);
HotSpotApp.controller('CollectionController', ['$scope', '$routeParams', '$rootScope', '$http', function ($scope, $routeParams, $rootScope, $http) {
    $scope.collection = $rootScope.Collections.find(function (el) {
        return el.id == $routeParams.collectionId
    });
    refreshHotspotCollection();

    $scope.addInterface = function (interface) {
        var url = '/save_interface';
        var data = {title: interface, collection_id: $scope.hotspot_collection.id, image: $scope.collection.image.src}
        $http.post(url, data);
        refreshInterfaces();
    }

    $scope.saveHotspotCollection = function () {
        var url = '/save_hotspot_collection';
        var data = {title: $scope.hotspot_collection.title, collection_id: $scope.collection.id};
        $http.post(url, data);
        refreshHotspotCollection();
    }

    function refreshHotspotCollection() {
        $http.get('/hotspot_collection.json/' + $scope.collection.id)
            .success(function (data) {
                if (data == "null") {
                    $scope.hotspot_collection = {};
                }
                else {
                    $scope.hotspot_collection = data;
                    refreshInterfaces();
                }
            });
    }

    function refreshInterfaces() {
        $http.get('/interfaces.json/' + $scope.hotspot_collection.id)
            .success(function (data) {
                $scope.interfaces = {};
                if (data != "null") {
                    $scope.interfaces.slider = data.find(function (el) {
                        return el.title == 'slider'
                    });
                    $scope.interfaces.trend = data.find(function (el) {
                        return el.title == 'trend'
                    });
                    $scope.interfaces.gallery = data.find(function (el) {
                        return el.title == 'gallery'
                    });
                }
            });
    }
}]);

function initMapImage() {
    var $img = $("img[usemap]");
    var $imgmap = $(".imgmap");
    var imgheight = $img.height();
    var imgwidth = $img.width();
    var imgPosition = $img.position();
    $imgmap.css(
        {
            top: imgPosition.top + "px",
            left: imgPosition.left + "px",
            height: imgheight + "px",
            width: imgwidth + "px"
        });
    var mapName = $img.attr("usemap").replace("#", "");
    var circles = $("map[name='" + mapName + "'] area[shape='circle']");
    circles.each(function (index, circle) {
        var attrs = circle.coords.split(",");
        var alt = circle.alt;
        var size = (attrs[2] * 2) + 'px';
        var left = parseInt(attrs[0]) - parseInt(attrs[2]);
        var top = parseInt(attrs[1]) - parseInt(attrs[2]);
        var $newa = $("<div class='mapcircle'></div>");
        $imgmap.append($newa);
        $newa.css(
            {
                left: left + 'px',
                top: top + 'px',
                width: size,
                height: size
            });
        $newa.hover(
            function () {
                showHotSpot($(this));
            },
            function () {
                showHotSpot('');
            }
        );
    });
}
function showHotSpot(elem) {
    if (elem) {
        $('body').append("<div class='hotspot-body' style='display: none; z-index:100; background-color: white;'><span id='divTitle'></span>SHOW ME!</div>");
        $('.hotspot-body').css({
            'top': elem.offset().top,
            'left': elem.offset().left + 16,
            'position': 'absolute',
            'border': '1px solid black',
            'padding': '5px'
        });
        $('.hotspot-body').show();
    } else {
        $('.hotspot-body').remove();
    }
}
