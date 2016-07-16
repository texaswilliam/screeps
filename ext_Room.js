/** @module ext_Room */

/** @returns {Array.<(ConstructionSite|Creep|Structure)>} */
Room.prototype.findAllHostiles = function() {
    let targets = this.find(FIND_HOSTILE_CONSTRUCTION_SITES);
    targets = targets.concat(this.find(FIND_HOSTILE_CREEPS));
    targets = targets.concat(this.find(FIND_HOSTILE_SPAWNS));
    targets = targets.concat(this.find(FIND_HOSTILE_STRUCTURES));
    return targets;
}

/** @returns {boolean} */
Room.prototype.hasTower = function() {
    if (this._hasTower !== undefined) { return this._hasTower; }
    else {
        let towers = this.find(FIND_MY_STRUCTURES, { filter: s => s instanceof StructureTower });
        this._hasTower = towers.length > 0;
        return this._hasTower;
    }
};
