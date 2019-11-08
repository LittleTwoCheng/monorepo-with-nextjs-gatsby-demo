const path = require("path");
const fs = require("fs");

const resolveApp = relativePath =>
    path.resolve(fs.realpathSync(process.cwd()), relativePath);
const resolvePackages = relativePath =>
    path.resolve(
        fs.realpathSync(process.cwd()) + "/../../packages",
        relativePath
    );
const resolveRoot = relativePath =>
    path.resolve(fs.realpathSync(process.cwd()) + "/../..", relativePath);

module.exports = {
    resolveApp,
    resolvePackages,
    resolveRoot
};
