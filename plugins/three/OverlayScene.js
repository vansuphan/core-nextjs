import * as THREE from 'three'
import Object3DExtend from 'plugins/three/Object3DExtend';
import Bassic3DScene from './components/Bassic3DScene';
import AppEvent from './AppEvent';
import ObjectManager from './ObjectManager';
import App3D from 'plugins/three/App3D'

export default class OverlayScene {
    // constructor() {

    //     this.awake()
    // }

    // awake() {
    //     if (super.awake) super.awake();
    // }

    static scene = null;
    static camera = null;

    static init() {

        let sw = window.innerWidth
        let sh = window.innerHeight;

        // initial setup
        const scene = this.scene = new THREE.Scene()
        scene.background = new THREE.Color(1, 1, 1, 1);


        // camera = new THREE.PerspectiveCamera(75, sw / sh, 0.1, 10000);
        const camera = this.camera = new THREE.OrthographicCamera(sw / -2, sw / 2, sh / 2, sh / -2, 0.1, 10000);
        camera.position.set(0, 0, 10);
        scene.add(camera);


        App3D.addEvent(AppEvent.BEFORE_RENDER, this.beforeRender);
        App3D.addEvent(AppEvent.AFTER_RENDER, this.afterRender);
        App3D.addEvent(AppEvent.RESIZE, this.resize);

        const geometry = new THREE.BoxBufferGeometry(100, 100, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x4ac341, flatShading: true });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);


    }

    static add() { 

    }

    static beforeRender() {
        // console.log(OverlayScene.scene, OverlayScene.camera)

    }

    static afterRender() {
        ObjectManager.get("renderer").render(OverlayScene.scene, OverlayScene.camera)
    }

    static resize() {
        console.log("resize!",)
        let sw = window.innerWidth
        let sh = window.innerHeight;

        const camera = OverlayScene.camera;

        camera.aspect = sw / sh;
        camera.left = sw / -2
        camera.right = sw / 2
        camera.top = sh / 2
        camera.bottom = sh / -2
        camera.updateProjectionMatrix();

        // ObjectManager.get("renderer").setSize(sw, sh)

        // renderer.setSize(sw, sh);
    }

    static dispose() {

    }

}