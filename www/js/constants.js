angular.module('starter')

.constant('AUTH_EVENTS', {
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
	admin: 'admin_role',
	public: 'public'
})

.constant('API_ENDPOINT', {
  url: 'http://desarrollo.sarcontrolacceso.com/api/example/users/',
  urlEmpresa: 'http://desarrollo.sarcontrolacceso.com/api/example/empresa/',
  urlVerificar: 'http://desarrollo.sarcontrolacceso.com/api/example/verificar/',
  urlPersonas: 'http://desarrollo.sarcontrolacceso.com/api/example/personas/',
  urlTipocita: 'http://desarrollo.sarcontrolacceso.com/api/example/tipocita/'
  //  For a simulator use: url: 'http://127.0.0.1:8080/api'
});
