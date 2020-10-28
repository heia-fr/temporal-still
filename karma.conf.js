module.exports = function(config) {
	config.set({
		basePath: '.',
		files: [
			// Bower libraries
			'bower_components/random/lib/random.min.js',
			'bower_components/lodash/lodash.min.js',

			// App files
			'js/models/helpers/*.js',
			'js/models/analysers/Lexer.js',
			'js/models/operators/Operator.js',
			'js/models/operators/TemporalOperator.js',
			'js/models/**/*.js',

			// Tests files
			'test/**/*.js',
		],
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
		]
	});
};
