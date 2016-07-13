/** @module G */

/**
 * @param {string} id
 * @returns {(ConstructionSite|Creep|Mineral|Nuke|Resource|Source|Structure)}
 */
module.exports.byId = function(id) { return Game.getObjectById(id); }

/**@type {Object.<string, Creep>} */
Object.defineProperty(module.exports, 'c', { get() { return Game.creeps; } });

/**@type {Object.<string, ConstructionSite>} */
Object.defineProperty(module.exports, 'cs', { get() { return Game.constructionSites; } });

/**@type {Object.<string, Flag>} */
Object.defineProperty(module.exports, 'f', { get() { return Game.flags; } });

/**@type {Object.<string, Room>} */
Object.defineProperty(module.exports, 'r', { get() { return Game.rooms; } });

/**@type {Object.<string, Spawn>} */
Object.defineProperty(module.exports, 'sp', { get() { return Game.spawns; } });

/**@type {Object.<string, Structure>} */
Object.defineProperty(module.exports, 'st', { get() { return Game.structures; } });
