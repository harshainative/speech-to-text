const webpack = require('webpack');

module.exports = {
    resolve: {
    //   mainFields: ['browser', 'module', 'main'],
        fallback: { 
            "url": require.resolve("url/url.js"),
            // "util": require.resolve("util/"),
            // "net": require.resolve("net/"),
            // "tls": require.resolve("tls/"),
            // "assert": require.resolve("assert/"),
            // "querystring": require.resolve("querystring/"),
            // "stream": require.resolve("stream-browserify/"),
            // "https": require.resolve("https-browserify/"),
            // "http": require.resolve("stream-http/"),
            // "os": require.resolve("os-browserify/browser"),
            "path": require.resolve("path-browserify/"),
            // "crypto": require.resolve("crypto-browserify/"),
            "child_process": require.resolve("browser-builtins/builtin/child_process.js"),
            // "url": require.resolve("browser-builtins/builtin/url.js"),
            "process": require.resolve("browser-builtins/builtin/process.js"),
            // "vm": require.resolve("vm-browserify/"),
            // "fs": require.resolve("browser-builtins/builtin/fs.js"),
            // "readable-stream": require.resolve("readable-stream/"),
            // "buffer": require.resolve("buffer/"),
            // "zlib": require.resolve("browserify-zlib/"),
         },
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser'
        }),
        new webpack.ProvidePlugin({
            child_process: 'browser-builtins/builtin/child_process'
        })
        // new webpack.ProvidePlugin({
        //     Buffer: 'buffer/index.js', 
        // })
    ],


  
        
  };