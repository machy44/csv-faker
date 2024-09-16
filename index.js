const fs = require('fs');
const { faker } = require('@faker-js/faker');
const fastcsv = require('fast-csv');

// Define the headers
const headers = ['email', 'username', 'telephone', 'first name', 'last name', ];

// Define the approximate size target
const targetSizeMb = 10;
const targetSizeBytes = targetSizeMb * 1024 * 1024;

const filePath = 'fake_data_large.csv';
const batchSize = 10000;

let currentSize = 0;

const writeStream = fs.createWriteStream(filePath);
const csvStream = fastcsv.format({ headers: headers });

csvStream.pipe(writeStream).on('end', () => process.exit());

function generateBatch() {
    const rows = [];

    for (let i = 0; i < batchSize; i++) {
        rows.push([
            faker.internet.email(),
            faker.internet.userName(),
            faker.phone.number(),
            faker.name.firstName(),
            faker.name.lastName(),
        ]);
    }

    rows.forEach(row => csvStream.write(row));

    currentSize += Buffer.byteLength(rows.map(row => Object.values(row).join(',')).join('\n'), 'utf8');

    if (currentSize < targetSizeBytes) {
        setImmediate(generateBatch);
    } else {
        csvStream.end();
    }
}

// Start generating the data
generateBatch();