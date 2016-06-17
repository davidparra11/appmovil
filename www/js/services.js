angular.module('starter.services', [])


//angular.module('starter')

.service('AuthService', function($q, $http, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  // var username = '';
  var isAuthenticated = false;
  // var role = '';
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;

    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;

  }

  function destroyUserCredentials() {
    authToken = undefined;
    //username = '';
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    //$http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }


  var buscar = function(user) {
    var reqBuscarEmpresa = {
      method: 'POST',
      url: API_ENDPOINT.url,
      headers: {

      },
      data: {
        usuario: user.usuario
      }
    }

    return $q(function(resolve, reject) {
      console.log('user ' + JSON.stringify(user));
      // alert('loging buton');
      $http(reqBuscarEmpresa).then(function(result) {
        // alert('result. user ' + JSON.stringify(result.data[0]));
        console.log('result usuario ' + JSON.stringify(result.data.length));
        //console.log('result data usuario ' + JSON.stringify(result.data[0].id_empresa_persona));
        if (result.data.length !== 0) {
          //state = false;
          user.id_empresa_persona = result.data[0].id_empresa_persona;
          //user.id_empresa = result.data[0].id_empresa;
          resolve(result.data);
        } else {
          reject(result.data.msg);
        }
      });
    });
  }


  //var login = function(name, pw) {
  var login = function(user) {

    var req = {
      method: 'POST',
      url: API_ENDPOINT.urlVerificar,
      headers: {
        'id': ''
      },
      data: {
        usuario: user.usuario,
        id_empresa_persona: user.id_empresa_persona,
        password: user.password

      }
    }

    return $q(function(resolve, reject) {
      console.log('user ' + JSON.stringify(user));
      $http(req).then(function(result) {
        console.log('Entrar result ' + JSON.stringify(result));
        if (result.data == true) {
          storeUserCredentials(result.data.token);
          console.log('id_empresa cuando se logie sucess 2 ' + JSON.stringify(user.empresa));
          resolve(result.data.msg);
          user.usuario = '';
          // user.empresa = '';
          user.password = '';
          user.id_empresa_persona = '';
        } else {
          reject(result.data.msg);
        }
      });
    });

  }

  var buscarPersona = function(user, id_empresa) {
    var req = {
      method: 'POST',
      url: API_ENDPOINT.urlPersonas,
      headers: {
        'id': ''
      },
      data: {
        usuario: user.identifier,
        id_empresa: id_empresa
      }
    }
    return $q(function(resolve, reject) {
      console.log('user en buscarPersona ' + JSON.stringify(user));
      $http(req).then(function(result) {
        console.log('Entrar result ' + JSON.stringify(result));
        console.log('Entrar result id_empresa ' + JSON.stringify(result.data.id_empresa));
        if (result.data.id_empresa) {
          //storeUserCredentials(result.data);
          resolve(result.data);

        } else {
          reject(result.data);
        }
      });
    });

  }

  var buscarTipoCita = function(id_empresa_usuario) {
    console.log('on buscarPersona data: ' + JSON.stringify(id_empresa_usuario));
    var req = {
      method: 'POST',
      url: API_ENDPOINT.urlTipocita,
      headers: {
        'id': ''
      },
      data: {
        id_empresa: id_empresa_usuario
      }
    }
    return $q(function(resolve, reject) {
      $http(req).then(function(result) {
        console.log('Entrar buscarTipoCita result ' + JSON.stringify(result));
        if (result.status == 200) {
          //storeUserCredentials(result.data);
          resolve(result.data);

        } else {
          reject(result.data);
        }
      });
    });

  }

  var buscarCitas = function(user, id_empresa_persona) {
    console.log('on buscarCitas ' + JSON.stringify(user));
    var req = {
      method: 'POST',
      url: API_ENDPOINT.urlCitas,
      headers: {
        'id': ''
      },
      data: {
        id_empresa: '1', //esta quemado por que es el unico que recupera citas.
        identificacion: user.identifier
      }
    }
    return $q(function(resolve, reject) {
      $http(req).then(function(result) {
        console.log('Entrar buscarCitas result ' + JSON.stringify(result.data.length));
        if (result.status == 200) {
          //storeUserCredentials(result.data);
          resolve(result.data);

        } else {
          reject(result.data);
        }
      });
    });

  }

  var buscarDependencia = function(tipoCita) {
    console.log('on buscarDependencia ' + JSON.stringify(tipoCita));
    var req = {
      method: 'POST',
      url: API_ENDPOINT.urlDependencia,
      headers: {
        'id': ''
      },
      data: {
        id_tipo_cita: tipoCita
      }
    }
    
    return $q(function(resolve, reject) {
      console.log('buscarDependencia ' + JSON.stringify(tipoCita));
      $http(req).then(function(result) {
        console.log('Entrar buscarDependencia result ' + JSON.stringify(result));
        if (result.data.length !== 0 ) {
          //storeUserCredentials(result.data);
          resolve(result.data);



        } else {
          reject(result.data);
        }
      });
    });

  }//buscarFuncionario


  var buscarFuncionario = function(idEmpresa, idEmpresaAsignada, idTipoCita) {
   // console.log('on buscarFuncionario ' + JSON.stringify());
    var reqFuncionario = {
      method: 'POST',
      url: API_ENDPOINT.urlFuncionarios,
      headers: {
        'id': ''
      },
      data: {
        id_empresa: idEmpresa,
        id_empresa_asignada: idEmpresaAsignada,
        id_tipo_cita: idTipoCita
      }
    }
    return $q(function(resolve, reject) {
      $http(reqFuncionario).then(function(res) {
                console.log('Entrar buscarFuncionario result ' + JSON.stringify(res));
                if (res.data.length !== 0 ) {
                  //storeUserCredentials(result.data);result.data.length !== 0  res.status == 200
                  resolve(res.data);


                    } else {
                      reject(res.data);
                    }
                  });
      });

  }//buscarAgendas

  var buscarAgendas = function(idEmpresaPersona, idTipoCita, idEmpresaAsignada) {
   // console.log('on buscarFuncionario ' + JSON.stringify());
    var reqAgenda = {
      method: 'POST',
      url: API_ENDPOINT.urlAgenda,
      headers: {
        'id': ''
      },
      data: {
        id_empresa_persona: idEmpresaPersona,
        id_tipo_cita: idTipoCita,
        id_empresa_asignada: idEmpresaAsignada
      }
    }
    return $q(function(resolve, reject) {
      $http(reqAgenda).then(function(res) {
               // console.log('Entrar buscarAgendas result ' + JSON.stringify(res.data["Johana Marcela Ramirez "].fecha ));
                if (res.status == 200) {
                  //storeUserCredentials(result.data);
                  resolve(res.data);


                    } else {
                      reject(res.data);
                    }
                  });
      });

  }//



  var logout = function() {
    destroyUserCredentials();
  };

  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };

  loadUserCredentials();

  return {
    login: login,
    logout: logout,
    buscar: buscar,
    buscarPersona: buscarPersona,
    buscarTipoCita: buscarTipoCita,
    buscarCitas: buscarCitas,
    buscarDependencia: buscarDependencia,
    buscarFuncionario: buscarFuncionario,
    buscarAgendas: buscarAgendas,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {
      return isAuthenticated;
    },
  };
})


.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function(response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

.factory("UsuarioGlobal", function() {
  var infoUsuario = [];
  var identificacionUser = '';
  var id_empresa = '';

  /* var interfaz = {
       user_id: identificacionUser,
       getDescargas: function(){
           return infoUsuario;
       },
       nuevaDescarga: function(descarga){
           infoUsuario.push(descarga);
           id_empresa = descarga;
       }
   }
   return interfaz;*/

  return {
    add: function(data) {
      id_empresa = data;
      infoUsuario.push(data);
    },
    get: function() {
      return id_empresa;
    },
    remove: function() {
      id_empresa = '';
    }
  };
});



