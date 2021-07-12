const brfs = require('brfs');

module.exports = function ModuleBrfs(resource) {
    return brfs(resource, {
        parserOpts: {
            sourceType: 'module'
        }
    })
};