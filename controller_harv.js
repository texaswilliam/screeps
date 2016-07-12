/** @module controller_harv */

require('./ext_Creep');

if (!Memory.harv) { Memory.harv = {}; }
if (!Memory.harv.numCreeps) { Memory.harv.numCreeps = 5; }

module.exports = {
    /**
     * @param {string[]} body
     * @param {number} maxEnergy
     * @returns {string[]}
     */
    getMaxBody: function(maxEnergy) {
        let carryMoveCost = Creep.getBodyCost([CARRY, MOVE]);
        let workMoveCost = Creep.getBodyCost([WORK, MOVE]);
        let body = [WORK, MOVE, CARRY, MOVE];
        while (true) {
            if (Creep.getBodyCost(body) + workMoveCost > maxEnergy) { break; }
            body = [WORK, MOVE].concat(body);
            if (Creep.getBodyCost(body) + workMoveCost > maxEnergy) { break; }
            body = [WORK, MOVE].concat(body);
            if (Creep.getBodyCost(body) + carryMoveCost > maxEnergy) { break; }
            body = body.concat([CARRY, MOVE]);
        }
        return body;
    },
    run: function() {
        let creeps = _.pick(Game.creeps, c => c.memory.role == 'HARV');
        
        if (_.size(creeps) < Memory.harv.numCreeps) {
            let maxEnergyCap = _(Game.spawns).map(s => s.room.energyCapacityAvailable).max();
            let maxBody = this.getMaxBody(maxEnergyCap);
            let spawn = _.find(Game.spawns, s => s.room.energyAvailable >= Creep.getBodyCost(maxBody));

            if (spawn) { spawn.createCreep(maxBody, undefined, { role: 'HARV' });  }
        }
        
        for (let name in creeps) {
            let creep = creeps[name];
            
            let target;
            
            if (creep.memory.targetID) {
                target = Game.getObjectById(creep.memory.targetID);
                if (!target || target instanceof Structure &&
                        (target.energy !== undefined && target.energy == target.energyCapacity || creep.carry.energy == 0)) {
                    target = undefined;
                    delete creep.memory.targetID;
                }
                else if (target && target instanceof Source && (target.energy == 0 || creep.carry.energy == creep.carryCapacity)) {
                    creep.moveAwayFrom(target);
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
                
                if (target instanceof Structure && target.energy !== undefined) {
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
                
                if (status == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { reusePath: Memory.reusePath });

                    let repTarget = creep.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: s => s.hits < s.hitsMax })[0];
                    if (repTarget) { creep.repair(repTarget); }
                    else {
                        repTarget = creep.pos.findInRange(FIND_STRUCTURES, 3, { filter: s => s.hits < s.hitsMax })[0];
                        if (repTarget) { creep.repair(repTarget); }
                    }
                }
                else if (status == OK) { creep.moveTowards(target); }
                else { delete creep.memory.targetID; }
            }
        }
    }
};
