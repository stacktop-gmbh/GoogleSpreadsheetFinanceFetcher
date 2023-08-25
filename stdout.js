const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

const SPREADSHEET_URL = process.env.SPREADSHEET_URL;

class SpreadsheetFetcher {

    async fetch() {
        if (!SPREADSHEET_URL) {
            throw new Error("SPREADSHEET_URL environment variable not set.");
        }

        const csvData = await this._fetchCSV();
        return this._parseCSV(csvData);
    }

    async _fetchCSV() {
        try {
            const response = await axios.get(SPREADSHEET_URL);
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching spreadsheet data: ${error}`);
        }
    }

    _parseCSV(csvData) {
        return new Promise((resolve, reject) => {
            const results = [];
            const stream = Readable.from(csvData);
            
            stream.pipe(csv())
                .on('data', (row) => results.push(row))
                .on('end', () => resolve(this._reformatData(results)))
                .on('error', (error) => reject(error));
        });
    }

    _reformatData(data) {
        const supportedCurrencies = [];

        const reformattedData = data.reduce((acc, item) => {
            const key = item[''];
            delete item[''];

            // Pushing keys of item to supportedCurrencies array.
            for (let currency in item) {
                if (!supportedCurrencies.includes(currency)) {
                    supportedCurrencies.push(currency);
                }
            }

            acc[key] = item;
            return acc;
        }, {});

        reformattedData.SUPPORTED = supportedCurrencies;
        return reformattedData;
    }
}

(async () => {
    const fetcher = new SpreadsheetFetcher();
    try {
        const data = await fetcher.fetch();
        console.log(data);
    } catch (error) {
        console.error(error.message);
    }
})();
