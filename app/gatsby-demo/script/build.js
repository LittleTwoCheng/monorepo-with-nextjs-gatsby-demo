const runSpawn = require("../../../script/runSpawn");

const build = async () => {
    // run `next build .`
    await runSpawn("gatsby", ["build", ".", "--prefix-paths"]);
};

build();
