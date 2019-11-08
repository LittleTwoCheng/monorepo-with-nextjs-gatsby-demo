const runSpawn = require("../../../script/runSpawn");

const develop = async () => {
    // run `gatsby develop`
    await runSpawn("gatsby", ["develop", "."]);
};

develop();