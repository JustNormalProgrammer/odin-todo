const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
module.exports = {
    mode: 'development',
    entry: './todo-frontend/src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'todo-frontend/dist'),
        clean: true,
    },
    devtool: "eval-source-map",
    devServer: {
        watchFiles: ["./todo-frontend/src/template.html"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './todo-frontend/src/template.html',
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            }, 
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    optimization: {
        minimizer: [
          new CssMinimizerPlugin(),
        ],
        minimize: true,
      },
};