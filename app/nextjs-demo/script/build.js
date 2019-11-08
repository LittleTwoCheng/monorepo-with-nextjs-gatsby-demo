const runSpawn = require("../../../script/runSpawn");

const build = async () => {
    // run `next build .`
    await runSpawn("next", ["build", "."]);
};

build();