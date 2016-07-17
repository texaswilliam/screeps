_.defaultsDeep(Memory, {
    col: {
        claims: [],
        reserves: []
    }
});

module.exports.run = function() {
    /** @type {Set.<string>} */
    let creeps = new Set([...Object.values(Game.creeps)].filter(c => c.memory.role === 'COL').map(c => c.name));

    /** @type {Map.<string, string>} */
    let claims = new Map(Memory.col.claims);
    /** @type {Map.<string, string>} */
    let reserves = new Map(Memory.col.reserves);

    for (let [rn, cn] of claims) if (!creeps.has(cn)) claims.set(rn, null);
    for (let [rn, cn] of reserves) if (!creeps.has(cn)) reserves.set(rn, null);

    /** @type {Set.<string>} */
    let assigned = new Set([...claims.values()].concat([...reserves.values()]).filter(cn => !!cn));

    /** @type {Set.<string>} */
    let unassigned = [...creeps].filter(cn => !assigned.has(cn));

    if (unassigned.length > 0) {
        for (let [rn, cn] of claims) {
            if (!cn) claims.set(rn, unassigned.shift());
            if (unassigned.length === 0) break;
        }
    }

    if (unassigned.length > 0) {
        for (let [rn, cn] of reserves) {
            if (!cn) reserves.set(rn, unassigned.shift());
            if (unassigned.length === 0) break;
        }
    }

    if ([...claims.values()].some(cn => !cn) || [...reserves.values()].some(cn => !cn)) {
        let body = [ATTACK, ATTACK, ATTACK, CLAIM, CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE];
        let spawn = [...Object.values(Game.spawns)].find(s => s.canCreateCreep(body) == OK);
        if (spawn) spawn.createCreep(body, undefined, { role: 'COL' });
    }

    for (let [rn, cn] of claims) {
        if (!cn) continue;
        let room = Game.rooms[rn];
        let creep = Game.creeps[cn];
        if (room) {
            let status = creep.claimController(room.controller);
            creep.moveTo(room.controller);
        }
        else creep.moveTo(new RoomPosition(24, 24, rn));
    }

    for (let [rn, cn] of reserves) {
        if (!cn) continue;
        let room = Game.rooms[rn];
        let creep = Game.creeps[cn];
        if (room) {
            let status = creep.reserveController(room.controller);
            if (status == ERR_NOT_IN_RANGE) creep.moveTo(room.controller);
        }
        else creep.moveTo(new RoomPosition(24, 24, rn));
    }

    Memory.col.claims = [...claims];
    Memory.col.reserves = [...reserves];
};
