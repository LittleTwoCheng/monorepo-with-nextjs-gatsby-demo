const LRUCache = require("lru-cache");
const { stringify } = require("qs");

const DEFAULT_OPTIONS = {
    length: function(n, key) {
        return n.toString().length + key.toString().length;
    },
    max: 10 * 1000 * 1000, // 10MB cache soft limit (this is around 100 regular pageds!)
    maxAge: 1000 * 60 * 30 // 30 mins
};

let ssrCache = null;

function init(options) {
    ssrCache = new LRUCache(options);
}

function alphabeticalSort(a, b) {
    return a.localeCompare(b);
}

function getCacheKey(req, pagePath, queryParams) {
    const queryString = stringify(queryParams, { sort: alphabeticalSort });

    // take locale into account.
    const prefixPath = req.lng ? `/${req.lng}` : "";

    return `${prefixPath}${pagePath}?${queryString}`;
}

async function render(
    req,
    res,
    pagePath,
    queryParams,
    { app, dev, getCacheKey = null }
) {
    if (dev) {
        //skip caching.
        app.render(req, res, pagePath, queryParams);
        return;
    }

    const key = getCacheKey(req, pagePath, queryParams);

    // If we have a page in the cache, let's serve it
    if (ssrCache.has(key)) {
        res.setHeader("x-ssr-cache", "HIT");
        res.send(ssrCache.get(key));
        return;
    }

    try {
        // If not let's render the page into HTML
        const html = await app.renderToHTML(req, res, pagePath, queryParams);

        // Something is wrong with the request, let's skip the cache
        if (res.statusCode !== 200 || res.noCache) {
            res.send(html);
            return;
        }

        // Let's cache this page
        ssrCache.set(key, html);

        res.setHeader("x-ssr-cache", "MISS");
        res.send(html);
    } catch (err) {
        app.renderError(err, req, res, pagePath, queryParams);
    }
}

function compose(context, options = DEFAULT_OPTIONS) {
    init(options);

    return async (req, res, pagePath, queryParams) =>
        render(req, res, pagePath, queryParams, context);
}

function resetCache() {
    if (ssrCache) ssrCache.reset();
}

module.exports = {
    compose,
    resetCache,
    getCacheKey
};
