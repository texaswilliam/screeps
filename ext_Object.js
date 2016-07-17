/**
 * @param {Object} obj
 * @returns {Array.<Array>}
 */
Object.entries = function(obj) { return Object.keys(obj).map(k => [k, obj[k]]); };

/**
 * @param {Object} obj
 * @returns {Array}
 */
Object.values = function(obj) { return Object.keys(obj).map(k => obj[k]); };
