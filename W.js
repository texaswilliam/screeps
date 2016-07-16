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
    if (x instanceof Map) {
        if (x.size == 0) return str + 'Map {}';

        let str = 'Map {\n' + '    '.repeat(recurse + 1);
        let [[k, v], ...rest] = x;
        str += k + ': ' + strRecursive(v, maxRecurse, recurse + 1);
        for (let [k, v] of rest) {
            str += ',\n' + '    '.repeat(recurse + 1);
            str += k + ': ' + strRecursive(v, maxRecurse, recurse + 1);
        }
        str += '\n' + '    '.repeat(recurse) + '}';
        return str;
    }
    if (_.isNumber(x)) { return String(x); }
    if (_.isNull(x)) { return 'null'; }
    if (_.isUndefined(x)) { return 'undefined'; }
    if (x instanceof Set) { return 'Set ' + strRecursive([...x], maxRecurse, recurse); }
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

module.exports.pos2str = function(pos) { return `${pos.roomName}X${pos.x}Y${pos.y}`; }
module.exports.str2pos = function(str) {
    let m = /([EW]\d{1,2}[NS]\d{1,2})X(\d{1,2})Y(\d{1,2})/.exec(str);
    if (!m) return null;
    return new RoomPosition(parseInt(m[2]), parseInt(m[3]), m[1]);
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
