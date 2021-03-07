import * as THREE from 'three';
import AppEvent from "./AppEvent";
import Bassic3DScene from "./components/Bassic3DScene";
import Object3DExtend from './Object3DExtend';
import ObjectManager from "./ObjectManager";
import App3D from 'plugins/three/App3D'

export const Hitbox2Event = {
    MOUSE_OVER: "mouseover",
    MOUSE_OUT: "mouseout",
    CLICK: "click",
}


export default class Hitbox2 {

    // static group = new THREE.Group();
    static group = [];

    static awake() {
        this.dispose();

        console.log(this.group);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const camera = ObjectManager.get("camera");
        const renderer = ObjectManager.get("renderer");
        // scene.add(this.group);

        let INTERSECTED;
        let intersects;

        function onMouseMove(event) {
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        }

        function onClick(e) {
            console.log("tap")

            if (INTERSECTED) INTERSECTED.dispatchEvent({ type: Hitbox2Event.CLICK, intersect: intersects[0] });

        }

        function animate() {

            // update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // calculate objects intersecting the picking ray
            // const intersects = raycaster.intersectObjects(Hitbox2.group.children);
            intersects = raycaster.intersectObjects(Hitbox2.group);

            // console.log(intersects)

            if (intersects.length > 0) {

                if (INTERSECTED != intersects[0].object) {
                    if (INTERSECTED) INTERSECTED.dispatchEvent({ type: Hitbox2Event.MOUSE_OUT });
                    INTERSECTED = intersects[0].object;
                    INTERSECTED.dispatchEvent({ type: Hitbox2Event.MOUSE_OVER });

                }

            } else {

                if (INTERSECTED) INTERSECTED.dispatchEvent({ type: Hitbox2Event.MOUSE_OUT });

                INTERSECTED = null;

            }

        }

        renderer.domElement.addEventListener('mousemove', onMouseMove, false);
        renderer.domElement.addEventListener('click', onClick, false);

        App3D.addEvent(AppEvent.BEFORE_RENDER, animate)

        // window.requestAnimationFrame(render);
    }


    /**
     * 
     * @param {(THREE.Object3D|Object3DExtend) } item 
     */
    static add(item) {
        if (item) {
            item.canInteract = true;
            this.group.push(item);
        }
    }

    /**
     * 
     * @param {(THREE.Object3D|Object3DExtend) } item 
     */
    static remove(item) {
        if (item) {
            this.group = this.group.filter((child) => {
                return child.uuid != item.uuid
            })
            item.canInteract = false;
        }
    }

    static dispose() {
        // console.log("Hitbox2 dispose... !");
        this.group = [];
    }


}
