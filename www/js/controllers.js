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

.controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state, $ionicSideMenuDelegate, Personas) {


  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.personas = Personas.all();

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

.controller('DetallesCtrl', function($scope, $stateParams, Personas) {
  $scope.persona = Personas.get($stateParams.personaId);
})


.controller('MenuCtrl', function($scope, $stateParams, $ionicSideMenuDelegate, $state, $ionicPopup, AuthService, Personas) {
  //$scope.chat = Chats.get($stateParams.chatId);
  // $state.go('inside.citas');
  $scope.personaCard = true;

  $scope.identificacion = function(usuario) {
    console.log('test on identificacion' + usuario.identifier);
    /*  var alertPopup = $ionicPopup.alert({
        title: usuario.identifier
      });*/
      //return false;
       AuthService.buscarPersona(usuario).then(function(msg) {
      console.log('fuciono buscarPersona ' + JSON.stringify(msg));

      $scope.personaCard = false;

  
      console.log('msg ' + JSON.stringify(msg));

      $scope.usuario = msg;

      AuthService.buscarTipoCita().then(function(res) {
      console.log('fuciono buscarPersona ' + JSON.stringify(res));

      

      console.log('msg ' + JSON.stringify(res));


      $scope.citas = res;

    }, function(errMsg) {
      // alert(JSON.stringify(errMsg));
      var alertPopup = $ionicPopup.alert({
        title: 'Error! No hay fucionarios para este tipo de cita',
        template: errMsg
      });
    });


    }, function(errMsg) {
      // alert(JSON.stringify(errMsg));
      $scope.personaCard = true;
      var alertPopup = $ionicPopup.alert({
        title: 'Error! Por favor verifique usuario',
        template: errMsg
      });
    });

    
  };

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
 
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, $ionicHistory, AuthService) {

  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.limpiarBtn = true;
  $scope.empresaInput = true;
  $scope.passwordLabel = true;
  $scope.entrarBtn = true;
  $scope.passwordInput = true;
  $scope.usuarioLi = true;
  $scope.usuarioLabel = false;

  $scope.user = {
    name: '',
    password: ''
  };
  $scope.image = "../img/photo1.jpg";
  //$scope.option = '';


  $scope.login = function(user) {
    if (user.empresa == null || user.empresa == '') {
      var alertPopup = $ionicPopup.alert({
        title: 'Falta el campo Empresa'
      });
      return false;

    }

    AuthService.login($scope.user).then(function(msg) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });

      var alertPopup = $ionicPopup.alert({
        title: 'Hola, Bienvenido a Answercpi!',
        template: msg
      });

      $scope.empresaInput = true;
      $scope.passwordLabel = true;
      $scope.entrarBtn = true;
      $scope.continuarBtn = false;
      $scope.passwordInput = true;
      $scope.usuarioLi = true;
      $scope.usuarioLabel = false;
      $scope.limpiarBtn = true;

      $state.go('menu.citas');

    }, function(errMsg) {
      // alert(JSON.stringify(errMsg));
      var alertPopup = $ionicPopup.alert({
        title: 'Error! Por favor verifique usuario o contraseña',
        template: errMsg
      });
    });
  };

  $scope.buscarEmpresa = function(user, state) {

    AuthService.buscar($scope.user).then(function(msg) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $scope.empresaInput = state;

      console.log('OK 2 msg' + JSON.stringify(msg));
      $scope.user.empresas = msg;
      $scope.limpiarBtn = false;
      $scope.usuarioLabel = true;
      $scope.usuarioLi = false;
      $scope.empresaInput = false;
      $scope.passwordLabel = false;
      $scope.entrarBtn = false;
      $scope.continuarBtn = true;
      $scope.passwordInput = false;
    }, function(errMsg) {
      $scope.empresaInput = true;
      var alertPopup = $ionicPopup.alert({
        title: 'Usuario inexistente!',
        template: errMsg
      });
    });
  };
 
  $scope.limpiar = function(user) {
    user.usuario = '';
    user.password = '';
    user.empresa = '';

    $scope.limpiarBtn = true;
    $scope.empresaInput = true;
    $scope.passwordLabel = true;
    $scope.entrarBtn = true;
    $scope.continuarBtn = false;
    $scope.passwordInput = true;
    $scope.usuarioLi = true;
    $scope.usuarioLabel = false;


  };
});