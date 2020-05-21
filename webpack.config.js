var path = require('path');

module.exports = {
    entry: {
        bundle: path.resolve(__dirname, './src/index.js'),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },                       
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
    },    
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true
    },    
    devtool: 'source-map',    
}    