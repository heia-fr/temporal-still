// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
	config.set({
		basePath: '.',
		client: {
			clearContext: false
		},
		jasmineHtmlReporter: {
			suppressAll: true,
		},
		coverageReporter: {
			dir: require('path').join(__dirname, './coverage/temporal-still'),
			subdir: '.',
			reporters: [
				{ type: 'html' },
				{ type: 'lcovonly' },
				{ type: 'text-summary' },
			]
		},
		reporters: [
			'progress',
			'kjhtml',
		],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		singleRun: false,
		restartOnFileChange: true,
		autoWatch: true,
		frameworks: [
			'jasmine',
			'@angular-devkit/build-angular',
		],
		browsers: [
			'PhantomJS',
			//'Chromium',
			//'Chrome',
			//'Firefox',
		],
		plugins: [
			require('karma-jasmine'),
			require('karma-phantomjs-launcher'),
			require('karma-firefox-launcher'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-coverage'),
			require('@angular-devkit/build-angular/plugins/karma')
		],
	});
};
