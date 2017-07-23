'use strict';
const path      = require('path');
const project   = path.resolve.bind(path, __dirname);
const lc        = Function.call.bind(String.prototype.toLowerCase);
const hyphenize = v => v.replace(/([A-Z])/g, (g) => `-${lc(g[0])}`);
module.exports  = function (options, webpack) {
    webpack.module.rules.push({
        test: /\.stylm$/,
        use : options.useStyle(
            {
                loader : 'css-loader',
                options: {
                    sourceMap     : true,
                    modules       : true,
                    camelCase     : false,
                    localIdentName: '[name]',
                    context       : 'src',
                    getLocalIdent(loaderContext, localIdentName, localName,
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
                        return `scrolldata${hyphenize(request)}-${localName}`;
                    }
                }
            }, {
                loader : 'stylus-loader',
                options: {
                    use               : [require('nib')()],
                    import            : ['~nib/lib/nib/index.styl'],
                    preferPathResolver: 'webpack',
                    souceMap          : true,
                    paths             : [
                        project('node_modules')
                    ],
                    compress          : false,
                    'include css'     : true,
                    'hoist atrules'   : true
                },
            })
    });
    if (options.useHot) {
        webpack.plugins.unshift(new options.webpack.NamedModulesPlugin())
    }
    return webpack;
}
