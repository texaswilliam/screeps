/** @module util */

let _ = require('lodash');

/**
 * @param {function} fn
 * @returns {(number|undefined)} number of milliseconds required to execute <tt>fn()</tt> or <tt>undefined</tt> if <tt>fn</tt>
 * isn't a function.
 */
module.exports.time = function(fn) {
    if (!_.isFunction(fn)) { return undefined; }

    let start = Date.now();
    fn();
    return Date.now() - start;
};
