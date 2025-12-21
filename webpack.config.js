const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: "./src/scripts/index.js",
  output: {
    path: path.resolve(__dirname),
    filename: "[name].[contenthash].js",
    clean: false,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      inject: "body",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: false,
      },
    }),
    // Inline CSS and JS into HTML
    {
      apply(compiler) {
        compiler.hooks.done.tap("InlineAssetsPlugin", () => {
          const fs = require("node:fs");
          const indexPath = path.join(__dirname, "index.html");
          const cssPath = path.join(__dirname, "styles.css");

          let htmlContent = fs.readFileSync(indexPath, "utf8");

          // Inline CSS
          if (fs.existsSync(cssPath)) {
            const cssContent = fs.readFileSync(cssPath, "utf8");
            htmlContent = htmlContent.replace(
              /<link[^>]*href="styles\.css"[^>]*>/,
              `<style>${cssContent}</style>`
            );
            fs.unlinkSync(cssPath);
          }

          // Inline JS - find all script tags and extract their src, fetch content, and inline
          const scriptRegex = /<script[^>]*src="([^"]+)"[^>]*>\s*<\/script>/g;
          htmlContent = htmlContent.replace(scriptRegex, (match, src) => {
            const scriptPath = path.join(__dirname, src);
            if (fs.existsSync(scriptPath)) {
              const scriptContent = fs.readFileSync(scriptPath, "utf8");
              fs.unlinkSync(scriptPath);
              return `<script>${scriptContent}</script>`;
            }
            return match;
          });

          fs.writeFileSync(indexPath, htmlContent);
        });
      },
    },
  ],
  optimization: {
    minimize: true,
    runtimeChunk: false,
  },
  devtool: false,
};
