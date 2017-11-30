const path = require("path");

const basePath = process.cwd();
const env = process.env.NODE_ENV || "development";
const isProd = env === "production";
const out = path.join(basePath, "./dist");
const exclude = /node_modules/;

const webpack = require("webpack");
const HTML = require("html-webpack-plugin");

const plugins = [
  new webpack.optimize.CommonsChunkPlugin({ name: "vendor" }),
  new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify(env) }),
  new HTML({
    template: path.join(basePath, "./index.html"),
    inject: true,
    minify: isProd
      ? {
          removeComments: true,
          collapseWhitespace: true
        }
      : false
  })
];

if (isProd) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
    new webpack.optimize.UglifyJsPlugin()
  );
} else {
  // dev only
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  );
}

module.exports = {
  entry: {
    app: path.join(basePath, "./index.js"),
    vendor: ["react", "react-dom"],
    ...(!isProd ? { hot: "webpack-hot-middleware/client" } : {})
  },
  output: {
    path: out,
    filename: "[name].[hash].js",
    publicPath: "./"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: exclude,
        loader: "babel-loader",
        options: {
          extends: path.join(__dirname, ".babelrc")
        }
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[path][name]__[local]--[hash:base64:5]"
            }
          },
          {
            loader: "postcss-loader",
            options: {
              config: {
                path: path.join(__dirname, "postcss.config.js")
              }
            }
          },
          { loader: "sass-loader" }
        ],
        exclude: /shell.scss/
      },
      {
        test: /\.(png|svg)$/,
        loader: "file-loader",
        exclude: exclude
      }
    ]
  },
  plugins: plugins,
  devtool: !isProd && "eval"
};