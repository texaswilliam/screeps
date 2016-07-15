/** @module ext_Array */

/**
 * @param {function(T=, number=, Array.<T>=)} callback
 * @template T
 * @returns {number}
 */
Array.prototype.count = function(callback) {
    if (!callback) { return this.length; }
    return this.reduce((c, t, i, a) => callback(t, i, a) ? c + 1 : c, 0);
};

Object.defineProperty(Array.prototype, 'count', { enumerable: false });
