function ensureMax(roomName, jsType, structureType) {
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
                    let status = room.createConstructionSite(spawn.pos.x + i, spawn.pos.y + j, structureType);
                    if (status == OK) { --diff; }
                }
            }
        }
    }
}

module.exports.run = function() {
    let myRooms = _.pick(Game.rooms, r => r.controller.my);
    
    for (let name in myRooms) {
        ensureMax(name, StructureTower, STRUCTURE_TOWER);
        ensureMax(name, StructureExtension, STRUCTURE_EXTENSION);
    }
};