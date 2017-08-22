'use strict';
const path     = require('path');
const project  = path.resolve.bind(path, __dirname);
module.exports = function (options, webpack) {

    webpack.module.rules.push({
        test: /\.stylm$/,
        use : options.useStyle(
            {
                loader : 'css-loader',
                options: {
                    sourceMap     : true,
                    modules       : true,
                    camelCase     : false,
                    localIdentName: '[path]_[name]__[local]',
                    context       : 'src'
                }

            }, {
                loader : 'stylus-loader',
                options: {
                    use               : [require('nib')()],
                    import            : ['~nib/lib/nib/index.styl'],
                    preferPathResolver: 'webpack',
                    sourceMap          : true,
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
    if (options.isDevServer){
        options.devtool = 'inline-source-map';
    }
    return webpack;
}
