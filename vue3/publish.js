var root = process.argv[2];
var publishRoot = process.argv[3];
var buildCmd = 'npm run build';


var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
require('shelljs/global');



var configOrigin = fs.readFileSync(`${root}/webpack.config.js`, 'utf8');
// 替换 原字符 现字符 目录
sed('-i', '"debug": true,', '"debug": false,', `${root}/webpack.config.js`);
sed('-i', "publicPath = './'", 'publicPath = "PUBLIC-PATH"', `${root}/webpack.config.js`);
var log = child_process.execSync(`cd ${root} && ${buildCmd}`);
// 一个指向标准输出流(stdout)的 可写的流(Writable Stream)：
process.stdout.write(log);
fs.writeFileSync(`${root}/webpack.config.js`, configOrigin, 'utf8');

// 返回一个指定目录下所有文件名称的数组对象
var list = fs.readdirSync(`${root}/dist/`);
var entryFile;
for (let fileName of list) {
	if (/^app\..*js$/.test(fileName)) {
		entryFile = fileName;
		break;
	}
}
console.log(`Main entry file: ${entryFile}`);

var entry = fs.readFileSync(`${root}/dist/${entryFile}`, 'utf8');
entry = entry.replace('"PUBLIC-PATH"', 'window.domainRes');  // window.domainRes = './'
fs.writeFileSync(`${root}/dist/${entryFile}`, entry, 'utf8');

console.log('build success.')

rm('-rf', `${publishRoot}/res/intervention`);
cp('-rf', `${root}/dist`, `${publishRoot}/res/intervention`);

// dev
mkdir('-p', `${publishRoot}/ds-conf/dev/code/intervention`);
cp('-rf', `${root}/dist/index.html`, `${publishRoot}/ds-conf/dev/code/intervention/index.html`);
sed('-i', 'window\.env.*;', 'window.env = \'-dev\';', `${publishRoot}/ds-conf/dev/code/intervention/index.html`);
sed('-i', /window\.domainRes.*;/, 'window.domainRes = \'//focus-res-dev/rec-engine-intervention/intervention/\';', `${publishRoot}/ds-conf/dev/code/intervention/index.html`);
sed('-i', /PUBLIC-PATH/g, '//focus-res-dev/rec-engine-intervention/intervention', `${publishRoot}/ds-conf/dev/code/intervention/index.html`);
// test
mkdir('-p', `${publishRoot}/ds-conf/test/code/intervention`);
cp('-rf', `${root}/dist/index.html`, `${publishRoot}/ds-conf/test/code/intervention/index.html`);
sed('-i', 'window\.env.*;', 'window.env = \'-test\';', `${publishRoot}/ds-conf/test/code/intervention/index.html`);
sed('-i', /window\.domainRes.*;/, 'window.domainRes = \'//focus-res-test/rec-engine-intervention/intervention/\';', `${publishRoot}/ds-conf/test/code/intervention/index.html`);
sed('-i', /PUBLIC-PATH/g, '//focus-res-test/rec-engine-intervention/intervention', `${publishRoot}/ds-conf/test/code/intervention/index.html`);
// work
mkdir('-p', `${publishRoot}/ds-conf/work/code/intervention`);
cp('-rf', `${root}/dist/index.html`, `${publishRoot}/ds-conf/work/code/intervention/index.html`);
sed('-i', 'window\.env.*;', 'window.env = \'\';', `${publishRoot}/ds-conf/work/code/intervention/index.html`);
sed('-i', /window\.domainRes.*;/, 'window.domainRes = \'//t-res.51f.com/rec-engine-intervention/intervention/\';', `${publishRoot}/ds-conf/work/code/intervention/index.html`);
sed('-i', /PUBLIC-PATH/g, '//t-res.51f.com/rec-engine-intervention/intervention', `${publishRoot}/ds-conf/work/code/intervention/index.html`);
console.log('copy success.')
