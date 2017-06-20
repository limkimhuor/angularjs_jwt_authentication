(function() {
  "use strict";
  var app = angular
    .module("autJWTApp", ["ui.router", "ngMessages", "ngStorage", "ngMockE2E"])
    .config(config)
    .run(run);

  function config($stateProvider, $urlRouterProvider) {
    // default route
    $urlRouterProvider.otherwise("/");

    // app routes
    $stateProvider
      .state("home", {
        url: "/",
        templateUrl: "app/views/home.html",
        controller: "HomeController",
        controllerAs: "vm"
      })
      .state("login", {
        url: "/login",
        templateUrl: "app/views/login.html",
        controller: "LoginController",
        controllerAs: "vm"
      });
  }

  function run($rootScope, $http, $location, $localStorage) {
    // Keep user logged in after page refresh
    if ($localStorage.currentUser) {
      $http.defaults.headers.common.Authorization = "Bearer " + $localStorage.currentUser.token;
    }

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on("$locationChangeStart", function(event, next, current) {
      var publicPages = ["/login"];
      var restrictPage = publicPages.indexOf($location.path()) === -1;
      if(restrictPage && !$localStorage.currentUser) {
        $location.path("login");
      }
    });

    // $httpBackend.whenGET(/^\w+.*/).passThrough();
  }
})();
