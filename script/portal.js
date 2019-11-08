const argv = require("minimist")(process.argv.slice(2));
const inquirer = require("inquirer");
const chalk = require("chalk");
const { join } = require("path");
const resolveApp = require("./path").resolveApp;
const allDir = require("./allDir");

const ALLOWED_SCRIPT_NAMES = ["start", "build"];
const appBasePath = resolveApp("app");
const APP_NAMES = allDir(appBasePath);

const askScriptName = action => {
    const questions = [
        {
            name: "scriptName",
            type: "list",
            message: `Which script do you want to run?`,
            choices: ALLOWED_SCRIPT_NAMES
        }
    ];
    return inquirer.prompt(questions);
};

const askAppName = action => {
    const questions = [
        {
            name: "appName",
            type: "list",
            message: `Which App do you want to ${action}?`,
            choices: APP_NAMES
        }
    ];
    return inquirer.prompt(questions);
};

const getScriptName = async argv => {
    if (!argv.name) return await askScriptName();

    const scriptName = argv.name;

    if (ALLOWED_SCRIPT_NAMES.indexOf(scriptName) === -1) {
        console.log(chalk.red("Wrong script name."));
        return process.exit(1);
    }

    return { scriptName };
};

const getAppName = async (argv, scriptName) => {
    if (!argv.app) return await askAppName(scriptName);

    const appName = argv.app;

    if (APP_NAMES.indexOf(appName) === -1) {
        console.log(chalk.red("Wrong App name."));
        return process.exit(1);
    }

    return { appName };
};

const run = async argv => {
    const { scriptName } = await getScriptName(argv);

    const { appName } = await getAppName(argv, scriptName);

    process.env.APP_NAME = appName;

    const appPath = join(appBasePath, appName);
    process.chdir(appPath);

    require(`${appPath}/script/${scriptName}`);
};

run(argv);
