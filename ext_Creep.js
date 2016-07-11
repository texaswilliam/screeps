/** @module ext_Creep */

/**
 * @param {string[]} body
 * @returns {number}
 */
Creep.getBodyCost = function(body) { return _.sum(body, part => BODYPART_COST[part]); }

/**
 * @param {(RoomPosition|RoomObject)} target
 * @returns {number}
 */
Creep.prototype.moveAwayFrom = function(target) {
    return this.move((this.pos.getDirectionTo(target) + 3) % 8 + 1);
};

/**
 * @param {(RoomPosition|RoomObject)} target
 * @returns {number}
 */
Creep.prototype.moveTowards = function(target) { return this.move(this.pos.getDirectionTo(target)); };
