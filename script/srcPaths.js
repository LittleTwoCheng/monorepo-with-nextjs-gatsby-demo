module.exports = resolve => {
    const appPackageJson = require(resolve("package.json"));
    const srcPaths = appPackageJson.srcPaths || [];
    return srcPaths.map(resolve);
};
