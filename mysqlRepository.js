const Repository = require('./repository');
const Sequelize = require('sequelize');
const _connection = require('./mysql');

class MysqlRepository extends Repository {

    constructor() {
        super();
        this._station = null;
        this._monthlyData = null;
        this._dailyData = null;
        this._hourlyData = null;
        this.defineModels();
        // this.syncModels();
    }

    defineModels() {
        this.defineStationModel();
        this.defineMonthlyDataModel();
        this.defineDailyDataModel();
        this.defineHourlyDataModel();
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

    async createDailyData(dailyData) {
        const dailyDataItem = {
            climate_id: dailyData['Climate ID'],
            data_time: dailyData['Date/Time'],
            year: dailyData['Year'],
            month: dailyData['Month'],
            day: dailyData['Day'],
            data_quality: dailyData['Data Quality'],
            max_temp_c: dailyData['Max Temp (°C)'],
            max_temp_flag: dailyData['Max Temp Flag'],
            min_temp_c: dailyData['Min Temp (°C)'],
            min_temp_flag: dailyData['Min Temp Flag'],
            mean_temp_c: dailyData['Mean Temp (°C)'],
            mean_temp_flag: dailyData['Mean Temp Flag'],
            heat_deg_days_c: dailyData['Heat Deg Days (°C)'],
            heat_deg_days_flag: dailyData['Heat Deg Days Flag'],
            cool_deg_days_c: dailyData['Cool Deg Days (°C)'],
            cool_deg_days_flag: dailyData['Cool Deg Days Flag'],
            total_rain_mm: dailyData['Total Rain (mm)'],
            total_rain_flag: dailyData['Total Rain Flag'],
            total_snow_cm: dailyData['Total Snow (cm)'],
            total_snow_flag: dailyData['Total Snow Flag'],
            total_precip_mm: dailyData['Total Precip (mm)'],
            total_precip_flag: dailyData['Total Precip Flag'],
            snow_grnd_cm: dailyData['Snow on Grnd (cm)'],
            snow_grnd_flag: dailyData['Snow on Grnd Flag'],
            dir_of_max_gust_10s_deg: dailyData['Dir of Max Gust (10\'s deg)'],
            dir_of_max_gust_flag: dailyData['Dir of Max Gust Flag'],
            spd_of_max_gust_km_h: dailyData['Spd of Max Gust (km/h)'],
            spd_of_max_gust_flag: dailyData['Spd of Max Gust Flag']
        };
        try {
            return await this._dailyData.create(dailyDataItem);
        } catch (e) {
            console.error(e);
        }
    }

    async createHourlyData(hourlyData) {
        const hourlyDataItem = {
            climate_id: hourlyData['Climate ID'],
            data_time: hourlyData['Date/Time'],
            year: hourlyData['Year'],
            month: hourlyData['Month'],
            day: hourlyData['Day'],
            time: hourlyData['Time'],
            temp_c: hourlyData['Temp (°C)'],
            temp_flag: hourlyData['Temp Flag'],
            dew_point_temp_c: hourlyData['Dew Point Temp (°C)'],
            dew_point_temp_flag: hourlyData['Dew Point Temp Flag'],
            rel_hum: hourlyData['Rel Hum (%)'],
            rel_hum_flag: hourlyData['Rel Hum Flag'],
            wind_dir_10s_deg: hourlyData['Wind Dir (10s deg)'],
            wind_dir_flag: hourlyData['Wind Dir Flag'],
            wind_spd_km_h: hourlyData['Wind Spd (km/h)'],
            wind_spd_flag: hourlyData['Wind Spd Flag'],
            visibility_km: hourlyData['Visibility (km)'],
            visibility_flag: hourlyData['Visibility Flag'],
            stn_press_kpa: hourlyData['Stn Press (kPa)'],
            stn_press_flag: hourlyData['Stn Press Flag'],
            hmdx: hourlyData['Hmdx'],
            hmdx_flag: hourlyData['Hmdx Flag'],
            wind_chill: hourlyData['Wind Chill'],
            wind_chill_flag: hourlyData['Wind Chill Flag'],
            weather: hourlyData['Weather']
        };
        try {
            return await this._hourlyData.create(hourlyDataItem);
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
            }
        }, {
            freezeTableName: true
        });
        this._monthlyData.belongsTo(this._station, {foreignKey: 'climate_id'});
    }

    defineDailyDataModel() {
        this._dailyData = _connection.define('dailyData', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            // climate_id: {
            //     type: Sequelize.STRING
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
            day: {
                type: Sequelize.STRING
            },
            data_quality: {
                type: Sequelize.STRING
            },
            max_temp_c: {
                type: Sequelize.STRING
            },
            max_temp_flag: {
                type: Sequelize.STRING
            },
            min_temp_c: {
                type: Sequelize.STRING
            },
            min_temp_flag: {
                type: Sequelize.STRING
            },
            mean_temp_c: {
                type: Sequelize.STRING
            },
            mean_temp_flag: {
                type: Sequelize.STRING
            },
            heat_deg_days_c: {
                type: Sequelize.STRING
            },
            heat_deg_days_flag: {
                type: Sequelize.STRING
            },
            cool_deg_days_c: {
                type: Sequelize.STRING
            },
            cool_deg_days_flag: {
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
            snow_grnd_cm: {
                type: Sequelize.STRING
            },
            snow_grnd_flag: {
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
            }
        }, {
            freezeTableName: true
        });
        this._dailyData.belongsTo(this._station, {foreignKey: 'climate_id'});
    }

    defineHourlyDataModel() {
        this._hourlyData = _connection.define('hourlyData', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            // climate_id: {
            //     type: Sequelize.STRING
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
            day: {
                type: Sequelize.STRING
            },
            time: {
                type: Sequelize.STRING
            },
            temp_c: {
                type: Sequelize.STRING
            },
            temp_flag: {
                type: Sequelize.STRING
            },
            dew_point_temp_c: {
                type: Sequelize.STRING
            },
            dew_point_temp_flag: {
                type: Sequelize.STRING
            },
            rel_hum: {
                type: Sequelize.STRING
            },
            rel_hum_flag: {
                type: Sequelize.STRING
            },
            wind_dir_10s_deg: {
                type: Sequelize.STRING
            },
            wind_dir_flag: {
                type: Sequelize.STRING
            },
            wind_spd_km_h: {
                type: Sequelize.STRING
            },
            wind_spd_flag: {
                type: Sequelize.STRING
            },
            visibility_km: {
                type: Sequelize.STRING
            },
            visibility_flag: {
                type: Sequelize.STRING
            },
            stn_press_kpa: {
                type: Sequelize.STRING
            },
            stn_press_flag: {
                type: Sequelize.STRING
            },
            hmdx: {
                type: Sequelize.STRING
            },
            hmdx_flag: {
                type: Sequelize.STRING
            },
            wind_chill: {
                type: Sequelize.STRING
            },
            wind_chill_flag: {
                type: Sequelize.STRING
            },
            weather: {
                type: Sequelize.STRING
            }
        }, {
            freezeTableName: true
        });
        this._hourlyData.belongsTo(this._station, {foreignKey: 'climate_id'});
    }

    async syncModels() {
        console.info('STARTED SYNC MODEL');
        try {
            await this._monthlyData.sync({force: true});
            await this._dailyData.sync({force: true});
            await this._hourlyData.sync({force: true});
            await this._station.sync({force: true});
        } catch (e) {
            console.error(e);
        }
        console.info('FINISHED SYNC MODEL');
    }
}

module.exports = MysqlRepository;