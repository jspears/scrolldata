'use strict';
const path          = require('path');
const project       = path.resolve.bind(path, __dirname);
const getLocalIdent = require('./getLocalIdent');
module.exports      = function (options, webpack) {
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
                    getLocalIdent,
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
