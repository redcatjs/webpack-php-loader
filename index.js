/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Jo <jo@redcat.ninja> https://github.com/surikat/
	inspired by https://www.npmjs.com/package/php-loader by Tobias Koppers @sokra
*/

const glob = require('glob');
const util = require('util');
const loaderUtils = require('loader-utils');
const exec = util.promisify(require('child_process').exec);
const shellescape = require('shell-escape');
	
module.exports = function(content){
	
	let self = this;
	
	// Hold the name of the file to be executed (a resource in webpack terminology)
	let resource = this.resource;

	// The directory where the original file was run. This is necessary
	// if the php script use the __DIR__ variable, wich refer to the original file.
	// So if the file is runned "inline", we need to change path into that path so that
	// __DIR__ point to the correct location.
	let cwd = this.context;
	
	let query = ( typeof this.query === 'string'  ? loaderUtils.parseQuery(this.query || '?') : this.query ) || {};

	let options = Object.assign({
		proxyScript: null
	}, query);


	let args = [ ];
	if (options.proxy) {
		this.addDependency(options.proxy);
		args.push(options.proxy);
	}

	this.addDependency(resource);
	args.push(resource);

	if (options.args) {
		args = args.concat(options.args);
	}

	let callback = this.async();
	let debug = options.debug;
	let cmd = `php -r 'require $argv[1]; echo PHP_EOL, json_encode(get_included_files());' ${shellescape(args)}`;
	async function runPhp() {
		if(debug){
			console.log(cmd);
		}
		try{
			let {stdout, stderr} = await exec(cmd);
			if(debug){
				console.log('stdout:', stdout);
				console.log('stderr:', stderr);
			}

			if(stderr){
				self.emitError(stderr);
				callback(stderr);
			}else{
				// Split out last line which contains list of included files and add them as Webpack dependencies
				const includedSeparator = stdout.lastIndexOf('\n');
				const dependencies = stdout.slice(includedSeparator);
				stdout = stdout.slice(0, includedSeparator);

				JSON.parse(dependencies).forEach(function(dependency) {
					self.addDependency(dependency)
				});

				callback(null, stdout);
			}
		}catch(e){
			callback(e);
		}
	}
	runPhp();

};

module.exports.raw = true;
