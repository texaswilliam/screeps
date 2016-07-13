/** @module controller_tower */

let _ = require('lodash');
let should = require('./should');

module.exports.run = function() {
    /** @type {Object.<string, StructureTower[]>} */
    let towersByRoomName = _(Game.structures).filter(s => s instanceof StructureTower).groupBy(s => s.room.name).value();

    for (let roomName in towersByRoomName) {
        let towers = towersByRoomName[roomName];
        let room = Game.rooms[roomName];

        let targets = _.sortBy(room.find(FIND_HOSTILE_CREEPS), c => c.hits);
        if (_.some(targets)) { _.forEach(towers, t => t.attack(targets[0])); }
        else {
            let targets = _.sortBy(room.find(FIND_HOSTILE_CONSTRUCTION_SITES), c => c.progress);
            if (_.some(targets)) { _.forEach(towers, t => t.attack(targets[0])); }
            else {
                targets = _.sortBy(room.find(FIND_MY_CREEPS, { filter: s => s.hits < s.hitsMax }), s => s.hits);
                if (_.some(targets)) { while (_.some(towers) && _.some(targets)) { towers.shift().heal(targets.shift()); } }
                else if (_.some(towers)) {
                    targets = _.sortBy(room.find(FIND_MY_STRUCTURES, { filter: s => should.tower.repair(s) }), s => s.hits);
                    if (_.some(targets)) { while (_.some(towers) && _.some(targets)) { towers.shift().repair(targets.shift()); } }
                    else if (_.some(towers)) {
                        targets = _.sortBy(room.find(FIND_STRUCTURES, { filter: s => should.tower.repair(s) }), s => s.hits);
                        if (_.some(targets)) { while (_.some(towers) && _.some(targets)) { towers.shift().repair(targets.shift()); } }
                    }
                }
            }
        }
    }
};
