const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const PurgeCSSPlugin = require("purgecss-webpack-plugin");

module.exports = {
    module: {
        rules: [
            {
                test: /.js$/,
                use: [
                    <%if (webpack['thread-loader']) {%>{
                        loader: "thread-loader",
                        options: {
                            workers: 3,
                        },
                    },<%}%>
                    "babel-loader?cacheDirectory=true",
                ],
                exclude: /node_modules/,
            },
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    <%if (webpack['postcss-loader']) {%>{
                        loader: 'postcss-loader',
                    }<%}%>
                ],
            },
            <%if (webpack['less-loader']) {%>{
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    <%if (webpack['postcss-loader']) {%>{
                        loader: 'postcss-loader',
                    }<%}%>
                ],
            },<%}%>
            <%if (webpack['file-loader']) {%>{
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                        },
                    },
                ],
            },<%}%>
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            <%if (webpack['css-minimizer-webpack-plugin']) {%>
            new CssMinimizerPlugin({
                parallel: true,
                cache: true,
            }),<%}%>
            <%if (webpack['terser-webpack-plugin']) {%>
            new TerserPlugin({
                parallel: true // 默认值：2*cpu -1
                // parallel: 4,
                terserOptions: {
                    ecma: 5,
                    parse: {},
                    compress: {},
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    module: false,
                    // Deprecated
                    output: null,
                    format: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: true,
                    safari10: true,
                },
            }),<%}%>
        ],
        <%if (webpack['split-chunks-plugin']) {%>
        splitChunks: {
            // include all types of chunks
            chunks: 'all'
        },<%}%>
    },
    plugins: [
        new CleanWebpackPlugin(),
        <%if (webpack['mini-css-extract-plugin']) {%>
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        <%}%>
        <%if (webpack['purgecss-webpack-plugin']) {%>
        new PurgeCSSPlugin(),
        <%}%>
        new HardSourceWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    stats: 'errors-only',
};