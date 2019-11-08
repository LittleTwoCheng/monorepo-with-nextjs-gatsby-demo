const express = require("express");
const { resolve } = require("path");
const fs = require("fs");

const next = require("next");

const helmet = require("helmet");

const dev = process.env.NODE_ENV !== "production";
console.log(`This is ${dev ? "DEV 🐛" : "PROD 🦄"}`);

const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

const appDirectory = fs.realpathSync(process.cwd());
const packagePath = appDirectory + "/../../packages";

const { compose, getCacheKey, resetCache } = require(resolve(
    packagePath,
    "@demo/serverside/renderWithCache"
));

const renderWithCache = compose({ app, dev, getCacheKey });

(async () => {
    await app.prepare();
    const server = express();

    server.use(helmet());

    server.get("/:id", (req, res) => {
        const actualPage = "/[id]";
        const queryParams = {
            id: req.params.id
        };
        renderWithCache(req, res, actualPage, queryParams);
    });
    server.get("/", (req, res) => {
        const actualPage = "/index";
        const queryParams = {
        };

        renderWithCache(req, res, actualPage, queryParams);
    });
    server.get("*", (req, res) => {
        handle(req, res);
    });

    try {
        await server.listen(port);
        console.log(`> Ready on http://localhost:${port}`);

        process.on("SIGINT", msg => {
            // process reload ongoing
            // close connections, clear cache, etc
            // by default, you have 1600ms
            resetCache();

            process.exit(0);
        });

        if (process.send) process.send("ready");
    } catch (e) {
        console.log(e);
    }
})();
