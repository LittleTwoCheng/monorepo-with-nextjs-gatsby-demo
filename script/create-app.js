const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));
const inquirer = require("inquirer");
const chalk = require("chalk");
const copyDir = require("copy-dir");
const replace = require("replace-in-file");

const resolveApp = require("./path").resolveApp;
const allDir = require("./allDir");

const appBasePath = resolveApp("app");
const APP_NAMES = allDir(appBasePath);

const TEMPLATE_TYPES = ["next", "cra"];

const askAppName = () => {
    const questions = [
        {
            name: "appName",
            type: "input",
            message: `Name of the App (/^[a-z0-9_]{3,30}$/)`
        }
    ];
    return inquirer.prompt(questions);
};

const askDisplayName = appName => {
    const questions = [
        {
            name: "displayName",
            type: "text",
            message: `Display name of the App`,
            default: appName
                .split("_")
                .map(ucfirst)
                .join(" ")
        }
    ];
    return inquirer.prompt(questions);
};

const askTemplateType = displayName => {
    const questions = [
        {
            name: "templateType",
            type: "list",
            message: `Pick the template for ${displayName}`,
            choices: TEMPLATE_TYPES
        }
    ];
    return inquirer.prompt(questions);
};

const getAppName = async argv => {
    if (!argv.app) return await askAppName();

    const appName = argv.app;

    return { appName };
};

const getDisplayName = async (argv, appName) => {
    if (!argv.display) return await askDisplayName(appName);

    const displayName = argv.display;

    return { displayName };
};

const getTemplateType = async (argv, displayName) => {
    if (!argv.template) return await askTemplateType(displayName);

    const templateType = argv.template;

    return { templateType };
};

function ucfirst(s) {
    return s.charAt(0).toUpperCase() + s.substr(1);
}

const run = async argv => {
    console.log(
        chalk.bgBlue(
            "A Quick tool to help adding a CRA app package to this monorepo"
        )
    );
    console.log(chalk.gray("(We use template from ./.cra_template)"));

    const appName = getAppName(argv);

    if (!/^[a-z0-9_]{3,30}$/.test(appName)) {
        console.log(chalk.red("Invalid App name"));
        return process.exit();
    }

    if (APP_NAMES.indexOf(appName) !== -1) {
        console.log(chalk.red("App name is duplicated"));
        return process.exit();
    }

    const { displayName } = await getDisplayName(argv, appName);
    const { templateType } = await getTemplateType(argv, displayName);

    copyDir.sync(`./.templates/${templateType}`, `./app/${appName}`);
    console.log(
        `App ${chalk.yellow(
            `./app/${appName}`
        )} is created from template ${chalk.yellow(templateType)}`
    );

    try {
        const changes = await replace({
            files: [
                `./packages/${appName}/public/index.html`,
                `./packages/${appName}/public/manifest.json`,
                `./packages/${appName}/README.md`
            ],
            from: [/%appName%/g, /%display_name%/g],
            to: [appName, displayName]
        });
        console.log("Modified files: ", chalk.yellow(changes.join(", ")));
    } catch (error) {
        console.error(chalk.red("Error occurred: "), error);
        process.exit(1);
    }

    console.log(chalk.green("DONE"));
};

run(argv);
