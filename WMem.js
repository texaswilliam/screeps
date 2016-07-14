/** @module WMem */

/**
 * @param {string} str
 * @returns {*}
 */
function parse(str) {
    if (!str) return null;
    return JSON.parse(str, (k, v) => {
        if (v && v.hasOwnProperty('_wmemtype')) {
            switch(v._wmemtype) {
                case 'Map': return new Map(v._wmemval);
                case 'Set': return new Set(v._wmemval);
            }
        }

        return v;
    });
}

/**
 * @param {*} x
 * @returns {string}
 */
function stringify(x) {
    if (!x) return String(x);
    return JSON.stringify(x, (k, v) => {
        if (v instanceof Map) return { _wmemtype: 'Map', _wmemval: [...v] };
        if (v instanceof Set) return { _wmemtype: 'Set', _wmemval: [...v] };

        return v;
    });
}

/** */
module.exports.load = function() {
    if (Memory._wmem) WMem = parse(Memory._wmem);
    else WMem = new Map();
    
    delete Memory._wmem;
    Object.defineProperty(Memory, '_wmem', {
        enumerable: true,
        get() { return stringify(WMem); }
    });
};
