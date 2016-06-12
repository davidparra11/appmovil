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


.controller('DetallesCtrl', function($scope, $stateParams, Personas) {
  $scope.persona = Personas.get($stateParams.personaId);
})


.controller('MenuCtrl', function($scope, $stateParams, $ionicSideMenuDelegate, $state, $ionicPopup, AuthService, Personas, UsuarioGlobal) {
  //$scope.chat = Chats.get($stateParams.chatId);
  // $state.go('inside.citas');
  $scope.personaCard = true;
  $scope.numeroCitas = 0;


  $scope.identificacion = function(usuario) {
    console.log('test on identificacion' + usuario.identifier);
    /*  var alertPopup = $ionicPopup.alert({
        title: usuario.identifier
      });*/
    //return false;
    var id_empresa_global = UsuarioGlobal.get();
    AuthService.buscarPersona(usuario, id_empresa_global).then(function(msg) {
      console.log('fuciono buscarPersona ' + JSON.stringify(msg));

      $scope.personaCard = false;
      $scope.infoCitaCard = true;


      console.log('msg ' + JSON.stringify(msg));
      console.log('test ' + JSON.stringify(id_empresa_global));

      $scope.usuario = msg;

      AuthService.buscarTipoCita(id_empresa_global).then(function(res) {
        console.log('fuciono buscarTipoCita ' + JSON.stringify(res));

        console.log('msg ' + JSON.stringify(res));

        $scope.citas = res;

      }, function(errMsg) {
        // alert(JSON.stringify(errMsg));
        var alertPopup = $ionicPopup.alert({
          title: 'Error! No hay fucionarios para este tipo de cita',
          template: errMsg
        });
      });



      AuthService.buscarCitas(usuario, id_empresa_global).then(function(response) {
        console.log('fuciono buscarCitas ' + JSON.stringify(response));

        $scope.numeroCitas = response.length;

        console.log('response ' + JSON.stringify(response));


        $scope.citasLista = response[0];

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
      $scope.infoCitaCard = false;
      var alertPopup = $ionicPopup.alert({
        title: 'Error! Por favor verifique usuario',
        template: errMsg
      });
    });


  };

  $scope.buscarDependencia = function(idCita) {
    // $scope.count++;
    console.log('CITA ' + JSON.stringify(idCita));
    AuthService.buscarDependencia(idCita).then(function(res) {
      console.log('fuciono buscarPersona ' + JSON.stringify(res));

      console.log('msg ' + JSON.stringify(res));

      $scope.dependencias = res;

    }, function(errMsg) {

      var alertPopup = $ionicPopup.alert({
        title: 'Error! No hay fucionarios para este tipo de cita',
        template: errMsg
      });
    });
  };

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.logout = function() {
    AuthService.logout();
    UsuarioGlobal.remove();
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

.controller('LoginCtrl', function($scope, $state, $ionicPopup, $ionicHistory, AuthService, UsuarioGlobal) {

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

  $scope.login = function(user) {
    if (user.empresa == null || user.empresa == '') {
      var alertPopup = $ionicPopup.alert({
        title: 'Falta el campo Empresa'
      });
      return false;

    }
    // console.log('option ' + JSON.stringify($scope.option.nombre));
    AuthService.login($scope.user).then(function(msg) {
      console.log('metiendo al arraay ' + JSON.stringify($scope.user.empresa));
      $ionicHistory.nextViewOptions({
        disableBack: true
      });

      UsuarioGlobal.add($scope.user.empresa);

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


  //Usuario
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