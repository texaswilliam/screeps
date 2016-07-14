/** @module builder */

let _ = require('lodash');

/**
 * @param {string} roomName
 * @param {function} jsType
 * @param {string} structureType
 */
module.exports.ensureMaxStructureType = function(roomName, jsType, structureType) {
    let room = Game.rooms[roomName];
    if (!room || !room.controller.my) { return; }
    
    let num = room.find(FIND_MY_STRUCTURES, { filter: s => s instanceof jsType }).length;
    num += room.find(FIND_MY_CONSTRUCTION_SITES, { filter: s => s.structureType == structureType }).length;
    let max = CONTROLLER_STRUCTURES[structureType][room.controller.level];
    
    if (num < max) {
        let diff = max - num;
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        
        for (let radius = 2; diff > 0; ++radius) {
            for (let i = -radius; diff > 0 && i <= radius; i += 2) {
                for (let j = -radius; diff > 0 && j <= radius; j += 2) {
                    if (i >= -1 && i <= 1 && j >= -1 && j <= 1) { continue; }
                    let x = spawn.pos.x + i;
                    let y = spawn.pos.y + j;
                    if (x < 0 || x > 49 || y < 0 || y > 49) { continue; }
                    let status = room.createConstructionSite(x, y, structureType);
                    if (status == OK) { --diff; }
                }
            }
        }
    }
};

module.exports.run = function() {
    let myRooms = _.pick(Game.rooms, r => r.controller.my);
    
    for (let name in myRooms) {
        this.ensureMaxStructureType(name, StructureTower, STRUCTURE_TOWER);
        this.ensureMaxStructureType(name, StructureExtension, STRUCTURE_EXTENSION);
    }
};
