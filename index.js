const axios = require('axios').default;
const parse = require('csv-parse');
const {Readable} = require("stream");
const StationDao = require('./stationDao');
const MonthlyDao = require('./monthlyDataDao');
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

const StationRepository = new StationDao(new MysqlRepository());
const MonthlyRepository = new MonthlyDao(new MysqlRepository());

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
    try {
        const downloadUrl = await retrieveDownloadUrlForStationInventory();
        return await downloadStationInventory(downloadUrl);
    } catch (e) {
        console.error(e);
    }
}

async function main() {
    try {
        console.log('STARTED AT: ', new Date());
        const stations = await retrieveStationInventory();
        const stationCreation = await stations
            // .filter(station => {
            //     return station['Station ID'] === '14'
            //     // || station['Station ID'] === '15';
            // })
            .map(async station => {
                console.log('creating station: ', station['Station ID']);
                await StationRepository.create(station);
                console.log('station created: ', station['Station ID']);
            });
        // retrieveHourlyData(station).then((hourlyData) => {
        //     console.log('hourly data', hourlyData);
        // });
        // retrieveDailyData(station).then((dailyData) => {
        //     console.log('daily data', dailyData);
        // });
        await Promise.all(stationCreation);

        const dataCreation = await stations
            // .filter(station => {
            //     return station['Station ID'] === '14'
            //     // || station['Station ID'] === '15';
            // })
            .map(async station => {
                const monthlyDataList = await retrieveMonthlyData(station);
                const monthlyDataCreation = await monthlyDataList
                    .map(async monthlyData => {
                        console.log('creating monthly data: ', station['Station ID']);
                        await MonthlyRepository.create(monthlyData);
                        console.log('monthly data created: ', station['Station ID']);
                    });
                await Promise.all(monthlyDataCreation);
            });
        await Promise.all(dataCreation);

        console.log('FINISHED AT: ', new Date());

    } catch (e) {
        console.error(e);
    }
}

let promise = main();

async function downloadHourlyData(station) {
    console.log(`download hourly data from ${station['Station ID']} - ${station['Name']}`);
    try {
        const hourlyData = [];
        for (let year = station['HLY First Year']; year <= station['HLY Last Year']; year++) {
            for (let month = 1; month <= 12; month++) {
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
                    if (Object.keys(record).length > 9) {
                        console.log('[hourly] record - ', record['Date/Time']);
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

async function downloadDailyData(station) {
    console.log(`download daily data from ${station['Station ID']} - ${station['Name']}`);
    try {
        const dailyData = [];
        for (let year = station['DLY First Year']; year <= station['DLY Last Year']; year++) {
            let dailyDataUrl = `https://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID=${station['Station ID']}&Year=${year}&timeframe=2&submit=%20Download+Data`;
            const response = await axios.get(dailyDataUrl);
            const {data} = response;
            // console.log('data', data);
            const parser = Readable.from([data]).pipe(
                parse({
                    from_line: 1,
                    columns: true,
                    relax_column_count: true
                }));
            for await (const record of parser) {
                let count = 0;
                Object.entries(record).map(entry => {
                    if (entry[1] === '') {
                        //delete record[entry[0]];
                        count = count + 1;
                    }
                });
                if (Object.keys(record).length - count > 8) {
                    console.log('[daily] record - ', record['Date/Time']);
                    dailyData.push(record);
                }
            }
        }
        return dailyData;
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
        const monthlyData = [];
        let monthlyDataUrl = `https://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID=${station['Station ID']}&timeframe=3&submit=%20Download+Data`;
        const response = await axios.get(monthlyDataUrl);
        const {data} = response;
        console.log('data', data);
        const parser = Readable.from([data]).pipe(
            parse({
                from_line: 1,
                columns: true,
                relax_column_count: true
            }));
        for await (const record of parser) {
            let count = 0;
            Object.entries(record).map(entry => {
                if (entry[1] === '') {
                    //delete record[entry[0]];
                    count = count + 1;
                }
            });
            if (Object.keys(record).length - count > 7) {
                // console.log('[monthly] record - ', record['Date/Time']);
                monthlyData.push(record);
            }

        }
        return monthlyData;
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