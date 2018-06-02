var root = process.argv[2] || 'D:\\liangxiao\\www\\focus-server\\ecology-admin';
var publishRoot = process.argv[3];
var buildCmd = 'npm run build';


var path = require('path');
var fs = require('fs');
//var root = __dirname;
var child_process = require('child_process');
require('shelljs/global');



var configOrigin = fs.readFileSync(`${root}/public/webpack.config.js`, 'utf8');
sed('-i', '"debug": true,', '"debug": false,', `${root}/public/webpack.config.js`);
sed('-i', "publicPath = './'", 'publicPath = "PUBLIC-PATH"', `${root}/public/webpack.config.js`);
var log = child_process.execSync(`cd ${root}  && ${buildCmd}`);
process.stdout.write(log);
fs.writeFileSync(`${root}/public/webpack.config.js`, configOrigin, 'utf8');

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
entry = entry.replace('"PUBLIC-PATH"', 'window.domainRes');
fs.writeFileSync(`${root}/dist/${entryFile}`, entry, 'utf8');

// sed('-i', '"PUBLIC-PATH"', 'window.domainRes', `${root}/dist/app.*.js`);
console.log('build success.')


rm('-rf', `${publishRoot}/res/ecology-ad-admin`);
cp('-rf', `${root}/dist`, `${publishRoot}/res/ecology-ad-admin`);
// dev
mkdir('-p', `${publishRoot}/ds-conf/dev/code/ecology-ad-admin`);
cp('-rf', `${root}/dist/index.html`, `${publishRoot}/ds-conf/dev/code/ecology-ad-admin/index.html`);
sed('-i', 'window\.env.*;', 'window.env = \'-dev\';', `${publishRoot}/ds-conf/dev/code/ecology-ad-admin/index.html`);
sed('-i', /window\.domainRes.*;/, 'window.domainRes = \'//focus-res-dev.cn/ecology-admin-adv/ecology-ad-admin/\';', `${publishRoot}/ds-conf/dev/code/ecology-ad-admin/index.html`);
sed('-i', /PUBLIC-PATH/g, '//focus-res-dev.cn/ecology-admin-adv/ecology-ad-admin', `${publishRoot}/ds-conf/dev/code/ecology-ad-admin/index.html`);
// test
mkdir('-p', `${publishRoot}/ds-conf/test/code/ecology-ad-admin`);
cp('-rf', `${root}/dist/index.html`, `${publishRoot}/ds-conf/test/code/ecology-ad-admin/index.html`);
sed('-i', 'window\.env.*;', 'window.env = \'-test\';', `${publishRoot}/ds-conf/test/code/ecology-ad-admin/index.html`);
sed('-i', /window\.domainRes.*;/, 'window.domainRes = \'//focus-res-test.cn/ecology-admin-adv/ecology-ad-admin/\';', `${publishRoot}/ds-conf/test/code/ecology-ad-admin/index.html`);
sed('-i', /PUBLIC-PATH/g, '//focus-res-test.cn/ecology-admin-adv/ecology-ad-admin', `${publishRoot}/ds-conf/test/code/ecology-ad-admin/index.html`);
// work
mkdir('-p', `${publishRoot}/ds-conf/work/code/ecology-ad-admin`);
cp('-rf', `${root}/dist/index.html`, `${publishRoot}/ds-conf/work/code/ecology-ad-admin/index.html`);
sed('-i', 'window\.env.*;', 'window.env = \'\';', `${publishRoot}/ds-conf/work/code/ecology-ad-admin/index.html`);
sed('-i', /window\.domainRes.*;/, 'window.domainRes = \'//t-res.51f.com/ecology-admin-adv/ecology-ad-admin/\';', `${publishRoot}/ds-conf/work/code/ecology-ad-admin/index.html`);
sed('-i', /PUBLIC-PATH/g, '//t-res.51f.com/ecology-admin-adv/ecology-ad-admin', `${publishRoot}/ds-conf/work/code/ecology-ad-admin/index.html`);
console.log('copy success.')
