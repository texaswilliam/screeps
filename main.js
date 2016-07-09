G = require('G');

require('ext_Creep');

let controller_harv = require('controller_harv');

module.exports.loop = function() {
    controller_harv.run();
};
