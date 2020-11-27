const Repository = require('./repository');
const Sequelize = require('sequelize');
const _connection = require('./mysql');

class MysqlRepository extends Repository {

    constructor() {
        super();
        this._station = null;
        this._monthlyData = null;
        this.defineModels();
        // this.syncModels();
    }

    defineModels() {
        this.defineStationModel();
        this.defineMonthlyDataModel();

    }

    async createStation(station) {
        const stationItem = {
            climate_id: station['Climate ID'],
            station_id: station['Station ID'],
            name: station['Name'],
            province: station['Province'],
            wmo_id: station['WMO ID'],
            tc_id: station['TC ID'],
            latitude_decimal_degrees: station['Latitude (Decimal Degrees)'],
            longitude_decimal_degrees: station['Longitude (Decimal Degrees)'],
            latitude: station['Latitude'],
            longitude: station['Longitude'],
            elevation: station['Elevation (m)'],
            first_year: station['First Year'],
            last_year: station['Last Year'],
            hly_first_year: station['HLY First Year'],
            hly_last_year: station['HLY Last Year'],
            dly_first_year: station['DLY First Year'],
            dly_last_year: station['DLY Last Year'],
            mly_first_year: station['MLY First Year'],
            mly_last_year: station['MLY Last Year']
        };
        try {
            return await this._station.create(stationItem);
        } catch (e) {
            console.error(e);
        }
    }

    async createMonthlyData(monthlyData) {
        const monthlyDataItem = {
            climate_id: monthlyData['Climate ID'],
            data_time: monthlyData['Date/Time'],
            year: monthlyData['Year'],
            month: monthlyData['Month'],
            mean_max_temp_c: monthlyData['Mean Max Temp (°C)'],
            mean_max_temp_flag: monthlyData['Mean Max Temp Flag'],
            mean_min_temp_c: monthlyData['Mean Min Temp (°C)'],
            mean_min_temp_flag: monthlyData['Mean Min Temp Flag'],
            mean_temp_c: monthlyData['Mean Temp (°C)'],
            mean_temp_flag: monthlyData['Mean Temp Flag'],
            extra_max_temp_c: monthlyData['Extr Max Temp (°C)'],
            extra_max_temp_flag: monthlyData['Extr Max Temp Flag'],
            extra_min_temp_c: monthlyData['Extr Min Temp (°C)'],
            extra_min_temp_flag: monthlyData['Extr Min Temp Flag'],
            total_rain_mm: monthlyData['Total Rain (mm)'],
            total_rain_flag: monthlyData['Total Rain Flag'],
            total_snow_cm: monthlyData['Total Snow (cm)'],
            total_snow_flag: monthlyData['Total Snow Flag'],
            total_precip_mm: monthlyData['Total Precip (mm)'],
            total_precip_flag: monthlyData['Total Precip Flag'],
            snow_grnd_last_day_cm: monthlyData['Snow Grnd Last Day (cm)'],
            snow_grnd_last_day_flag: monthlyData['Snow Grnd Last Day Flag'],
            dir_of_max_gust_10s_deg: monthlyData['Dir of Max Gust (10\'s deg)'],
            dir_of_max_gust_flag: monthlyData['Dir of Max Gust Flag'],
            spd_of_max_gust_km_h: monthlyData['Spd of Max Gust (km/h)'],
            spd_of_max_gust_flag: monthlyData['Spd of Max Gust Flag']
        };
        try {
            return await this._monthlyData.create(monthlyDataItem);
        } catch (e) {
            console.error(e);
        }
    }

    defineStationModel() {
        this._station = _connection.define('station', {
            climate_id: {
                type: Sequelize.STRING,
                primaryKey: true
            },
            station_id: {
                type: Sequelize.BIGINT
            },
            name: {
                type: Sequelize.STRING
            },
            province: {
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
    }

    defineMonthlyDataModel() {
        this._monthlyData = _connection.define('monthlyData', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            // climate_id: {
            //     type: Sequelize.STRING,
            // },
            data_time: {
                type: Sequelize.STRING
            },
            year: {
                type: Sequelize.STRING
            },
            month: {
                type: Sequelize.STRING
            },
            mean_max_temp_c: {
                type: Sequelize.STRING
            },
            mean_max_temp_flag: {
                type: Sequelize.STRING
            },
            mean_min_temp_c: {
                type: Sequelize.STRING
            },
            mean_min_temp_flag: {
                type: Sequelize.STRING
            },
            mean_temp_c: {
                type: Sequelize.STRING
            },
            mean_temp_flag: {
                type: Sequelize.STRING
            },
            extra_max_temp_c: {
                type: Sequelize.STRING
            },
            extra_max_temp_flag: {
                type: Sequelize.STRING
            },
            extra_min_temp_c: {
                type: Sequelize.STRING
            },
            extra_min_temp_flag: {
                type: Sequelize.STRING
            },
            total_rain_mm: {
                type: Sequelize.STRING
            },
            total_rain_flag: {
                type: Sequelize.STRING
            },
            total_snow_cm: {
                type: Sequelize.STRING
            },
            total_snow_flag: {
                type: Sequelize.STRING
            },
            total_precip_mm: {
                type: Sequelize.STRING
            },
            total_precip_flag: {
                type: Sequelize.STRING
            },
            snow_grnd_last_day_cm: {
                type: Sequelize.STRING
            },
            snow_grnd_last_day_flag: {
                type: Sequelize.STRING
            },
            dir_of_max_gust_10s_deg: {
                type: Sequelize.STRING
            },
            dir_of_max_gust_flag: {
                type: Sequelize.STRING
            },
            spd_of_max_gust_km_h: {
                type: Sequelize.STRING
            },
            spd_of_max_gust_flag: {
                type: Sequelize.STRING
            },
        }, {
            freezeTableName: true
        });
        this._monthlyData.belongsTo(this._station, {foreignKey: 'climate_id'});
    }

    async syncModels() {
        await this._station.sync({force: true});
        await this._monthlyData.sync({force: true});
    }
}

module.exports = MysqlRepository;