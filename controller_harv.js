/** @module controller_harv */

require('./ext_Creep');
require('./ext_Room');

let _ = require('lodash');
let should = require('./should');

_.defaultsDeep(Memory, {
    harv: {
        /** @type {number} */
        numCreeps: 5
    }
});

/**
 * @param {number} maxEnergy
 * @returns {string[]}
 */
module.exports.getMaxBody = function(maxEnergy) {
    let carryMoveCost = Creep.getBodyCost([CARRY, MOVE]);
    let workMoveCost = Creep.getBodyCost([WORK, MOVE]);

    let split = Math.floor(maxEnergy / (carryMoveCost + workMoveCost));
    let left = maxEnergy % (carryMoveCost + workMoveCost);

    let numCarry = split;
    let numWork = split + Math.floor(left / workMoveCost);

    let body = [];
    for (let i = 0; i < numWork; ++i) { body.push(WORK); }
    for (let i = 0; i < numCarry; ++i) { body.push(CARRY); }
    for (let i = 0; i < numCarry + numWork; ++i) { body.push(MOVE); }
    return body;
};

module.exports.run = function() {
    let creeps = _.pick(Game.creeps, c => c.memory.role == 'HARV');

    if (_.size(creeps) < Memory.harv.numCreeps) {
        let maxEnergyCap = _(Game.spawns).map(s => s.room.energyCapacityAvailable).max();
        let maxBody = this.getMaxBody(maxEnergyCap);
        let spawn = _.find(Game.spawns, s => s.room.energyAvailable >= Creep.getBodyCost(maxBody));

        if (spawn) { spawn.createCreep(maxBody, undefined, { role: 'HARV' });  }
    }

    for (let name in creeps) {
        let creep = creeps[name];

        let target = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1)[0];

        if (target) {
            creep.pickup(target);
            target = undefined;
        }

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
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: s => s.energy < s.energyCapacity && !(s instanceof StructureTower) });

                if (!target) {
                    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: s => s.energy < s.energyCapacity && s instanceof StructureTower });
                    if (!target) {
                        target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                        if (!target) { target = creep.room.controller; }
                    }
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

                if (!creep.room.hasTower()) {
                    let repPower = _.countBy(creep.body, 'type')[WORK] * REPAIR_POWER;

                    let repTarget = creep.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: s => should.creep.repair(creep, s) })[0];
                    if (repTarget) { creep.repair(repTarget); }
                    else {
                        repTarget = creep.pos.findInRange(FIND_STRUCTURES, 3, { filter: s => should.creep.repair(creep, s) })[0];
                        if (repTarget) { creep.repair(repTarget); }
                    }
                }
            }
            else if (status == OK) { creep.moveTowards(target); }
            else { delete creep.memory.targetID; }
        }
    }
};
