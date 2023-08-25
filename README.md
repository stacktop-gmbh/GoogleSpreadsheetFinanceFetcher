# GoogleSpreadsheetFinanceFetcher

A Node.js script to fetch financial data from a Google Spreadsheet. Whether you want to manually enter data or dynamically fetch it using Google's Finance formula, this tool makes it easy to fetch and use that data in your applications.

Sure! Here's the disclaimer, along with a sample JSON output:

---

**Disclaimer:**

- Using Google Spreadsheets for data extraction and automation purposes requires compliance with Google's terms and conditions. Users are responsible for ensuring that their use cases align with Google's policies.
  
- This project serves only as a reference or orientation for how to retrieve data from a Google Spreadsheet and is not maintained regularly. 

- There are two JS versions provided. If running the script in standalone mode, the Express package is not required.

---

**Sample JSON Output:**

```json
{
  "EUR": {
    "EUR": "1",
    "USD": "0.92623",
    "PEN": "0.2509606291",
    "GBP": "1.165697504",
    "CLP": "0.0010929514"
  },
  "USD": {
    "EUR": "1.07965",
    "USD": "1",
    "PEN": "0.2709485",
    "GBP": "1.25854",
    "CLP": "0.00118"
  },
  "PEN": {
    "EUR": "3.986307482",
    "USD": "3.692222",
    "PEN": "1",
    "GBP": "4.646809075",
    "CLP": "0.00435682196"
  },
  "GBP": {
    "EUR": "0.8578628987",
    "USD": "0.79461",
    "PEN": "0.2152142",
    "GBP": "1",
    "CLP": "0.0009396948"
  },
  "CLP": {
    "EUR": "912.908854",
    "USD": "845.56",
    "PEN": "229.1032136",
    "GBP": "1064.171082",
    "CLP": "1"
  }
}
```

Remember, the exact values in the JSON output are based on the spreadsheet you provide, and the actual values might differ based on the Google Spreadsheet data and currency conversion rates at a given time.

## Setup:

1. **Prepare Your Google Spreadsheet**:

    - Fill in your financial data in your Google Spreadsheet.
    - Click on File > Publish to the web.
    - Choose the sheet you want to share.
    - Select CSV format.
    - Click Publish.
    - Copy the provided link for the next step.

2. **Environment Configuration**:

    - Set the environment variable `SPREADSHEET_URL` to the link you just copied. Alternatively, you can also override the `SPREADSHEET_URL` directly in the code.

## Sample Spreadsheet Data:

Here's how your spreadsheet might look if you manually input some financial data:

|     | A   | B     | C     | D           | E           | F           |
|-----|-----|-------|-------|-------------|-------------|-------------|
| 1   |     | EUR   | USD   | PEN         | GBP         | CLP         |
| 2   | EUR | 1     | 0.9253| 0.250708647 | 1.165170145 | 0.001091854 |
| 3   | USD | 1.08095 | 1   | 0.2709485   | 1.259235    | 0.00118     |
| 4   | PEN | 3.99110737 | 3.692222 | 1 | 4.649283     | 0.00435682196 |
| 5   | GBP | 0.858425633 | 0.79414 | 0.2151710417 | 1 | 0.0009370852 |
| 6   | CLP | 915.197127 | 846.66 | 229.401257 | 1066.123 | 1           |

## Dynamic Data with Google Finance:

Instead of manually entering your data, you can use Google Finance formulas to automatically fetch current data:

|     | EUR                           | USD                           | PEN                           | GBP                           | CLP                           |
|-----|-------------------------------|-------------------------------|-------------------------------|-------------------------------|-------------------------------|
| EUR | 1                             | `= GOOGLEFINANCE("USD-EUR")`  | `= GOOGLEFINANCE("PEN-EUR")`  | `= GOOGLEFINANCE("GBP-EUR")`  | `= GOOGLEFINANCE("CLP-EUR")`  |
| USD | `= GOOGLEFINANCE("EUR-USD")`  | 1                             | `= GOOGLEFINANCE("PEN-USD")`  | `= GOOGLEFINANCE("GBP-USD")`  | `= GOOGLEFINANCE("CLP-USD")`  |
| PEN | `= GOOGLEFINANCE("EUR-PEN")`  | `= GOOGLEFINANCE("USD-PEN")`  | 1                             | `= GOOGLEFINANCE("GBP-PEN")`  | `= GOOGLEFINANCE("CLP-PEN")`  |
| GBP | `= GOOGLEFINANCE("EUR-GBP")`  | `= GOOGLEFINANCE("USD-GBP")`  | `= GOOGLEFINANCE("PEN-GBP")`  | 1                             | `= GOOGLEFINANCE("CLP-GBP")`  |
| CLP | `= GOOGLEFINANCE("EUR-CLP")`  | `= GOOGLEFINANCE("USD-CLP")`  | `= GOOGLEFINANCE("PEN-CLP")`  | `= GOOGLEFINANCE("GBP-CLP")`  | 1                             |
const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

async function fetchSpreadsheetData() {
    const SPREADSHEET_URL = process.env.SPREADSHEET_URL;

    if (!SPREADSHEET_URL) {
        console.error("Error: SPREADSHEET_URL environment variable not set.");
        return;
    }

    try {
        const response = await axios.get(SPREADSHEET_URL);
        const csvData = response.data;

        const results = [];
        const stream = Readable.from(csvData);
        
        stream.pipe(csv())
            .on('data', (row) => results.push(row))
            .on('end', () => {
                const reformattedData = reformatData(results);
                console.log(reformattedData);
            });

    } catch (error) {
        console.error("Error fetching spreadsheet data:", error);
    }
}

function reformatData(data) {
    const reformattedData = {};

    data.forEach(item => {
        const key = item[''];
        delete item['']; // Remove the empty key
        reformattedData[key] = item;
    });

    return reformattedData;
}

fetchSpreadsheetData();

## How to Run

You can run the `GoogleSpreadsheetFinanceFetcher` in two ways: as a standalone script that outputs to stdout or as an Express app.

### As Standalone Script (stdout)

1. Ensure you have set the `SPREADSHEET_URL` environment variable to the URL of your published Google Spreadsheet in CSV format.

2. Run the script:

```bash
SPREADSHEET_URL='https://docs.google.com/spreadsheets/d/e.......' node stdout.js
```bash

### As Express App (server)

1. Ensure you have set the `SPREADSHEET_URL` environment variable to the URL of your published Google Spreadsheet in CSV format.

2. Run the script:

```bash
SPREADSHEET_URL='https://docs.google.com/spreadsheets/d/e.......' node server.js
```bash