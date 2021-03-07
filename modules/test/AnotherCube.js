import * as THREE from 'three';
import Object3DExtend from 'plugins/three/Object3DExtend'
import Pool from 'plugins/three/Pool';

/**
 * NEED ADD CLASS AnotherCube TO pool/DynamicClass
 */
export default class AnotherCube extends Object3DExtend {

    constructor(props) {
        super(props);

        if (Pool.findInactive(this.constructor.name)) {
            return Pool.get(this.constructor.name);
        } else {
            Pool.add(this);
            this.awake();
        }
    }

    awake() {

        const geometry = new THREE.BoxBufferGeometry(10, 10, 10);
        const material = new THREE.MeshPhongMaterial({ color: 0x4ac341, flatShading: true });
        const cube = new THREE.Mesh(geometry, material);
        this.add(cube);

    }
}