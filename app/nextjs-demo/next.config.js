const { ANALYZE } = process.env;
const withCSS = require("@zeit/next-css");
const withImages = require("next-images");
const withTM = require("next-transpile-modules");

module.exports = withImages({
    inlineImageLimit: 2048,
    ...withCSS({
        ...withTM({
            transpileModules: [
                "@demo/api",
                "@demo/component",
                "@demo/serverside"
            ],
            pageExtensions: ["js"],
            useFileSystemPublicRoutes: false,
            webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
                if (ANALYZE) {
                    const {
                        BundleAnalyzerPlugin
                    } = require("webpack-bundle-analyzer");

                    config.plugins.push(
                        new BundleAnalyzerPlugin({
                            analyzerMode: "server",
                            analyzerPort: isServer ? 8888 : 8889,
                            openAnalyzer: true
                        })
                    );
                }

                return config;
            },
            webpackDevMiddleware: config => {
                // Perform customizations to webpack dev middleware config
                // Important: return the modified config
                return config;
            }
        })
    })
});
