const axios = require('axios').default;
const parse = require('csv-parse');
const {Readable} = require("stream");
const StationDao = require('./stationDao');
const MonthlyDao = require('./monthlyDataDao');
const DailyDao = require('./dailyDataDao');
const HourlyDao = require('./hourlyDataDao');
const MysqlRepository = require('./mysqlRepository');

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

const repository = new MysqlRepository();
const StationRepository = new StationDao(repository);
const MonthlyRepository = new MonthlyDao(repository);
const DailyRepository = new DailyDao(repository);
const HourlyRepository = new HourlyDao(repository);

async function downloadStationInventory(downloadUrl) {
    console.log('downloadUrl', downloadUrl);
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
            // console.log('[station] record - ', record['Station ID']);
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
    console.log('STARTED THE STATION RETRIEVE AT: ', new Date());
    try {
        const downloadUrl = await retrieveDownloadUrlForStationInventory();
        return await downloadStationInventory(downloadUrl);
    } catch (e) {
        console.error(e);
    } finally {
        console.log('FINISHED THE STATION RETRIEVE AT: ', new Date());
    }
}

async function persistStations(stations) {
    console.log('STARTED THE STATION PERSISTENCE AT: ', new Date());
    const stationsFiltered = stations
        .filter(station => {
            return station['Station ID'] === '52'
                || station['Station ID'] === '65';
            // return station['Station ID'] < 150;
        });
    for (const station of stations) {
        console.log(`CREATING STATION: ${station['Station ID']} - ${stations.indexOf(station) + 1} of ${stations.length}`);
        await StationRepository.create(station);
        console.log(`STATION CREATED: ${station['Station ID']} - ${stations.indexOf(station) + 1} of ${stations.length}`);
    }
    console.log('FINISHED THE STATION PERSISTENCE AT: ', new Date());
}

async function retrieveMonthlyDataLists(stations) {
    console.log('STARTED THE MONTHLY DATA LIST RETRIEVE AT: ', new Date());
    const stationsFiltered = stations
        .filter(station => {
            return station['Station ID'] === '52'
                || station['Station ID'] === '65';
            // return station['Station ID'] < 50;
        });
    for (const station of stations) {
        console.log(`STARTED THE MONTHLY DATA RETRIEVE: ${station['Name']} - ${stations.indexOf(station) + 1} of ${stations.length}`);
        await retrieveMonthlyData(station);
        console.log(`FINISHED THE MONTHLY DATA RETRIEVE: ${station['Name']} - ${stations.indexOf(station) + 1} of ${stations.length}`);
    }
    console.log('FINISHED THE MONTHLY DATA LIST RETRIEVE AT: ', new Date());
}

async function retrieveDailyDataLists(stations) {
    console.log('STARTED THE DAILY DATA LIST RETRIEVE AT: ', new Date());
    const stationsFiltered = stations
        .filter(station => {
            return station['Station ID'] === '52'
                || station['Station ID'] === '65';
            // return station['Station ID'] < 50;
        });
    for (const station of stations) {
        console.log(`STARTED THE DAILY DATA RETRIEVE: ${station['Name']} - ${stations.indexOf(station) + 1} of ${stations.length}`);
        await retrieveDailyData(station);
        console.log(`FINISHED THE DAILY DATA RETRIEVE: ${station['Name']} - ${stations.indexOf(station) + 1} of ${stations.length}`);
    }
    console.log('FINISHED THE DAILY DATA LIST RETRIEVE AT: ', new Date());
}

async function retrieveHourlyDataLists(stations) {
    console.log('STARTED THE HOURLY DATA LIST RETRIEVE AT: ', new Date());

    const stationsFiltered = stations
        .filter(station => {
            return station['Station ID'] === '52'
                || station['Station ID'] === '65';
            // return station['Station ID'] < 150;
        });
    for (const station of stations) {
        console.log(`STARTED THE HOURLY DATA RETRIEVE: ${station['Name']} - ${stations.indexOf(station) + 1} of ${stations.length}`);
        await retrieveHourlyData(station);
        console.log(`FINISHED THE HOURLY DATA RETRIEVE: ${station['Name']} - ${stations.indexOf(station) + 1} of ${stations.length}`);
    }
    console.log('FINISHED THE HOURLY DATA LIST RETRIEVE AT: ', new Date());
}

async function main() {
    try {
        console.log('STARTED AT: ', new Date());

        const stations = await retrieveStationInventory();
        await persistStations(stations);

        await retrieveMonthlyDataLists(stations);

        await retrieveDailyDataLists(stations);

        await retrieveHourlyDataLists(stations);

        console.log('FINISHED AT: ', new Date());
    } catch (e) {
        console.error(e);
    }
}

let promise = main();

async function downloadHourlyData(station) {
    try {
        if (station['HLY First Year'] !== "" && station['HLY Last Year'] !== "") {
            console.log(`download hourly data from ${station['Station ID']} - ${station['Name']}`);
            for (let year = station['HLY First Year']; year <= station['HLY Last Year']; year++) {
                for (let month = 1; month <= 12; month++) {
                    let hourlyDataUrl = `https://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID=${station['Station ID']}&Year=${year}&Month=${month}&timeframe=1&submit= Download+Data`;
                    const response = await axios.get(hourlyDataUrl);
                    const {data} = response;
                    console.log('hourly data', data);
                    const parser = Readable.from([data]).pipe(
                        parse({
                            from_line: 1,
                            columns: true,
                            relax_column_count: true
                        }));
                    for await (const record of parser) {
                        console.log('[hourly] record - ', record['Date/Time']);
                        if (Object.keys(record).length > 9) {
                            console.log(`CREATING HOURLY DATA: ${record['Climate ID']} - ${record['Date/Time']}`);
                            await HourlyRepository.create(record);
                            console.log(`HOURLY DATA CREATED: ${record['Climate ID']} - ${record['Date/Time']}`);
                        }
                    }
                }
            }
        }
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

async function downloadDailyData(station) {
    console.log(`download daily data from ${station['Station ID']} - ${station['Name']}`);
    try {
        for (let year = station['DLY First Year']; year <= station['DLY Last Year']; year++) {
            let dailyDataUrl = `https://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID=${station['Station ID']}&Year=${year}&timeframe=2&submit=%20Download+Data`;
            const response = await axios.get(dailyDataUrl);
            const {data} = response;
            // console.log('daily data', data);
            const parser = Readable.from([data]).pipe(
                parse({
                    from_line: 1,
                    columns: true,
                    relax_column_count: true
                }));
            for await (const record of parser) {
                console.log('[daily] record - ', record['Date/Time']);
                let count = 0;
                Object.entries(record).map(entry => {
                    if (entry[1] === '') {
                        //delete record[entry[0]];
                        count = count + 1;
                    }
                });
                if (Object.keys(record).length - count > 8) {
                    console.log(`CREATING DAILY DATA: ${record['Climate ID']} - ${record['Date/Time']}`);
                    await DailyRepository.create(record);
                    console.log(`DAILY DATA CREATED: ${record['Climate ID']} - ${record['Date/Time']}`);
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}

async function retrieveDailyData(station) {
    try {
        return await downloadDailyData(station);
    } catch (e) {
        console.error(e);
    }
}

async function downloadMonthlyData(station) {
    console.log(`download monthly data from ${station['Station ID']} - ${station['Name']}`);
    try {
        let monthlyDataUrl = `https://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID=${station['Station ID']}&timeframe=3&submit=%20Download+Data`;
        const response = await axios.get(monthlyDataUrl);
        const {data} = response;
        // console.log('monthly data', data);
        const parser = Readable.from([data]).pipe(
            parse({
                from_line: 1,
                columns: true,
                relax_column_count: true
            }));
        for await (const record of parser) {
            console.log('[monthly] record - ', record['Date/Time']);
            let count = 0;
            Object.entries(record).map(entry => {
                if (entry[1] === '') {
                    //delete record[entry[0]];
                    count = count + 1;
                }
            });
            if (Object.keys(record).length - count > 7) {
                console.log(`CREATING MONTHLY DATA: ${record['Climate ID']} - ${record['Date/Time']}`);
                await MonthlyRepository.create(record);
                console.log(`MONTHLY DATA CREATED: ${record['Climate ID']} - ${record['Date/Time']}`);
            }

        }
    } catch (e) {
        console.error(e);
    }
}

async function retrieveMonthlyData(station) {
    try {
        return await downloadMonthlyData(station);
    } catch (e) {
        console.error(e);
    }
}