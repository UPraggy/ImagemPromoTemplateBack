const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();


// Configurar o middleware CORS antes de qualquer rota
app.use(cors());


app.use(express.json());
app.use(routes);

app.listen(process.env.PORTASERVIDOR, '0.0.0.0');
