_.defaultsDeep(Memory, {
    obs: []
});

module.exports.run = function() {
    /** @type {Set.<string>} */
    let creeps = new Set([...Object.values(Game.creeps)].filter(c => c.memory.role === 'OBS').map(c => c.name));

    /** @type {Map.<string, string>} */
    let obs = new Map(Memory.obs);

    for (let [posstr, cn] of obs) if (!creeps.has(cn)) obs.set(posstr, null);

    /** @type {Set.<string>} */
    let assigned = new Set([...obs.values()].filter(cn => !!cn));

    /** @type {Set.<string>} */
    let unassigned = [...creeps].filter(cn => !assigned.has(cn));

    if (unassigned.length > 0) {
        for (let [posstr, cn] of obs) {
            if (!cn) obs.set(posstr, unassigned.shift());
            if (unassigned.length === 0) break;
        }
    }

    if ([...obs.values()].some(cn => !cn)) {
        let body = [MOVE];
        let spawn = [...Object.values(Game.spawns)].find(s => s.canCreateCreep(body) == OK);
        if (spawn) spawn.createCreep(body, undefined, { role: 'OBS' });
    }

    for (let [posstr, cn] of obs) {
        if (!cn) continue;
        let pos = W.str2pos(posstr);
        let creep = Game.creeps[cn];
        creep.moveTo(pos);
    }

    Memory.obs = [...obs];
};
