const axios = require('axios').default;
const parse = require('csv-parse');
const {Readable} = require("stream");
const {Station} = require('./mysql');

const requestDownloadUrl = 'https://drive.google.com/uc?id=1egfzGgzUb0RFu_EE5AYFZtsyXPfZ11y2&authuser=0&export=download';

const headers = {
    'content-length': '0',
    'x-drive-first-party': 'DriveWebUi',
};

const config = {
    url: requestDownloadUrl,
    method: 'POST',
    headers: headers
};

async function downloadStationInventory(downloadUrl) {
    console.log(downloadUrl);
    try {
        const response = await axios.get(downloadUrl);
        const {data} = response;
        // console.log('data', data);
        const stations = [];
        const parser = Readable.from([data]).pipe(
            parse({
                from_line: 3,
                columns: true,
            }));
        for await (const record of parser) {
            // console.log('record', record);
            stations.push(record);
        }
        return stations;
    } catch (e) {
        console.error(e);
    }
}

async function retrieveDownloadUrlForStationInventory() {
    try {
        const response = await axios(config);
        const {data} = response;
        const rawData = data.replace(')]}\'', '');
        const downloadData = JSON.parse(rawData);
        console.log('downloadData', downloadData);
        const {downloadUrl} = downloadData;
        return downloadUrl;
    } catch (e) {
        console.error(e);
    }
}

async function retrieveStationInventory() {
    try {
        const downloadUrl = await retrieveDownloadUrlForStationInventory();
        return await downloadStationInventory(downloadUrl);
    } catch (e) {
        console.error(e);
    }
}



try {
    retrieveStationInventory()
        .then((stations) => {
            console.log('stations', stations[28]);
            // Station.sync({force: true}).then(function () {
            //     stations.forEach(station => {
            //         Station.create({
            //             id: station['Station ID'],
            //             name: station['Name'],
            //             province: station['Province'],
            //             climate_id: station['Climate ID'],
            //             wmo_id: station['WMO ID'],
            //             tc_id: station['TC ID'],
            //             latitude_decimal_degrees: station['Latitude (Decimal Degrees)'],
            //             longitude_decimal_degrees: station['Longitude (Decimal Degrees)'],
            //             latitude: station['Latitude'],
            //             longitude: station['Longitude'],
            //             elevation: station['Elevation (m)'],
            //             first_year: station['First Year'],
            //             last_year: station['Last Year'],
            //             hly_first_year: station['HLY First Year'],
            //             hly_last_year: station['HLY Last Year'],
            //             dly_first_year: station['DLY First Year'],
            //             dly_last_year: station['DLY Last Year'],
            //             mly_first_year: station['MLY First Year'],
            //             mly_last_year: station['MLY Last Year']
            //         });
            //     });
            // });
            retrieveHourlyData(stations[28]).then((hourlyData) => {
                console.log('hourly data', hourlyData);
            });
        }).catch((e) => {
        console.error(e);
    });
} catch (e) {
    console.error(e);
}


async function downloadHourlyData(station) {
    console.log(`download hourly data from ${station['Station ID']} - ${station['Name']}`);
    try {
        const hourlyData = [];
        for (let year = station['HLY First Year']; year <= station['HLY Last Year']; year++ ){
            for (let month = 1; month <= 12; month++ ){
                let hourlyDataUrl = `https://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID=${station['Station ID']}&Year=${year}&Month=${month}&timeframe=1&submit= Download+Data`;
                const response = await axios.get(hourlyDataUrl);
                const {data} = response;
                // console.log('data', data);
                const parser = Readable.from([data]).pipe(
                    parse({
                        from_line: 1,
                        columns: true,
                        relax_column_count: true
                    }));
                for await (const record of parser) {
                    if (Object.keys(record).length > 9){
                        console.log('record', record['Date/Time']);
                        hourlyData.push(record);
                    }
                }
            }
        }
        return hourlyData;
    } catch (e) {
        console.error(e);
    }
}

async function retrieveHourlyData(station) {
    try {
        return await downloadHourlyData(station);
    } catch (e) {
        console.error(e);
    }
}