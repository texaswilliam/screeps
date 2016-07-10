G = require('./G');

require('./ext_Creep');

let builder = require('./builder');
let controller_harv = require('./controller_harv');

module.exports.loop = function() {
    for (let name in Memory.creeps) { if (!Game.creeps[name]) { delete Memory.creeps[name]; } }
    
    builder.run();
    controller_harv.run();
};
