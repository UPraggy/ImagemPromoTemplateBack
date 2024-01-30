const dotenv = require('dotenv').config()

module.exports = {
  user: dotenv.parsed.DB_USER,
  password: dotenv.parsed.DB_PASSWORD,
  connectString: dotenv.parsed.DB_CONNECT_STRING
};

