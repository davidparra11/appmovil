// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
  //, 'ngMockE2E'

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('menu', {
        url: '/menu',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MenuCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })
      .state('menu.citas', {
        url: '/citas',
        views: {
          'contenido': {
            templateUrl: 'templates/citas.html'
          }
        }
      })
      .state('menu.digiturno', {
        url: '/digiturno',
        views: {
          'contenido': {
            templateUrl: 'templates/digiturno.html'
          }
        }
      })
      .state('menu.detalles', {
        url: '/detalles/:chatId',
        views: {
          'contenido': {
            templateUrl: 'templates/detalles.html',
            controller: 'DetallesCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/login');
  })


  .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
      if (!AuthService.isAuthenticated()) {
        console.log(next.name);
        if (next.name !== 'login' && next.name !== 'outside.register') {
          event.preventDefault();
          $state.go('login');
        }
      }
    });
  });
