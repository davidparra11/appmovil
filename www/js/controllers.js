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


.controller('DetallesCtrl', function($scope, $stateParams) {
 // $scope.persona = Personas.get($stateParams.personaId);
})


.controller('MenuCtrl', function($scope, $stateParams, $ionicSideMenuDelegate, $state, $ionicPopup, $ionicHistory, AuthService, UsuarioGlobal) {
  //$scope.chat = Chats.get($stateParams.chatId);
  // $state.go('inside.citas');
  $scope.personaCard = true;
  $scope.numeroCitas = 0;
  $scope.FuncionariosBtn = true;
  $scope.AgendaList = true;
  $scope.FuncionariosList = true;

  $ionicHistory.nextViewOptions({
    disableBack: true
  });



  $scope.identificacion = function(usuario) {
    console.log('test on identificacion' + usuario.identifier);
    /*  var alertPopup = $ionicPopup.alert({
        title: usuario.identifier
      });*/
    //return false;
     id_empresa_global = UsuarioGlobal.get();
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



  $scope.buscarFuncionarios = function(idCita) {
    // $scope.count++;
    console.log('CITA ' + JSON.stringify(idCita));
    AuthService.buscarFuncionario(id_empresa_global, $scope.usuario.id_empresa_asignada, $scope.citas.id_tipo_cita).then(function(res) {
      $scope.FuncionariosList = false;
      console.log('fuciono buscarFuncionario ' + JSON.stringify(res));

      console.log('msg ' + JSON.stringify(res));

      $scope.funcionarios = res;

      

    }, function(errMsg) {
      $scope.AgendaList = true;
      $scope.FuncionariosList = true;
      var alertPopup = $ionicPopup.alert({
        title: 'Error! No hay fucionarios para este tipo de cita',
        template: errMsg
      });
    });
  };


   $scope.buscarAgendas = function(idEmpresaPersona) {
    // $scope.count++;
    console.log('idEmpresaPersona ' + JSON.stringify(idEmpresaPersona));
    console.log('id_empresa_asignada ' + JSON.stringify( $scope.usuario.id_empresa_asignada));
    console.log('id_tipo_cita ' + JSON.stringify($scope.citas.id_tipo_cita));
    AuthService.buscarAgendas(idEmpresaPersona, $scope.citas.id_tipo_cita,  $scope.usuario.id_empresa_asignada).then(function(res) {
      console.log('fuciono buscarAgendas RES ' + JSON.stringify(res));
      $scope.FuncionariosList = true;
      $scope.FuncionariosBtn = false;
      $scope.AgendaList = false;
     /* var arrayAgenda = data.toString().split(", ");
        console.log('array Agenda ' + arrayAgenda);
        console.log('array Agenda1 ' + arrayAgenda[0]);
        console.log('array Agenda1 length ' + arrayAgenda[1].length);*/
      //var sin = res[0].horas.replace(',', 'number');
      var number = [];
      var matches = [];
       var sin = res[0].horas;
       var arrayAgenda = sin.toString().split(",");
        console.log('array Agenda ' + arrayAgenda);
        console.log('array Agenda1 ' + arrayAgenda[0]);
       var yyy = arrayAgenda;
      console.log('fuciono buscarAgendas  HORAS ' + JSON.stringify(yyy));
     /* var asignadas = res[2].horas_asignadas;
      var asignadasArray = asignadas.toString().split(",");
        console.log('array Agenda ' + asignadasArray);
        console.log('array Agenda1 ' + asignadasArray[0]);
       var zzz = asignadasArray;
      console.log('fuciono buscarAgendas  HORAS ' + JSON.stringify(zzz));*/

      for (i = 0; i < res.length; i++) {
           
              var d = new Date (res[i].fecha * 1000);
              var days = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
               var months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
                number.push("" + days[ d.getDay()] + " " + d.getDate() + "/" + months[ d.getMonth()] + "/" + d.getFullYear());
          
            //console.log('number ' + number.toString());

        };
        console.log('number ' + JSON.stringify(number));
        console.log('number ' + number.toString());

     /* for (j = 0; j < zzz.length; j++) {         

            for (i = 0; i < yyy.length; i++) {
              if (yyy[i] === zzz[j]) {
                matches.push("Horario ya asignado");
                j++;
            } else {
                
                matches.push("");
            } 

            };
      };*/


      console.log('matches ' + JSON.stringify(matches));
      console.log('msg ' + JSON.stringify(res));

      $scope.fotoFuncionario = res[0];
      $scope.agendas = number;
      $scope.horas = yyy;

      //$scope.horas = ["08:00 AM","08:20 AM","08:40 AM","09:00 AM"];
    //  var sin = res[0].horas.replace('"', '');
      //$scope.horas = sin;

      

    }, function(errMsg) {

      var alertPopup = $ionicPopup.alert({
        title: 'Error! No hay Agendas para este tipo de cita',
        template: errMsg
      });
    });
  };


  $scope.mostrarFuncionarios = function() {
    $scope.FuncionariosList = false;
      $scope.FuncionariosBtn = true;
      $scope.AgendaList = true;
   
  };

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.logout = function() {
    AuthService.logout();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
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
  $scope.image = "http://desarrollo.sarcontrolacceso.com/assets/images/logosar.png";
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