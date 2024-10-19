const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "main.[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: 'assets/img/[name][hash][ext]',
        clean: true
    },
    devServer: {
        host: '0.0.0.0',
        // disableHostCheck: true, // Disables host header checking
        allowedHosts: 'all', // Allows all hosts (optional but more secure than disabling host check)
    },
    module: {
        rules:[
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(svg|png|jpe?g|gif)$/i,
                type: "asset/resource"
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.json$/,
                type: 'json',
            },
            // {
            //     test: /\.(mp3|wav)$/i,
            //     type: "asset/resource"
            // },
            {
                test: /\.(mp3|wav|ogg)$/, // Match audio files
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]', // Configure output file naming
                            outputPath: 'audio/', // Output directory for audio files
                            publicPath: 'audio/' // Public path used in the generated bundle
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: './src/template.html'
      }),]
}