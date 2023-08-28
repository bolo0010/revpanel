const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { EsbuildPlugin } = require('esbuild-loader')
const path = require('path');
require('autoprefixer');

//check mode
const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';
const isDevServer = !!process.argv[process.argv.indexOf('serve')];

//plugins
const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'),
        favicon: "../favicon.png",
        filename: 'index.html',
        inject: 'body'
    }),
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
    })
];

//config
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isDevServer ? 'index.js' : '[name].[contenthash].js',
        chunkFilename: '[id].js',
        assetModuleFilename: 'images/[hash][ext][query]',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        historyApiFallback: true,
        client: {
            reconnect: true,
            progress: true
        },
        proxy: {
            '/api/**': {
                target: 'http://localhost:5000',
                secure: false,
                changeOrigin: true,
                headers: {
                    Connection: 'keep-alive',
                    Accept: "application/json"
                },
                proxyTimeout: 1000 * 60 * 10,
                timeout: 1000 * 60 * 10,
            }
        }
    },
    optimization: {
        minimizer: [
            new EsbuildPlugin({
                target: 'es2015'
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                loader: 'esbuild-loader',
                options: {
                    loader: 'jsx',
                    target: 'es2015'
                }
            },
            {
                test: /\.(jpe?g|png|webp|gif|woff|woff2|otf|eot|ttf|svg|ico)(\?[a-z0-9=.]+)?$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024
                    }
                }
            },
            {
                test: /\.css$/,
                use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [['autoprefixer', {}]]
                            }
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    },
    plugins
};
