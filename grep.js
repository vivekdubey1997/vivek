const fs = require('fs');
const yargs = require('yargs');

const argv = yargs
    .usage('Usage: node $0 [options] <pattern>')
    .demandCommand(1)
    .boolean('keys')
    .describe('keys', 'Search only in keys of the JSON object')
    .boolean('values')
    .describe('values', 'Search only in values of the JSON object')
    .help('h')
    .alias('h', 'help')
    .argv;

const pattern = new RegExp(argv._[0], 'i');

fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${grep.JSON}`);
        process.exit(1);
    }

    const lines = data.trim().split('\n');
    let matches = 0;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        try {
            const obj = JSON.parse(line);

            if (argv.keys && searchKeys(obj)) {
                matches++;
            } else if (argv.values && searchValues(obj)) {
                matches++;
            } else if (!argv.keys && !argv.values && searchAll(obj)) {
                matches++;
            } else {
                console.log(line);
            }
        } catch (e) {
            // Ignore lines containing invalid JSON
            continue;
        }
    }

    console.log(matches);
});

function searchKeys(obj) {
    for (let key in obj) {
        if (pattern.test(key)) {
            return true;
        }
    }

    return false;
}

function searchValues(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            if (searchValues(obj[key])) {
                return true;
            }
        } else {
            if (pattern.test(obj[key])) {
                return true;
            }
        }
    }

    return false;
}

function searchAll(obj) {
    return searchKeys(obj) || searchValues(obj);
}