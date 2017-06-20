(function() {
  "use strict";

  angular
    .module("autJWTApp")
    .factory("AuthenticationService", Service);

  //Service.$inject = ["$http", "$localStorage"];

  function Service($http, $localStorage) {
    var service = {};
    service.Login = Login;
    service.Logout = Logout;

    return service;

    function Login(username, password, callback) {
      // return $http.post("/api/authenticate", { username: username, password: password })
      return $http({
        url: "/api/authenticate",
        method: "POST",
        data: { username: username, password: password }
      })
      .then(function(response) {
        // login successful if there's a token in the response
        if (response.data.token) {
          $localStorage.currentUser = {username: username, token: response.data.token};

          // add jwt token to auth header for all request made by the $http service
          $http.defaults.headers.common.Authorization = "Bear " + response.data.token;

          // execute call back with true to indicate successful login
          callback(true);
        } else {
          // execute callback with false to indicate fails login
          callback(false);
        }
      });
      function successLogin(response) {
        // login successful if there's a token in the response
        if (response.token) {
          $localStorage.currentUser = {username: username, token: response.token};

          // add jwt token to auth header for all request made by the $http service
          $http.defaults.headers.common.Authorization = "Bear " + response.token;

          // execute call back with true to indicate successful login
          callback(true);
        } else {
          // execute callback with false to indicate fails login
          callback(false);
        }
      }
    }

    function Logout() {
      // remove user from local storage and clear http auth header
      delete $localStorage.currentUser;
      $http.defaults.headers.common.Authorization = "";
    }
  }
})();
