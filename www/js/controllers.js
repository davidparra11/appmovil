angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
 
  $scope.performValidRequest = function() {
    $http.get('http://localhost:5000/valid').then(
      function(result) {
        $scope.response = result;
      });
  };
 
  $scope.performUnauthorizedRequest = function() {
    $http.get('http://localhost:5000/notauthorized').then(
      function(result) {
        // No result here..
      }, function(err) {
        $scope.response = err;
      });
  };
 
  $scope.performInvalidRequest = function() {
    $http.get('http://localhost:5000/notauthenticated').then(
      function(result) {
        // No result here..
      }, function(err) {
        $scope.response = err;
      });
  };

  $scope.performGetRequest = function() {
   /* $http.get('http://httpbin.org/get').then(
      function(result) {
        // No result here..
        console.log(JSON.stringify(result));
        $scope.response = result;
      }, function(err) {
        $scope.response = err;
      });
  };*/

  $http({
  method: 'GET',
  url: 'https://placego-rest.herokuapp.com/users/',
  headers: {
   'Content-Type': undefined,
   'token': 'key123'
 },
 data: { test: 'test' }
}).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
    $scope.response = response;
    console.log(response);
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    $scope.response = response;
  });


};
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.username = AuthService.username();
 
  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });
 
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
 
  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
  $scope.data = {};
  $scope.image = "../img/photo1.jpg";
 
  $scope.login = function(data) {
    AuthService.login(data.username, data.password).then(function(authenticated) {
      $state.go('main.dash', {}, {reload: true});
      $scope.setCurrentUsername(data.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Fallo de autenticacion!',
        template: 'Usuario o contraseña incorrecta!'
      });
    });
  };
})



.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
