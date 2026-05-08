#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const pluginsDir = path.join(__dirname, '..', '.claude', 'plugins');

if (!fs.existsSync(pluginsDir)) {
    console.error('Plugin directory not found:', pluginsDir);
    process.exit(1);
}

const files = fs
    .readdirSync(pluginsDir)
    .filter((f) => f.endsWith('.md'))
    .sort();

if (files.length === 0) {
    console.log('No plugins found.');
    process.exit(0);
}

const plugins = files.map((file) => {
    const name = file.replace('.md', '');
    const content = fs.readFileSync(path.join(pluginsDir, file), 'utf8');
    const lines = content.split('\n');

    const titleLine = lines.find((l) => l.startsWith('# '));
    const descLine = lines.find(
        (l, i) => i > 0 && l.trim().length > 0 && !l.startsWith('#'),
    );

    return {
        name,
        title: titleLine ? titleLine.replace('# ', '').replace(' Plugin', '') : name,
        description: descLine ? descLine.trim() : '',
    };
});

const colName = Math.max(...plugins.map((p) => p.name.length), 6) + 2;
const colTitle = Math.max(...plugins.map((p) => p.title.length), 5) + 2;

console.log('\nAvailable plugins:\n');
console.log(
    'Plugin'.padEnd(colName) +
        'Name'.padEnd(colTitle) +
        'Description',
);
console.log('-'.repeat(colName + colTitle + 55));

for (const plugin of plugins) {
    const desc =
        plugin.description.length > 55
            ? plugin.description.slice(0, 52) + '...'
            : plugin.description;
    console.log(
        plugin.name.padEnd(colName) +
            plugin.title.padEnd(colTitle) +
            desc,
    );
}

console.log(
    `\n${plugins.length} plugin(s) available.\n`,
);
console.log('To add a plugin, run this in your Claude Code session:');
console.log('  /add-plugin <name>\n');
console.log('Example:');
console.log('  /add-plugin temporal');
console.log('  /add-plugin aws-s3');
console.log('  /add-plugin stripe\n');
