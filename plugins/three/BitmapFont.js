import * as THREE from 'three';
import Object3DExtend from 'plugins/three/Object3DExtend'
import Pool from 'plugins/three/Pool';
import AssetLoader, { AssetLoaderEvent } from './AssetLoader';
import UrlUtils from '../utils/UrlUtils';
import AssetManager from './AssetManager';

global.THREE = require('three')
const createGeometry = require('three-bmfont-text')

export const TEXT_ALIGN = {
    CENTER: "center",
    LEFT: "left",
    RIGHT: "right",
}

/**
 * NEED ADD CLASS BitmapFont TO pool/DynamicClass
 */
export default class BitmapFont extends Object3DExtend {

    /**
     * 
     * @param {Object} [props = {}]
     * @param {string} [props.text] - "TEXT"
     * @param {string} props.fontUrl - ""
     * @param {string} props.fontName - ""
     * @param {number} props.fontSize - 100
     * @param {number} props.width - 512
     * @param {number} props.height - 512
     * @param {string} props.anchor - left
     * @param {string} props.align - center
     * @param {string} props.color - color
     * @param {string} props.showPlane - debug
     * 
     */
    constructor(props) {
        super(props);
        this.props = props || {};

        this.DEFAULT_FONT_SIZE = 100;

        if (Pool.findInactive(this.constructor.name)) {
            return Pool.get(this.constructor.name);
        } else {
            Pool.add(this);
            this.#awake();
        }

    }

    #awake() {
        const scope = this;



        const loader = new AssetLoader();

        loader.addEventListener(AssetLoaderEvent.START, function (e) {
            console.log("AssetLoaderEvent.START")
        })
        loader.addEventListener(AssetLoaderEvent.PROGRESS, function (e) {
            console.log("AssetLoaderEvent.PROGRESS");
            // onLoading(e.percent);
        })
        loader.addEventListener(AssetLoaderEvent.ERROR, function (e) {
            console.log("AssetLoaderEvent.ERROR");
            // onLoadError(e.url);
        })
        loader.addEventListener(AssetLoaderEvent.COMPLETED, function (e) {
            console.log("AssetLoaderEvent.COMPLETED")
            // onLoaded();

            scope.start();

        })

        loader.loadBitmapFont(scope.props.fontUrl)
    }

    start() {
        // console.log("123");
        const holder = new THREE.Object3D();
        this.add(holder);

        const props = this.props;

        const showPlane = props.hasOwnProperty("showPlane") ? props['showPlane'] : false;

        const fontName = props.fontName || UrlUtils.getFileNameWithExtension(props.fontUrl);

        const font = AssetManager.get(fontName);
        const fontSize = props.fontSize;

        const textureName = UrlUtils.getFileNameWithoutExtension(props.fontUrl);
        const texture = AssetManager.get(textureName);

        const width = props.width || 512;
        const height = props.height || 512;
        const align = props.align || 'left';
        const anchor = props.anchor || 'left';
        const color = props.color || 0xffffff;

        
        let posX = 0;
        switch (anchor) {
            case TEXT_ALIGN.LEFT:
                posX = 0;
                break;

            case TEXT_ALIGN.CENTER:
                posX = -width / 2;
                break;

            case TEXT_ALIGN.RIGHT:
                posX = -width;
                break;

            default:
                break;
        }




        //


        const geometry = this.geometry = createGeometry({
            width: width,
            height: height,
            align: align,
            font: font
        })

        // change text and other options as desired
        // the options sepcified in constructor will
        // be used as defaults
        geometry.update(props.text)

        // // the resulting layout has metrics and bounds
        // console.log(geometry.layout.height)
        // console.log(geometry.layout.descender)
        const material = this.material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            color: color,
            side: THREE.DoubleSide,
        })


        // now do something with our mesh!
        const mesh = this.mesh = new THREE.Mesh(geometry, material)
        mesh.scale.y = -1;


        //DEBUG
        if (showPlane) {
            const geometry2 = new THREE.PlaneBufferGeometry(width, height, 4);
            const material2 = new THREE.MeshPhongMaterial({ color: 0x4ac341, flatShading: true });
            const plane = new THREE.Mesh(geometry2, material2);
            plane.position.x = width / 2;
            plane.position.x += posX;
            holder.add(plane);
        }


        mesh.position.x += posX;

        const scale = fontSize / this.DEFAULT_FONT_SIZE;
        holder.scale.setScalar(scale);

        holder.add(mesh);

    }

    /**
     * 
     * @param {string} text 
     */
    updateText(text) {
        this.geometry.update(text);

    }

}