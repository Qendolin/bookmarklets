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

const genIndexFile = (names, files) => {
	let content = '# Bookmarklets\r\n\r\n';
	for (let i = 0; i < names.length; i++) {
		const name = names[i];
		content += ` - [${name}](https://github.com/Qendolin/bookmarklets/blob/master/src/${files[i]})\r\n`;
		content += `   - [code](./out/${name.replaceAll(' ', '%20')}.txt)\r\n`;
		const link = `javascript:fetch('https://raw.githubusercontent.com/Qendolin/bookmarklets/master/src/${files[i]}').then(async (resp) => eval(await resp.text()))`;
		content += `   - \`${link}\`\r\n`;
	}
	return content;
};

const argv = require('minimist')(process.argv.slice(2));

let prefix = argv.prefix || argv.p || 'Utils';
if (prefix === true) prefix = '';
const dstFiles = [];
const urls = [];
const srcFiles = [];

console.log('Prefix: %s', prefix);

fs.readdirSync('./src/')
	.filter((file) => file.endsWith('.js') && file != 'build.js')
	.forEach((file) => {
		console.log('Processing %s', file);
		srcFiles.push(file);
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
		dstFiles.push(name);
		urls.push(dst);
	});

fs.writeFileSync('./out/.html', genBookmarkFile('Index', dstFiles, urls, prefix));
fs.writeFileSync('./INDEX.md', genIndexFile(dstFiles, srcFiles, urls));
