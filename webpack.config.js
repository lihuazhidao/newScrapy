var webpack=require("webpack");
module.exports = {
  entry:'./app.js',
  output:{
    filename:'./plugins/app.js'
  },
  module: {
      loaders: [
                { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
            ]
  }
  //,
  //plugins: [
  //  new webpack.optimize.UglifyJsPlugin({
  //              mangle: {
  //                  except: ['$super', '$', 'exports', 'require']
  //              },
  //              compress: {
  //                 drop_console:false
  //               }
  //
  //          })
  //  ]
}
