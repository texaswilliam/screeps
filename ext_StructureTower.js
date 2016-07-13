/** @module ext_StructureTower */
StructureTower.calculateFalloff = function(power, range) {
    if (range <= TOWER_OPTIMAL_RANGE) { return power; }
    else if (range >= TOWER_FALLOFF_RANGE) { return power * TOWER_FALLOFF; }
    else { return power * (range - TOWER_OPTIMAL_RANGE) / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE) * TOWER_FALLOFF; }
};
