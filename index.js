'use strict';

const Alexa = require('alexa-sdk');
const http = require('http');

const apiUrl = 'http://taco-randomizer.herokuapp.com/random/';

const APP_ID = '';

function makeApiRequest (callback){
  http.get(apiUrl, function(res){
    var body = '';

    res.on('data', function(data){
      body += data;
    });

    res.on('end', function(){
      var result = JSON.parse(body);
      callback(result);
    });

  }).on('error', function(e){
    console.log('Error: ' + e);
  });
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('NewTacoIntent');
    },

    'NewTacoIntent': function () {
      makeApiRequest((json) => {
        const condiment = json.condiment.name;
        const mixin = json.mixin.name;
        const baseLayer = json.base_layer.name;
        const seasoning = json.seasoning.name;
        const shell = json.shell.name;

        let tacoString = baseLayer + ' seasoned with ' + seasoning + ', topped with ' + mixin + ' and ' + condiment + ' wrapped in a ' +  shell;

        tacoString += '.  Would you like me to order these ingredients for you on Prime Now?';

        this.emit(':tell', tacoString);
      });
    }

 };

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);

  if ('undefined' === typeof process.env.DEBUG) {
    alexa.appId = APP_ID;
  }

  alexa.registerHandlers(handlers);
  alexa.execute();
};