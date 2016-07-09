G = require('G');

require('ext_Creep');

let builder = require('builder');
let controller_harv = require('controller_harv');

module.exports.loop = function() {
    builder.run();
    controller_harv.run();
};
