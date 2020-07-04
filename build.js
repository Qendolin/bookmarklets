const fs = require('fs');
const bookmarkleter = require('bookmarkleter');

const genBookmarkFile = (filename, names, urls, prefix) =>
	`<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>${filename}</TITLE>
<H1>${filename}</H1>
<DL><p>${
		prefix
			? `
    <DT><H3>${prefix}</H3>
    <DL><p>
${names.map((name, i) => `        <DT><A HREF="${urls[i]}">${prefix}: ${name}</A>`).join(`\r\n`)}
    </DL><p>`
			: `
${names.map((name, i) => `    <DT><A HREF="${urls[i]}">${name}</A>`).join(`\r\n`)}`
	}
</DL><p>`;

const argv = require('minimist')(process.argv.slice(2));

let prefix = argv.prefix || argv.p || 'Utils';
if (prefix === true) prefix = '';
let names = [];
let urls = [];

console.log('Prefix: %s', prefix);

fs.readdirSync('./src/')
	.filter((file) => file.endsWith('.js') && file != 'build.js')
	.forEach((file) => {
		console.log('Processing %s', file);
		let src = fs.readFileSync('./src/' + file, { encoding: 'utf-8' });
		let dst = bookmarkleter(src, {
			iife: true,
			minify: true,
		});
		let name = file.replace('.js', '');
		let firstLine = src.split(/\r?\n/).find((line) => /\S/.test(line));
		if (firstLine && /\s*\/\/\s*name:.*/.test(firstLine)) {
			name = firstLine.match(/\s*\/\/\s*name:(.*)/)[1];
		}
		name = name.trim();
		fs.writeFileSync(`./out/${name}.url`, `[InternetShortcut]\r\nURL=${dst}`);
		fs.writeFileSync(`./out/${name}.txt`, dst);
		fs.writeFileSync(`./out/${name}.html`, genBookmarkFile(name, [name], [dst], prefix));
		names.push(name);
		urls.push(dst);
	});

fs.writeFileSync('./out/.html', genBookmarkFile('Index', names, urls, prefix));
