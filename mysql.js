const Sequelize = require('sequelize');

const _connection = new Sequelize('climate_weather', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});
module.exports = _connection;