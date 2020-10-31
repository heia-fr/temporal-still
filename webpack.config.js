var webpack = require('webpack');

module.exports = {
	entry: "./js/main.js",
	output: {
		filename: "./dist/bundle.js"
	},
	resolve: {
		extensions: [
			".webpack.js",
			".web.js",
			".ts",
			".tsx",
			".js"
		]
	},
	module: {
		loaders: [
			{ test: /\.tsx?$/, loader: "ts-loader" }
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})
	]
};
