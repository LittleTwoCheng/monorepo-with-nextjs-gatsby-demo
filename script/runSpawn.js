const { spawn } = require("child_process");
const chalk = require("chalk");

const runSpawn = (command, args, options = {}, willOutputData = false) => {
    return new Promise((resolve, reject) => {
        const cmd = spawn(
            command,
            args,
            willOutputData
                ? options
                : {
                      stdio: "inherit",
                      ...options
                  }
        );

        let bufferResponse = "";

        if (willOutputData) {
            cmd.stdout.on("data", data => {
                console.log(chalk.yellow(data));
                bufferResponse += data;
            });

            cmd.stderr.on("data", data => {
                console.log(chalk.bgRed(data));
            });
        }

        cmd.on("close", code => {
            if (code !== 0) {
                reject();
            }
            resolve(bufferResponse);
        });
    });
};

module.exports = runSpawn;
