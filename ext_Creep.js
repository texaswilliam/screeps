/**
 * @param {(RoomPosition|RoomObject)} target
 * @returns {number}
 */
Creep.prototype.moveTowards = function(target) {
    return this.move(this.pos.getDirectionTo(target));
};
