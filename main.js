/** @module main */

let wmem = require('./WMem');

require('./ext_Array');
require('./ext_Creep');
require('./ext_Object');
require('./ext_Room');
require('./ext_StructureTower');

let builder = require('./builder');
let controller_def = require('./controller_def');
let controller_harv = require('./controller_harv');
let controller_tower = require('./controller_tower');

module.exports.loop = function() {
    wmem.load();

    for (let name in Memory.creeps) { if (!Game.creeps[name]) { delete Memory.creeps[name]; } }
    
    controller_tower.run();
    controller_def.run();
    controller_harv.run();
    builder.run();
};

G = require('./G');
W = require('./W');
util = require('./util');
