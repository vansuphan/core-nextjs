import ArrayExtra from "./ArrayExtra";

export default class ObjectExtra {

    static getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    static randomValue(obj) {
        return obj[this.randomKey(obj)];
    }

    static randomKey(obj) {
        var keys = Object.keys(obj);
        return keys[keys.length * Math.random() << 0];
    }

    static randomElementIndex(obj) {
        var keys = Object.keys(obj)
        return keys.length * Math.random() << 0;
    }

    static getObjectLength(obj) {
        var keys = Object.keys(obj)
        return keys;
    }

    
    /**
     * 
     * @param {Object} obj 
     * @param {Function} cb 
     */
    static forEach(obj, cb) {
        const list = Object.keys(obj);

        list.map((item, index) => {
            if (cb) cb(item, index)
        })
    }

    /**
     * 
     * @param {Object} object 
     * @returns {Array} list keys
     */
    static toArray(obj) {
        let array = [];
        for (const key in obj) {
            array.push(obj[key]);
        }
        return array;
    }

    /**
     * 
     * @param {Object} object 
     * @returns {Object} 
     */
    static sortObjectByKey(object) {
        let array = [];

        for (const key in object) {
            array.push({
                key: key,
                value: object[key]
            });
        }

        array = ArrayExtra.sortElementByString(array, "key")

        let result = {};

        array.forEach((item) => {
            result[item.key] = item.value;
        })

        return result;
    }


    //

    static isNull(object) {
        return object === null;
    }

    static toBool(object) {
        if (this.isNull(object)) return false;
        object = object.toString();

        return object === "true" || object == "1";
    }

    static toInt(object) {
        if (this.isNull(object)) return 0;
        object = object.toString();

        return parseInt(object, 10);
    }

    static toFloat(object) {
        if (this.isNull(object)) return 0;
        object = object.toString();

        return parseFloat(object);
    }

};
