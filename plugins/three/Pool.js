// import DynamicClass from './DynamicClass';
import DynamicClass from "@/components/website/pool/DynamicClass";
import ObjectExtra from "@/plugins/utils/ObjectExtra";

/**
 * CAN USE WITH Object3DExtend ONLY
 * Add new class to DynamicClass
 * How to use: 
    var item = Pool.get("ClassName");
    holder.add(item);
 */
export default class Pool {

    static list = [];

    /**
     * Get object if avaiable is Pool.list
     * Create new and Add to Pool.list if not
     * @param {string} constructorName | constructor.name
     * @returns {any}
    */

    static get(constructorName) {

        var _foundInactive = this.findInactive(constructorName);

        if (!_foundInactive) {
            _foundInactive = new DynamicClass(constructorName);
            this.add(_foundInactive);
        }
        else {
            _foundInactive._isAvaiable = false;
        }

        _foundInactive.visible = true;

        return _foundInactive;
    }


    /**
     * Check if avaiable is Pool.list
     * @param {string} constructorName | constructor.name
     * @returns {any}
    */
    static findInactive(constructorName) {

        return this.list.find(function (_child) {
            return _child.constructor.name == constructorName && !_child.visible && _child._isAvaiable;
        })
    }

    /**
     * Add item to Pool.list
     * @param {Object3D} item 
     */
    static add(item) {

        this.list.push(item);
    }


    /**
     * Reset position, rotation, scale 
     * @param {Object3D} item 
     */
    static reset(item) {

        item.position.set(0, 0, 0);
        item.rotation.set(0, 0, 0);
        item.scale.setScalar(1);
        item.visible = false;
        item._isAvaiable = true;

        return item;
    }



    /**
     * Check before dispose Object3DExtend
     * @param {Object3D} item 
     * @returns {Object3D}
     */
    static check(item) {

        var foundNeedAddToPool = ObjectExtra.toArray(DynamicClass.classes).find(function (_class) {
            return _class.name == item.constructor.name;
        })

        if (foundNeedAddToPool) {
            item = this.reset(item);
        }

        return foundNeedAddToPool;
    }



    static dispose() {
        this.list = [];
    }

}
