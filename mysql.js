const Sequelize = require('sequelize');

const sequelize = new Sequelize('climate_weather', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});
const conexao = sequelize.authenticate()
    .then(function () {
        console.log('Conexão com o MySQL foi estabelecida com sucesso');
    })
    .catch(function (err) {
        console.log('Não foi possível se conectar com o banco de dados MySql');
    });

const Station = sequelize.define('station', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    province: {
        type: Sequelize.STRING
    },
    climate_id: {
        type: Sequelize.STRING
    },
    wmo_id: {
        type: Sequelize.STRING
    },
    tc_id: {
        type: Sequelize.STRING
    },
    latitude_decimal_degrees: {
        type: Sequelize.STRING
    },
    longitude_decimal_degrees: {
        type: Sequelize.STRING
    },
    latitude: {
        type: Sequelize.STRING
    },
    longitude: {
        type: Sequelize.STRING
    },
    elevation: {
        type: Sequelize.STRING
    },
    first_year: {
        type: Sequelize.STRING
    },
    last_year: {
        type: Sequelize.STRING
    },
    hly_first_year: {
        type: Sequelize.STRING
    },
    hly_last_year: {
        type: Sequelize.STRING
    },
    dly_first_year: {
        type: Sequelize.STRING
    },
    dly_last_year: {
        type: Sequelize.STRING
    },
    mly_first_year: {
        type: Sequelize.STRING
    },
    mly_last_year: {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true
});

module.exports = {Station};

//
//     'Climate ID': '1010066',
//     'Station ID': '14',
//     'WMO ID': '',
//     'TC ID': '',
//     'Latitude (Decimal Degrees)': '48.87',
//     'Longitude (Decimal Degrees)': '-123.28',
//     Latitude: '485200000',
//     Longitude: '-1231700000',
//     'Elevation (m)': '4',
//     'First Year': '1984',
//     'Last Year': '1996',
//     'HLY First Year': '',
//     'HLY Last Year': '',
//     'DLY First Year': '1984',
//     'DLY Last Year': '1996',
//     'MLY First Year': '1984',
//     'MLY Last Year': '1996'