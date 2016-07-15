/** @module should */

module.exports.creep = {};

/**
 * @param {Creep} source
 * @param {Structure} target
 * @returns {boolean}
 */
module.exports.creep.repair = function(source, target) {
    let repPower = source.body.filter(p => p.type === WORK).length * REPAIR_POWER;
    let hitsLimit = target instanceof StructureRoad ? 4500 : 20000;
    return (target.hits <= target.hitsMax - repPower || target.hits < target.hitsMax / 2) && target.hits < hitsLimit;
};

module.exports.tower = {};

/**
 * @param {Structure} target
 * @returns {boolean}
 */
module.exports.tower.repair = function(target) {
    let repPower = TOWER_POWER_REPAIR;
    let hitsLimit = target instanceof StructureRoad ? 4500 : 20000;
    return (target.hits <= target.hitsMax - repPower || target.hits < target.hitsMax / 2) && target.hits < hitsLimit;
};
