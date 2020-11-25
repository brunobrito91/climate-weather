const axios = require('axios').default;
const parse = require('csv-parse');
const { Readable } = require("stream")

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
        const { data } = response;
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
        const { data } = response;
        const rawData = data.replace(')]}\'', '');
        const downloadData = JSON.parse(rawData);
        console.log('downloadData', downloadData);
        const { downloadUrl } = downloadData;
        return downloadUrl;
    } catch (e) {
        console.error(e);
    }
}

async function retrieveStationInventory() {
    try {
        const downloadUrl = await retrieveDownloadUrlForStationInventory()
        return await downloadStationInventory(downloadUrl);
    } catch (e) {
        console.error(e);
    }
}

try {
    retrieveStationInventory()
        .then((stations) => {
            console.log('stations', stations);
        }).catch((e) => {
        console.error(e);
    });
} catch (e) {
    console.error(e);
}