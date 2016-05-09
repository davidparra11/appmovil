angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Javier Beltran',
    lastText: 'Gerente General',
    face: 'img/javier.png'
  }, {
    id: 1,
    name: 'Danilo Betancourt',
    lastText: 'Gerente de desarrollo',
    face: 'img/danilo.png'
  }, {
    id: 2,
    name: 'David Parra',
    lastText: 'desarrollador',
    face: 'img/david.png'
  }, {
    id: 3,
    name: 'Juan Atheortua',
    lastText: 'desarrollador',
    face: 'img/juan.png'
  }, {
    id: 4,
    name: 'Angela',
    lastText: 'Contratista Externa',
    face: 'img/angela.png'
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
