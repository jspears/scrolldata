const path = require('path');
const project = path.resolve.bind(path, __dirname);

module.exports = function(options, webpack){
    webpack.module.rules.push({
        test: /\.stylm$/,
        use : [
            'style-loader',
            {
                loader : 'css-loader',
                options: {
                    sourceMap     : true,
                    modules       : true,
                    camelCase     : true,
                    localIdentName: '[name]__[local]',
                    alias         : {
                        './fonts': project(
                            'node_modules/bh-ui-styles/fonts')
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
                        project('node_modules/bh-ui-styles/stylus'),
                        project('node_modules/bh-ui-styles'),
                        project('node_modules')
                    ],
                    compress          : false,
                    'include css'     : true,
                    'hoist atrules'   : true
                },
            }]
    });
    return webpack;
}
