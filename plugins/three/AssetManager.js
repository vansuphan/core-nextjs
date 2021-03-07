export default class AssetManager {

  static list = new Map();

  constructor() {
  }


  // static functions
  /**
   * @returns {AssetManager}
   */

  /**
   * @returns {Map}
   */
  static all() {
    return this.list;
  }

  /**
   * @param  {string} key
   * @returns {THREE.Object3D}
   */
  static find(key) {
    return this.list.get(key);
  }

  /**
   * @param  {string} key
   * @returns {THREE.Object3D}
   */
  static get(key) {
    return this.find(key)
  }

  static set(key, object) {
    return this.list.set(key, object);
  }

  /**
   * @param  {string} key
   * @param  {THREE.Object3D} object
   * @param  {string} url
   */
  static addObject(key, object, url) {
    if (object.traverse)
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });

    object.name = url;
    this.list.set(key, object);
  }



}
