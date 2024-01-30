const express = require('express');
console.clear()
const routes = express.Router();



const controllers = {
    'GeraImagem': require('./controllers/GeraImagem.js'),
    'ConsultaProdTiraTeima': require('./controllers/ConsultaProdTiraTeima.js'),
    'GetPromocaoEArquivosRevista': require('./controllers/GetPromocaoEArquivosRevista.js'),
    'ConsultaColecoesRevistas': require('./controllers/ConsultaColecoesRevistas.js'),
    
  };
  
Object.keys(controllers).forEach(route => {
routes.post(`/${route}`, controllers[route].REST);
});


module.exports = routes;
