const express = require('express');
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
        return data.reduce((acc, item) => {
            const key = item[''];
            delete item[''];
            acc[key] = item;
            return acc;
        }, {});
    }
}

const app = express();
const port = 3000;
const fetcher = new SpreadsheetFetcher();

app.get('/fetch', async (req, res) => {
    try {
        const data = await fetcher.fetch();
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
