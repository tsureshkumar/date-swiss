const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const packageJson = require("./package.json");

const isDev = process.env.NODE_ENV === "development";

function transformManifestFile(payload) {
    let p = JSON.parse(payload);
    return JSON.stringify(p);
}

module.exports = {
    mode: isDev ? "development" : "production",
    entry: {
        polyfill: "@babel/polyfill", // enables async-await
        popup: "./src/popup.js",
        options: "./src/options.js",
        background: "./src/background.js",
        content: "./src/content.js",
    },
    output: {
        filename: "js/[name].js", // relative to the outputPath (defaults to / or root of the site)
        library: "date_swiss",
    },
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [{ loader: "babel-loader" }, { loader: "ts-loader" }],
            },
            {
                test: /\.(js|mjs|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    plugins: [
        new webpack.WatchIgnorePlugin({ paths: [/css\.d\.ts$/] }),
        new webpack.DefinePlugin({
            RELEASE_VERSION: JSON.stringify(packageJson.version),
            BUILD_NUMBER: JSON.stringify(packageJson.build_number),
        }),
        new HtmlWebpackPlugin({
            filename: "popup.html",
            template: "src/extension/popup.html",
            chunks: ["popup"],
        }),
        new HtmlWebpackPlugin({
            filename: "options.html",
            template: "src/extension/options.html",
            chunks: ["options"],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "src/manifest-firefox.json",
                    from: "scripts/*.js",
                },
            ],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "src/manifest.json",
                },
            ],
        }),
    ],
    devServer: {
        /* headers: {
		'Content-Security-Policy': "script-src 'self' * 'unsafe-inline' 'unsafe-eval'; connect-src 'self' *; "
	},
    */
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, "./public"),
        watchContentBase: true, // initiate a page refresh if static content changes
        overlay: {
            // Shows a full-screen overlay in the browser when there are compiler errors or warnings
            warnings: false, // defaults to false
            errors: false, // defaults to false
        },
    },
};
