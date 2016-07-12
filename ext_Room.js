/** @module ext_Room */
Room.prototype.hasTower = function() {
    if (this._hasTower !== undefined) { return this._hasTower; }
    else {
        let towers = this.find(FIND_MY_STRUCTURES, { filter: s => s instanceof StructureTower });
        this._hasTower = towers.length > 0;
        return this._hasTower;
    }
};
