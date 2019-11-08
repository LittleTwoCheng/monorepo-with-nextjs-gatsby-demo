require("dotenv").config();

const config = {
    siteMetadata: {
        title: `Pokemon`,
        description: `Pokemon`,
        author: `Ben`
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // `gatsby-plugin-offline`,
        `gatsby-plugin-remove-trailing-slashes`
    ]
};

const assetPrefix = process.env.ASSET_PREFIX || null;
if (assetPrefix) config.assetPrefix = assetPrefix;

module.exports = config;
