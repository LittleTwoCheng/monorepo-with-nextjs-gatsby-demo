// set environment variable from {app}/.env
require("dotenv-expand")(
    require("dotenv").config()
);

const env = require("./env.config.js");
module.exports = {
    presets: ["next/babel"],
    plugins: [["transform-define", env], "macros"]
};
