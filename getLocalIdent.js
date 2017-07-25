'use strict';
const lc        = Function.call.bind(String.prototype.toLowerCase);
const hyphenize = v => v.replace(/([A-Z])/g, (g) => `-${lc(g[0])}`);
const path      = require('path');
const pkg       = require(path.resolve(process.cwd(), 'package.json')).name;

function getLocalIdent(loaderContext, localIdentName, localName,
                       options) {
    if (!options.context) {
        options.context = loaderContext.options
                          && typeof loaderContext.options.context
                             === "string"
            ? loaderContext.options.context
            : loaderContext.context;
    }

    const request = path.basename(
        path.relative(options.context,
            loaderContext.resourcePath), '.stylm');
    return `${pkg}${hyphenize(request)}-${localName}`;
}

module.exports = getLocalIdent;
