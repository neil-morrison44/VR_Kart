const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  //...
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    host: "0.0.0.0",
    port: 8081,
  },
  module: {
    rules: [
      {
        test: /\.(html|mp4|png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ inject: "head" })],
}
