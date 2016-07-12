/** @module util */
module.exports = {
    /**
     * @param {function} fn
     * @returns {number}
     */
    time(fn) {
        if (!_.isFunction(fn)) { return undefined; }

        let start = Date.now();
        fn();
        return Date.now() - start + 'ms';
    }
};
