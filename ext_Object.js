/**
 * @param {Object.<K, V>} obj
 * @returns {Array.<Array.<(K|V)>>}
 * @template K, V
 */
Object.entries = function*(obj) { for (let key in obj) if (obj.hasOwnProperty(key)) yield [key, obj[key]]; };

/**
 * @param {Object.<K, V>} obj
 * @returns {Map.<K, V>}
 * @template K, V
 */
Object.toMap = function(obj) {
    let map = new Map();
    for (let key in obj) if (obj.hasOwnProperty(key)) map.set(key, obj[key]);
    return map;
};

/**
 * @param {Object.<*, V>} obj
 * @returns {Array.<V>}
 * @template V
 */
Object.values = function*(obj) { for (let key in obj) if (obj.hasOwnProperty(key)) yield obj[key]; };
