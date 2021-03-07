
const ArrayExtra = {
    /**
     * 
     * @param {Array} array 
     * @param {string} key 
    * @returns {Number} 
    */
    sum(array, key) {
        if (!array) {
            console.warning("ARRAY NOT EXITED !")
            return 0;
        }
        if (key) return array.reduce((c, v) => c + v[key], 0);
        else return array.reduce((c, v) => c + v, 0);
    },

    /**
    * 
    * @param {Array} array 
    * @param {string} key 
    * @returns {Number} 
    */
    average(array, key) {
        if (!array) {
            console.warning("ARRAY NOT EXITED !")
            return 0;
        }
        return (this.sum(array, key) / array.length) || 0;
    },

    /**
     * 
     * @param {Array} array 
     * @param {string} key 
     * @returns {Number} 
    */
    min(array, key) {
        if (!array) {
            console.warning("ARRAY NOT EXITED !")
            return 0;
        }
        if (key) return array.reduce((c, v) => (c < v[key] ? c : v[key]));
        else return array.reduce((c, v) => (c < v[key] ? c : v[key]));
    },

    /**
   * 
   * @param {Array} array 
   * @param {string} key 
   * @returns {Number} 
   */
    max(array, key) {
        if (!array) {
            console.warning("ARRAY NOT EXITED !")
            return 0;
        }
        if (key) return array.reduce((c, v) => (c > v[key] ? c : v[key]));
        else return array.reduce((c, v) => (c > v[key] ? c : v[key]));
    },

    /**
     * 
     * @param {Array} array 
     * @param {string} key 
     * @returns {Array} 
     */
    sortElementByString(array, key) {
        return array.sort((x, y) => {
            let a = x[key].toUpperCase(),
                b = y[key].toUpperCase();
            return a == b ? 0 : a > b ? 1 : -1;
        })
    },

    /**
     * 
     * @param {Array} array 
     * @param {string} key 
     * @returns {Array} 
     */
    sortElementByNumber(array, key) {
        return array.sort((a, b) => {
            return a[key] - b[key];
        });
    }


}

export default ArrayExtra;

