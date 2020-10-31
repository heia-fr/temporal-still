module.exports = function(config) {
	config.set({
		basePath: '.',
		files: [
			// Bower libraries
			'bower_components/random/lib/random.min.js',
			'bower_components/lodash/lodash.min.js',

			// Tests files
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
		]
	});
};
