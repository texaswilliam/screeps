/** @module W */

function strRecursive(x, maxRecurse, recurse) {
    if (recurse > maxRecurse) return '...';

    if (x === null) return 'null';
    if (x === undefined) return 'undefined';
    if (Number.isNaN(x)) return 'NaN';
    if (typeof x === 'boolean') return x ? 'true' : 'false';
    if (typeof x === 'function') return x.toString();
    if (typeof x === 'number') return String(x);
    if (typeof x === 'string') return `'${x}'`;

    if (typeof x !== 'object') return String(x);

    if (x instanceof Array) {
        if (x.length === 0) { return '[]'; }

        let str = '[' + strRecursive(x[0], maxRecurse, recurse);
        for (let i = 1; i < x.length; ++i) str += ', ' + strRecursive(x[i], maxRecurse, recurse);
        str += ']';
        return str;
    }
    if (x instanceof Map) {
        if (x.size == 0) return 'Map {}';

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
    if (x instanceof Set) { return 'Set ' + strRecursive([...x], maxRecurse, recurse); }

    let keys = Object.keys(x);
    if (keys.length < 0) { return '{}'; }

    let str = '{\n' + '    '.repeat(recurse + 1) + keys[0] + ': ' + strRecursive(x[keys[0]], maxRecurse, recurse + 1);
    for (let i = 1; i < keys.length; ++i)
        str += ',\n' + '    '.repeat(recurse + 1) + keys[i] + ': ' + strRecursive(x[keys[i]], maxRecurse, recurse + 1);
    str += '\n' + '    '.repeat(recurse) + '}';
    return str;
}

module.exports.hashCode = function(x) {
    let str = JSON.stringify(x);
    if (!str) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; ++i) {
        let c = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + c;
        hash = hash & hash; //convert to 32-bit integer
    }
    return hash;
};

module.exports.pos2str = function(pos) { return `${pos.roomName}X${pos.x}Y${pos.y}`; };
module.exports.str2pos = function(str) {
    let m = /([EW]\d{1,2}[NS]\d{1,2})X(\d{1,2})Y(\d{1,2})/.exec(str);
    if (!m) return null;
    return new RoomPosition(parseInt(m[2]), parseInt(m[3]), m[1]);
};

/** @param {*} x */
module.exports.log = function(x) { console.log(this.str(x)); };

/** @param {*} x */
module.exports.logify = function(x) { console.log(JSON.stringify(x)); };

/**
 * @param {*} x
 * @param {number=} [maxRecurse = 3]
 * @returns {!string}
 */
module.exports.str = function(x, maxRecurse = 3) { return strRecursive(x, maxRecurse, 0); };
