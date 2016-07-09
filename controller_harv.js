require('ext_Creep');

if (!Memory.harv) { Memory.harv = {}; }
if (!Memory.harv.numCreeps) { Memory.harv.numCreeps = 5; }

module.exports = {
    body: [WORK, MOVE, CARRY, MOVE],
    get bodyCost() { return _.sum(this.body, part => BODYPART_COST[part]); },
    run: function() {
        let creeps = _.pick(Game.creeps, c => c.memory.role == 'HARV');
        
        if (_.size(creeps) < Memory.harv.numCreeps) {
            let spawns = _.filter(Game.spawns, s => s.room.energyAvailable > this.bodyCost && s.room.energyCapacityAvailable - s.room.energyAvailable < this.bodyCost);
            if (_.some(spawns)) {
                let spawn = _.max(spawns, 'room.energyAvailable');
                let body = [];
                let bodyMult = Math.floor(spawn.room.energyAvailable / this.bodyCost);
                for (let i = 0; i < bodyMult; ++i) { body = body.concat(this.body); }
                spawn.createCreep(body, undefined, { role: 'HARV' });
            }
        }
        
        for (let name in creeps) {
            let creep = creeps[name];
            
            let target;
            
            if (creep.memory.targetID) {
                target = Game.getObjectById(creep.memory.targetID);
                if (!target || (target instanceof StructureSpawn || target instanceof StructureExtension) &&
                        (target.energy == target.energyCapacity || creep.carry.energy == 0) ||
                        target instanceof StructureController && creep.carry.energy == 0 ||
                        target instanceof Source && (target.energy == 0 || creep.carry.energy == creep.carryCapacity)) {
                    target = undefined;
                    delete creep.memory.targetID;
                }
            }
            
            if (!target) {
                if (creep.carry.energy > 0) {
                    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: s => s.energy < s.energyCapacity });
                    
                    if (!target) {
                        target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                        if (!target) { target = creep.room.controller; }
                    }
                }
                else { target = creep.pos.findClosestByPath(FIND_SOURCES, { filter: s => s.energy > 0 }); }
                
                if (target) { creep.memory.targetID = target.id; }
            }
            
            if (target) {
                let status;
                
                if (target instanceof StructureSpawn || target instanceof StructureExtension) {
                    status = creep.transfer(target, RESOURCE_ENERGY);
                }
                else if (target instanceof ConstructionSite) {
                    status = creep.build(target);
                }
                else if (target instanceof StructureController) {
                    status = creep.upgradeController(target);
                }
                else if (target instanceof Source) {
                    status = creep.harvest(target);
                }
                
                if (status == ERR_NOT_IN_RANGE) { creep.moveTo(target); }
                else if (status == OK) { creep.moveTowards(target); }
                else { delete creep.memory.targetID; }
            }
        }
    }
};
