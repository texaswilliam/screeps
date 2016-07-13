/** @module should */

/**
 * @param {number} repPower
 * @param {number} hits
 * @param {number} hitsMax
 * @returns {boolean}
 */
module.exports.repair = function(repPower, hits, hitsMax) { return (hits <= hitsMax - repPower || hits < hitsMax / 2) && hits < 10000; };
