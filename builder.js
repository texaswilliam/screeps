module.exports.run = function() {
    let myRooms = _.pick(Game.rooms, r => r.controller.my);
    
    for (let name in myRooms) {
        let room = myRooms[name];
        
        let numExts = room.find(FIND_MY_STRUCTURES, { filter: s => s instanceof StructureExtension }).length;
        numExts += room.find(FIND_MY_CONSTRUCTION_SITES, { filter: s => s.structureType == STRUCTURE_EXTENSION }).length;
        let maxExts = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
        
        if (numExts < maxExts) {
            let diff = maxExts - numExts;
            let spawn = room.find(FIND_MY_SPAWNS)[0];
            
            for (let radius = 2; diff > 0; ++radius) {
                for (let i = -radius; diff > 0 && i <= radius; i += 2) {
                    for (let j = -radius; diff > 0 && j <= radius; j += 2) {
                        let status = room.createConstructionSite(spawn.pos.x + i, spawn.pos.y + j, STRUCTURE_EXTENSION);
                        if (status == OK) { --diff; }
                    }
                }
            }
        }
    }
};