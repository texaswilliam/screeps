/** @module controller_def */

let _ = require('lodash');

_.defaultsDeep(Memory, {
    def: {
        /** @type {number} */
        numCreeps: 1
    }
});

/**
 * @param {number} maxEnergy
 * @returns {string[]}
 */
module.exports.getMaxBody = function(maxEnergy) {
    let attackMoveCost = Creep.getBodyCost([ATTACK, MOVE]);
    let toughMoveCost = Creep.getBodyCost([TOUGH, MOVE]);

    let split = Math.floor(maxEnergy / (attackMoveCost + toughMoveCost));
    let left = maxEnergy % (attackMoveCost + toughMoveCost);

    let numTough = split;
    let numAttack = split + Math.floor(left / attackMoveCost);

    let body = [];
    for (let i = 0; i < numTough; ++i) { body.push(TOUGH); }
    for (let i = 0; i < numAttack; ++i) { body.push(ATTACK); }
    for (let i = 0; i < numTough + numAttack; ++i) { body.push(MOVE); }
    return body;
};

module.exports.run = function() {
    let creeps = _.pick(Game.creeps, c => c.memory.role == 'DEF');

    if (_.size(creeps) < Memory.def.numCreeps) {
        let maxEnergyCap = _(Game.spawns).map(s => s.room.energyCapacityAvailable).max();
        let maxBody = this.getMaxBody(maxEnergyCap);
        let spawn = _.find(Game.spawns, s => s.room.energyAvailable >= Creep.getBodyCost(maxBody));

        if (spawn) { spawn.createCreep(maxBody, undefined, { role: 'DEF' });  }
    }

    creeps = _.pick(creeps, c => !c.spawning);

    for (let name in creeps) {
        let creep = creeps[name];

        let target = _.sortBy(creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1), c => c.hits)[0];
        if (target) { creep.memory.targetID = target.id; }

        if (!target && creep.memory.targetID) {
            target = Game.getObjectById(creep.memory.targetID);
            if (!target) { delete creep.memory.targetID; }
        }

        if (!target) {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if (target) { creep.memory.targetID = target.id; }
        }

        if (target) {
            creep.attack(target);
            creep.moveTo(target, { reusePath: 0 });
        }
        else {
            let spawn = creep.pos.findInRange(FIND_MY_SPAWNS, 3)[0];
            if (spawn) {
                if (creep.pos.getRangeTo(spawn) < 2) { creep.moveAwayFrom(spawn); }
            }
            else {
                spawn = _.find(Game.spawns);
                if (spawn) { creep.moveTo(spawn); }
            }
        }
    }
};