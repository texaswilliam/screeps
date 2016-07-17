/** @module main */

require('./ext_Array');
require('./ext_Creep');
require('./ext_Object');
require('./ext_Room');
require('./ext_StructureTower');

let builder = require('./builder');
let controller_col = require('./controller_col');
let controller_def = require('./controller_def');
let controller_harv = require('./controller_harv');
let controller_obs = require('./controller_obs');
let controller_tower = require('./controller_tower');

module.exports.loop = function() {
    for (let name in Memory.creeps) { if (!Game.creeps[name]) { delete Memory.creeps[name]; } }
    
    controller_tower.run();
    controller_def.run();
    controller_harv.run();
    controller_col.run();
    controller_obs.run();
    builder.run();
};

G = require('./G');
W = require('./W');
util = require('./util');
