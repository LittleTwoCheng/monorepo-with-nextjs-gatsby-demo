import pokemonApi, { getId } from '@demo/api/pokemon'

const path = require("path");
const APP_SUB_PATH = process.env.GATSBY_APP_SUB_PATH;
const ANALYZE = process.env.ANALYZE;


exports.createPages = async ({ actions }) => {
    const { createPage } = actions;
    const { data, count } = await pokemonApi.list()

    const List = path.resolve("./src/templates/index.js");
    createPage({
        path: `${APP_SUB_PATH}/`,
        component: List,
        context: {
            data,
            count
        }
    });

    const Detail = path.resolve("./src/templates/detail.js");
    return Promise.all(data.map(item => {
        return pokemonApi.get(getId(item)).then(({data}) => {
            createPage({
                path: `${APP_SUB_PATH}/${data.id}`,
                component: Detail,
                context: {
                    data
                }
            });
        });
    }))
};

exports.onCreateWebpackConfig = ({ stage, actions }, options) => {
    switch (stage) {
        case `build-javascript`:
            if (ANALYZE) {
                const {
                    BundleAnalyzerPlugin
                } = require("webpack-bundle-analyzer");
                actions.setWebpackConfig({
                    plugins: [
                        new BundleAnalyzerPlugin({
                            analyzerMode: "static",
                            analyzerPort: 8889,
                            openAnalyzer: true,
                            logLevel: "error",
                            defaultSizes: "gzip"
                        })
                    ]
                });
            }
            return;

        default:
    }
};
