const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
const isProduction = mode === "production";

var webpackConfig = {
	mode: mode,
	entry: [
		"./js/main.js",
		"./css/main.scss",
	],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
		chunkFilename: "[name].[id].js"
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
		rules: [
			{
				test: /\.m?js$/,
				//exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [["@babel/preset-env", { targets: "defaults" }]]
					}
				},
			},
			{
				test: /\.tsx?$/,
				loader: "ts-loader"
			},
			{
				test: /\.(css|sass|scss)$/,
				use: [
					//isProduction ? MiniCssExtractPlugin.loader : "style-loader",
					MiniCssExtractPlugin.loader,
					{ loader: "css-loader", options: { sourceMap: true } },
					{ loader: "sass-loader", options: { sourceMap: true } },
				]
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css"
		}),
	],
	optimization: {
		minimize: false,
	},
	devtool: isProduction ? false: "source-map",
};

if (isProduction) {
	// Override TerserPlugin config in production mode
	webpackConfig.plugins.push(new TerserPlugin({
		terserOptions: {
			mangle: false,
		},
	}));
}

module.exports = webpackConfig;
