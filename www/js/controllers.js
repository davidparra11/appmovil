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
      },
      function(err) {
        $scope.response = err;
      });
  };

  $scope.performInvalidRequest = function() {
    $http.get('http://localhost:5000/notauthenticated').then(
      function(result) {
        // No result here..
      },
      function(err) {
        $scope.response = err;
      });
  };

  $scope.performGetRequest = function() {
    $http({
      method: 'GET',
      url: 'https://placego-rest.herokuapp.com/users/',
      headers: {
        'Content-Type': undefined,
        'token': 'key123'
      },
      data: {
        test: 'test'
      }
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

.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };

  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})


.controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state, $ionicSideMenuDelegate, Chats) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.chats = Chats.all();

  $scope.destroySession = function() {
    AuthService.logout();
  };

  $scope.getInfo = function() {
    $http.get(API_ENDPOINT.url + '/get').then(function(result) {
      //$scope.memberinfo = result.data.msg;
      $scope.memberinfo = result;

    });
  };

  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };
})

.controller('DetallesCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('CitasCtrl', function($scope, $stateParams, Chats) {
  //$scope.chat = Chats.get($stateParams.chatId);
  // $state.go('inside.citas');
})

.controller('MenuCtrl', function($scope, $stateParams, $ionicSideMenuDelegate, $state, AuthService, Chats) {
  //$scope.chat = Chats.get($stateParams.chatId);
  // $state.go('inside.citas');
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };

})

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
  /* $scope.username = AuthService.username();

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
   */
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, $ionicHistory, AuthService) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  $scope.empresaInput = true;
  $scope.user = {
    name: '',
    password: ''
  };
  $scope.image = "../img/photo1.jpg";
  $scope.login = function(user) {


    // alert(JSON.stringify(user));
    AuthService.login($scope.user).then(function(msg) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('menu.citas');
    }, function(errMsg) {
      alert(JSON.stringify(errMsg));
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };

   $scope.buscarEmpresa = function(user) {

     $scope.empresaInput = false;
    // alert(JSON.stringify(user));
    AuthService.buscar($scope.user).then(function(msg) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });

     console.log('OK 2 msg' + JSON.stringify(msg));
     $scope.user.empresas = msg;
     // $state.go('menu.citas');
    }, function(errMsg) {
     // alert(JSON.stringify(errMsg));
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
  /*$scope.data = {};
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
   };*/
});