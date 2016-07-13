/** @module W */

let _ = require('lodash');

function strRecursive(x, maxRecurse, recurse) {
    if (recurse > maxRecurse) { return '...'; }

    if (_.isArray(x)) {
        if (!_.some(x)) { return '[]'; }

        let str = '[' + strRecursive(x[0], maxRecurse, recurse);
        for (let i = 1; i < x.length; ++i) { str += ', ' + strRecursive(x[i], maxRecurse, recurse); }
        str += ']';
        return str;
    }
    if (_.isBoolean(x)) { return x ? 'true' : 'false'; }
    if (_.isFunction(x)) { return x.toString(); }
    if (_.isNumber(x)) { return String(x); }
    if (_.isNull(x)) { return 'null'; }
    if (_.isUndefined(x)) { return 'undefined'; }
    if (_.isString(x)) { return '\'' + x + '\''; }

    if (_.isObject(x) || _.isPlainObject(x)) {
        if (!_.some(x)) { return '{}'; }

        let str = '{\n' + '    '.repeat(recurse + 1);
        str += _(x).map((val, key) => key + ': ' + strRecursive(val, maxRecurse, recurse + 1)).join(',\n' + '    '.repeat(recurse + 1));
        str += '\n' + '    '.repeat(recurse) + '}';
        return str;
    }

    return String(x);
}

/** @param {*} x */
module.exports.log = function(x) { console.log(this.str(x)); };

/** @param {*} x */
module.exports.logify = function(x) { console.log(JSON.stringify(x)); };

/**
 * @param {*} x
 * @param {number} [maxRecurse = 3]
 * @returns {!string}
 */
module.exports.str = function(x, maxRecurse = 3) { return strRecursive(x, maxRecurse, 0); };
