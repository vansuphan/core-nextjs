import * as THREE from "three"
import Pool from "./Pool"
import ThreeUtils from "./ThreeUtils"
// extends THREE.Object3D

export default class Object3DExtend extends THREE.Object3D {

  constructor(props) {
    super(props);
    this.name = this.constructor.name;

  }

  #canInteract = false;
  get canInteract() { return this.#canInteract; }
  set canInteract(value) { this.#canInteract = value; }


  /**
   * Khi load 3D model từ file FBX/GLTF, các materials của children đôi khi không tương thích
   * Dùng method này để fix tạm bằng cách chuyển materials sang định dạng của THREE.js
   */
  fullyConvertMaterialsToThreeJS() {
    this.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // trick to convert FBX materials to THREE materials
        // console.log(child.material)
        var threeJsMaterials = child.material.clone()
        // dispose materials from FBX file
        child.material.dispose()
        // assign THREE materials to child objects
        child.material = threeJsMaterials
      }
    })
  }

  dispose() {
    this.clearChild();
  }

  clearChild() {
    if (!Pool.check(this)) {
      var _this = this;
      ThreeUtils.clearThree(_this);
    } else {
      Pool.reset(this);
      this.parent.remove(this);
    }
  }

  removeObjectByProperty(nameProperty, value, isRemoveCurrentObject) {
    var _this = this;

    isRemoveCurrentObject = typeof isRemoveCurrentObject == "undefined" ? false : isRemoveCurrentObject;

    if (isRemoveCurrentObject)
      if (_this[nameProperty] == value) {
        _this.parent.remove(_this);
        ThreeUtils.clearThree(_this);
        return;
      }

    for (var i = _this.children.length - 1; i >= 0; i--) {
      _this.children[i].removeObjectByProperty(nameProperty, value, true);
    }
  }

  removeObjectByName(name, isRemoveCurrentObject) {

    isRemoveCurrentObject = typeof isRemoveCurrentObject == "undefined" ? false : isRemoveCurrentObject;

    this.removeObjectByProperty("name", name, isRemoveCurrentObject);
  }

  removeObjectById(name, isRemoveCurrentObject) {

    isRemoveCurrentObject = typeof isRemoveCurrentObject == "undefined" ? false : isRemoveCurrentObject;

    this.removeObjectByProperty("id", name, isRemoveCurrentObject);
  }
}

// Object.assign(THREE.Object3D.prototype, {

//   clearChild: function () {
//     var _this = this;
//     ThreeUtils.clearThree(_this);
//   },

//   removeObjectByProperty: function (nameProperty, value, isRemoveCurrentObject) {
//     var _this = this;

//     isRemoveCurrentObject = typeof isRemoveCurrentObject == "undefined" ? false : isRemoveCurrentObject;

//     if (isRemoveCurrentObject)
//       if (_this[nameProperty] == value) {
//         _this.parent.remove(_this);
//         ThreeUtils.clearThree(_this);
//         return;
//       }

//     for (var i = _this.children.length - 1; i >= 0; i--) {
//       _this.children[i].removeObjectByProperty(nameProperty, value, true);
//     }
//   },

//   removeObjectByName: function (name, isRemoveCurrentObject) {

//     isRemoveCurrentObject = typeof isRemoveCurrentObject == "undefined" ? false : isRemoveCurrentObject;

//     this.removeObjectByProperty("name", name, isRemoveCurrentObject);
//   },

//   removeObjectById: function (name, isRemoveCurrentObject) {

//     isRemoveCurrentObject = typeof isRemoveCurrentObject == "undefined" ? false : isRemoveCurrentObject;

//     this.removeObjectByProperty("id", name, isRemoveCurrentObject);
//   },
// })