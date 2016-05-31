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
    /* username = token.split('.')[0];
     isAuthenticated = true;
     authToken = token;

     if (username == 'admin') {
     role = USER_ROLES.admin
     }
     if (username == 'user') {
     role = USER_ROLES.public
     }

     // Set the token as header for your requests!
     $http.defaults.headers.common['X-Auth-Token'] = token;*/
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

    var reqEmpresa = {
        method: 'POST',
        url: API_ENDPOINT.urlEmpresa,
        headers: {

        },
        data: {
          usuario: user.usuario
        }
      }
      //result.data[0].usuario == user.usuario
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
          $http(reqEmpresa).then(function(result) {
            // alert('result. user ' + JSON.stringify(result.data[0]));
            console.log('result usuario Empresa ' + JSON.stringify(result.data));
            console.log('result data usuario Empresa ' + JSON.stringify(result.status));
            if (result.status == 200) {


              console.log('OK' + JSON.stringify(result.data));



              // storeUserCredentials(result.data.token);
              resolve(result.data);
            } else {
              reject(result.data.msg);
            }
          });



          // storeUserCredentials(result.data.token);
          // resolve(result.data.msg);
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
      // alert('loging buton');
      $http(req).then(function(result) {
        // alert('result. ' + JSON.stringify(result.data[0]));
        console.log('Entrar result ' + JSON.stringify(result))
        if (result.data == true) {
          storeUserCredentials(result.data.token);
          resolve(result.data.msg);
          user.usuario = '';
          user.empresa = '';
          user.password = '';
          user.id_empresa_persona = '';
        } else {
          reject(result.data.msg);
        }
      });
    });



    /* return $q(function(resolve, reject) {
     if ((name == 'admin' && pw == '1') || (name == 'user' && pw == '1')) {
     // Make a request and receive your auth token from your server
     storeUserCredentials(name + '.yourServerToken');
     resolve('Login success.');
     } else {
     reject('Login Failed.');
     }
     });*/
  }



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
    // state: state,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {
      return isAuthenticated;
    },
    // username: function() {return username;},
    // role: function() {return role;}
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

/*
.factory('CitasService', function($resource) {
  return {
    responseError: function(response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})*/



/**/
.factory('Chats', function($http, API_ENDPOINT) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Javier Beltran',
    identificacion: '19497896',
    face: 'img/javier.png',
    sexo: 'masculino'
  }, {
    id: 1,
    name: 'Danilo Betancourt',
    identificacion: '9870680',
    face: 'img/danilo.png',
    sexo: 'masculino'

  }, {
    id: 2,
    name: 'David Parra',
    identificacion: '1088309083',
    face: 'img/david.png',
    sexo: 'masculino'

  }, {
    id: 3,
    name: 'Juan Atheortua',
    identificacion: '1039451685',
    face: 'img/juan.png',
    sexo: 'masculino'

  }, {
    id: 4,
    name: 'Angela Hernandez',
    identificacion: '52889831',
    face: 'img/angela.png',
    sexo: 'Femenino'

  }, {
    id: 5,
    name: 'Roosvel Guinald',
    identificacion: '89009950',
    face: 'img/roosvel.png',
    sexo: 'masculino'

  }, {
    id: 6,
    name: 'Claudia Salazar',
    identificacion: '41936493',
    face: 'img/claudia.png',
    sexo: 'Femenino'

  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});