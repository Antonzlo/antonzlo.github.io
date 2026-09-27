const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PAGES = ["index", "order-form"];

module.exports = {
  mode: "production",
  entry: {
    index: "./src/scripts/index.js",
    "order-form": "./src/order-form/index.jsx",
  },
  output: {
    path: path.resolve(__dirname),
    filename: "[name].[contenthash].js",
    clean: false,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", ["@babel/preset-react", { runtime: "automatic" }]],
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].styles.css",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["index"],
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
    new HtmlWebpackPlugin({
      template: "./src/order-form/order-form.html",
      filename: "order-form.html",
      chunks: ["order-form"],
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
    // Inline each page's CSS and JS into its own HTML file
    {
      apply(compiler) {
        compiler.hooks.done.tap("InlineAssetsPlugin", () => {
          const fs = require("node:fs");

          for (const page of PAGES) {
            const htmlPath = path.join(__dirname, `${page}.html`);
            const cssPath = path.join(__dirname, `${page}.styles.css`);
            if (!fs.existsSync(htmlPath)) continue;

            let htmlContent = fs.readFileSync(htmlPath, "utf8");

            // Inline CSS
            if (fs.existsSync(cssPath)) {
              const cssContent = fs.readFileSync(cssPath, "utf8");
              htmlContent = htmlContent.replace(
                new RegExp(`<link[^>]*href="${page}\\.styles\\.css"[^>]*>`),
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
                // data-cfasync="false" opts the script out of Cloudflare Rocket Loader,
                // which would otherwise defer it and delay first paint (theme flash on
                // index, blank page on order-form).
                return `<script data-cfasync="false">${scriptContent}</script>`;
              }
              return match;
            });

            fs.writeFileSync(htmlPath, htmlContent);
          }
        });
      },
    },
  ],
  optimization: {
    minimize: true,
    runtimeChunk: false,
    minimizer: [
      new (require("terser-webpack-plugin"))({
        extractComments: false,
      }),
    ],
  },
  devtool: false,
};
