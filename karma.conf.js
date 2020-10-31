var webpackConfig = require("./webpack.config");

module.exports = function(config) {
	config.set({
		basePath: '.',
		files: [
			'test/**/*.js',
		],
		preprocessors: {
			'js/**/*.js': ['webpack'],
			'test/**/*.js': ['webpack'],
		},
		autoWatch: true,
		frameworks: [
			'jasmine',
		],
		browsers: [
			'PhantomJS',
		],
		plugins: [
			'karma-phantomjs-launcher',
			'karma-jasmine',
			'karma-webpack',
		],
		webpack: {
			mode: 'production',
			//devtool: 'inline-source-map',
			module: webpackConfig.module
		},
	});
};
