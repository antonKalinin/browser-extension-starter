const path = require('path');

module.exports = {
    devtool: 'eval',
    entry: {
        page: path.join(__dirname, '/app/content/page.js'),
        background: path.join(__dirname, '/app/background/background.js'),
        manager: path.join(__dirname, '/app/content/manager/Manager.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css?modules&localIdentName=[name]__[local]_[hash:base64:3]'
            },
            {
                test: /\.jsx?$/,
                loader: 'babel',
                query:
                {
                    presets: ['react']
                },
                exclude: /node_modules/,
                include: __dirname
            }
        ]
    }
};
