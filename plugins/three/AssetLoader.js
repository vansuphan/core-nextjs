import { EventDispatcher } from "three";
import { Object3D, LoadingManager, TextureLoader, AudioLoader, CubeTextureLoader, FileLoader } from "three"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import UrlUtils from "../utils/UrlUtils";
import AssetManager from "./AssetManager";

const loadFont = require('load-bmfont');

export const AssetLoaderEvent = {
    START: "start",
    COMPLETED: "completed",
    PROGRESS: "progress",
    ERROR: "error",
}

export default class AssetLoader extends EventDispatcher {

    // #privateField = 'test';

    #cubeImagesRLTBFB = [
        'right.jpg', // px
        'left.jpg', // nx
        'top.jpg', // py
        'bottom.jpg', // ny
        'front.jpg', // pz
        'back.jpg', // nz
    ];

    #cubeImagesXYZ = [
        'px.jpg',
        'nx.jpg',
        'py.jpg',
        'ny.jpg',
        'pz.jpg',
        'nz.jpg',
    ];

    constructor() {
        super();

        const scope = this;

        const manager = this.manager = new LoadingManager();
        this.dracoLoader = new DRACOLoader();

        manager.onStart = function (url, itemsLoaded, itemsTotal) {

            scope.dispatchEvent({ type: AssetLoaderEvent.START });

        };


        manager.onLoad = function () {

            scope.dispatchEvent({ type: AssetLoaderEvent.COMPLETED });
            // console.log('Loading complete!');
        };


        manager.onProgress = function (url, itemsLoaded, itemsTotal) {

            const percent = parseFloat(itemsLoaded) / parseFloat(itemsTotal)
            // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

            scope.dispatchEvent({ type: AssetLoaderEvent.PROGRESS, percent: percent });
        };

        manager.onError = function (url) {

            scope.dispatchEvent({ type: AssetLoaderEvent.ERROR, url });
            // console.log('There was an error loading ' + url);

        };
        // console.log(this.#privateField);
    }

    /**
     * 
        * @param {Object[]} list - The employees who are responsible for the project.
        * @param {string} list[].url - The name of an employee.
        * @param {string} list[].key - The employee's department.
     */
    loadList(list) {
        list.map((item) => {
            const url = item.url || "";
            const key = item.key || null;
            this.load(url, key)
        })
    }


    /**
     * 
     * @param {string} url 
     * @param {string} key 
     */
    load(url, key, type) {
        key = key || UrlUtils.getFileNameWithExtension(url);

        let loader;
        if (key.indexOf('cube_map') != -1) {
            loader = new CubeTextureLoader(this.manager);
            loader.setPath(url);
            if (key.indexOf("_xyz") != -1) {
                loader.load(this.#cubeImagesXYZ, onItemLoaded);
            } else {
                loader.load(this.#cubeImagesRLTBFB, onItemLoaded);
            }
        } else {
            var fileExt = type || UrlUtils.getFileExtension(url);
            switch (fileExt) {
                case 'fbx':
                    loader = new FBXLoader(this.manager);
                    break;

                case 'svg':
                    loader = new SVGLoader(this.manager);
                    break;

                case 'glb':
                    loader = new GLTFLoader(this.manager);
                    break;

                case 'gltf':
                    loader = new GLTFLoader(this.manager);
                    loader.setDRACOLoader(this.dracoLoader)
                    loader.dracoLoader.setDecoderPath("/draco/gltf/")
                    break;

                case 'obj':
                    loader = new OBJLoader(this.manager);
                    break;

                case 'mp3':
                    loader = new AudioLoader(this.manager);
                    break;

                case 'jpg':
                    loader = new TextureLoader(this.manager);
                    break;

                case 'png':
                    loader = new TextureLoader(this.manager);
                    break;

                default:
                    loader = new FileLoader(this.manager);
                    break;
            }
            loader.load(url, onItemLoaded, undefined, onItemError);
        }


        function onItemError(e) {
            console.error("LOADING ERROR !")
            console.log(e);
            // console.log("[Assets] Error " + e.target.status + ": " + e.target.statusText);
        }

        function onItemLoaded(object) {
            // console.log("onItemLoaded");
            // console.log(object);

            var obj3d;
            if (typeof object.scene != 'undefined') {
                // console.log (object);
                var holder = new Object3D();
                holder.add(object.scene);
                // object.scene.scale.setScalar(100);
                obj3d = holder;
                if (typeof object.animations != 'undefined') {
                    obj3d.animations = object.animations;
                }
                if (typeof object.assets != 'undefined') {
                    obj3d.assets = object.assets;
                }
                if (typeof object.parser != 'undefined') {
                    obj3d.parser = object.parser;
                }
            } else {
                obj3d = object;
            }

            AssetManager.addObject(key, obj3d, url)
            // AssetManager.set(key, obj3d)

        }

    }

    /**
     * 
     * @param {string} url 
     * @param {string} key 
     */

    loadOnce(url, key, type) {
        key = key || UrlUtils.getFileNameWithExtension(url);

        const scope = this;

        if (this.checkExited(key)) {
            scope.dispatchEvent({ type: AssetLoaderEvent.COMPLETED });
            return;
        }

        return this.load(url, key, type);
    }


    /**
     * 
     * @param {string} key 
     */
    checkExited(key) {
        return AssetManager.get(key);
    }


    /**
     * 
     * @param {string} url 
     * @param {string} key 
     */
    loadBitmapFont(url, key) {
        const scope = this;
        key = key || UrlUtils.getFileNameWithExtension(url);

        if (this.checkExited(key)) {
            scope.dispatchEvent({ type: AssetLoaderEvent.COMPLETED });
            return;
        }

        var fileExt = UrlUtils.getFileExtension(url);

        switch (fileExt) {
            case 'fnt':

                loadFont(url, function (err, font) {

                    const textureUrl = url.replace(`.${fileExt}`, "");
                    scope.loadOnce(textureUrl, UrlUtils.getFileNameWithExtension(textureUrl), "png");

                    AssetManager.addObject(key, font, url)

                    return;
                })

                break;

            default:
                break;
        }

    }





}
