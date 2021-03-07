//	Polyfills

/*


Array
    prototype:
        first
        last
        randomIndex
        randomElement

    method:
        getRandom
        getHalfRandom
        shuffle
        moveIndex

String
    prototype:
        isEmpty
        replaceAt

*/


Object.defineProperties(Array.prototype, {

    first: { get: function () { if (this.length || this.length > 0) return this[0]; return null; }, },

    last: { get: function () { if (this.length || this.length > 0) return this[this.length - 1]; return null; }, },

    randomIndex: { get: function () { return Math.floor(Math.random() * this.length); }, },

    randomElement: { get: function () { return this[Math.floor(Math.random() * this.length)]; }, },

});



Object.assign(Array.prototype, {

    /**
     * Get an array with shuffle element
     * @param {Number} n 
     * @returns {Array}
     */
    getRandom: function (n) {
        var result = new Array(n),
            len = this.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = this[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    },

    /**
     * Get an array with shuffle element
     * @param {Number} n 
     * @returns {Array}
     */
    getHalfRandom: function () {
        var n = Math.ceil(this.length / 2);
        return this.getRandom(n);
    },


    /**
     * @returns {Array}
     */
    shuffle: function () {
        var i = this.length, j, temp;
        if (i == 0) return this;
        while (--i) {
            j = Math.floor(Math.random() * (i + 1));
            temp = this[i];
            this[i] = this[j];
            this[j] = temp;
        }
        return this;
    },

    /**
     * 
     * @param {Number} oldIndex 
     * @param {Number} newIndex 
     * @returns {Array}
     */
    moveIndex: function (oldIndex, newIndex) {
        // return Math.floor(Math.random() * this.length);
        if (newIndex >= this.length) {
            var k = newIndex - this.length + 1;
            while (k--) {
                this.push(undefined);
            }
        }
        this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
        return this; // for testing
    },
})



Object.assign(String.prototype, {

    isEmpty: function () { return this === null || this.match(/^ *$/) !== null; },
    replaceAt: function () { return this.substr(0, index) + replacement + this.substr(index + replacement.length); },

})
