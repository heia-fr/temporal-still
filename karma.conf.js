module.exports = function (config) {
	config.set({
		basePath: '.',
		client: {
			clearContext: false
		},
		coverageIstanbulReporter: {
			dir: require('path').join(__dirname, './coverage/temporal-still'),
			reports: [
				'html',
				'lcovonly',
				'text-summary',
			],
			fixWebpackSourcePaths: true
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
			require('karma-coverage-istanbul-reporter'),
			require('@angular-devkit/build-angular/plugins/karma')
		],
	});
};
