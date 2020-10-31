const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
	filename: "bundle.css",
	disable: process.env.NODE_ENV === "development"
});

module.exports = {
	entry: [
		"./js/main.js",
		"./css/main.scss",
	],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
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
			{ test: /\.tsx?$/, loader: "ts-loader" },
			{
				test: /\.scss$/,
				use: extractSass.extract({
					use: [{
						loader: "css-loader"
					}, {
						loader: "sass-loader"
					}],
					fallback: "style-loader"
				})
			}
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		extractSass,
	]
};
