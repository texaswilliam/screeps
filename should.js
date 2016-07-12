/** @module should */
module.exports = {
    repair(repPower, hits, hitsMax) {
        return (hits <= hitsMax - repPower || hits < hitsMax / 2) && hits < 10000;
    }
};