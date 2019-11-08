const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");

const isDirectory = source => lstatSync(source).isDirectory();
module.exports = source =>
    readdirSync(source).filter(name => isDirectory(join(source, name)));
