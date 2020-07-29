const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const distPath = path.resolve(__dirname, 'dist');

module.exports = {
    context: __dirname,
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(jpg|png)$/,
                loader: 'file',
                query: {
                    name: '/[myAssetPath]/[name].[ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './src/assets',
    },
    plugins: [
        new CleanWebpackPlugin(['dist'],{}),
        new HtmlWebpackPlugin({
            template: 'src/assets/template.html'
        }),
        new ExtractTextPlugin("./src/styles.css"),
    ],
    output: {
        filename: '[name].bundle.js',
        path: distPath
    }
};
