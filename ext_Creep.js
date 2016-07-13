/** @module ext_Creep */

let _ = require('lodash');

/**
 * @param {string[]} parts
 * @returns {number}
 */
Creep.getBodyCost = function(parts) { return _.sum(parts, part => BODYPART_COST[part]); };

/** @returns {number} */
Creep.prototype.getBodyCost = function() { return Creep.getBodyCost(_.map(this.body, 'type')); };

/**
 * @param {(RoomPosition|RoomObject)} target
 * @returns {number}
 */
Creep.prototype.moveAwayFrom = function(target) { return this.move((this.pos.getDirectionTo(target) + 3) % 8 + 1); };

/**
 * @param {(RoomPosition|RoomObject)} target
 * @returns {number}
 */
Creep.prototype.moveTowards = function(target) { return this.move(this.pos.getDirectionTo(target)); };
