import * as THREE from 'three'
import { LineBasicMaterial, LineDashedMaterial, Material, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial, PointsMaterial, RawShaderMaterial, ShaderMaterial, ShadowMaterial, SpriteMaterial, MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial, MeshMatcapMaterial } from 'three';
import UrlUtils from '../utils/UrlUtils';
import AssetLoader, { AssetLoaderEvent } from './AssetLoader';
import AssetManager from './AssetManager';
import Timer from 'plugins/utils/Timer';
export default class MaterialExtra {


    static list = [];

    static isLoading = false;

    /**
     * 
     * @param {Object} options 
     * @param {string} options.textureUrl 
     * @param {string} options.constructorName 
     * @param {boolean} options.isFixTexture 
     * @param {Object} options.params 
     */
    static async getSharingMaterialByTextureName(options) {
        options = options || {};

        const textureUrl = options.hasOwnProperty("textureUrl") ? options["textureUrl"] : "";
        const constructorName = options.hasOwnProperty("constructorName") ? options["constructorName"] : "";
        const isFixTexture = options.hasOwnProperty("isFixTexture") ? options["isFixTexture"] : false;
        const params = options.hasOwnProperty("params") ? options["params"] : {};

        const key = options['key'] = options['key'] ? options['key'] : UrlUtils.getFileNameWithExtension(textureUrl);

        if (MaterialExtra.isLoading) {
            await Timer.wait(100);
            return this.getSharingMaterialByTextureName(options)
        }
        let found = this.list.find((item) => {
            if (!item.map) return null;
            return item.map.key == key;
        })

        if (found) {

        } else {
            found = this.createMaterial(options);
            this.add(found);
        }


        return found;
    }


    /**
     * 
     * @param {Object} options 
     * @param {string} options.textureUrl 
     * @param {string} options.constructorName 
     * @param {boolean} options.isFixTexture 
     * @param {Object} options.params 
     */
    static createMaterial(options) {
        console.log("createMaterial")
        options = options || {};

        const textureUrl = options.hasOwnProperty("textureUrl") ? options["textureUrl"] : "";
        let constructorName = options.hasOwnProperty("constructorName") ? options["constructorName"] : "";
        const isFixTexture = options.hasOwnProperty("isFixTexture") ? options["isFixTexture"] : false;
        const params = options.hasOwnProperty("params") ? options["params"] : {};
        const key = options.hasOwnProperty("key") ? options["key"] : UrlUtils.getFileNameWithExtension(textureUrl);

        constructorName = constructorName.replace("THREE.", "");

        const material = new this.classes[constructorName](params);

        // const textureKey = UrlUtils.getFileNameWithExtension(textureUrl)

        const loader = new AssetLoader();

        loader.addEventListener(AssetLoaderEvent.ERROR, function (e) {
            console.log('AssetLoaderEvent.ERROR', e);

            MaterialExtra.isLoading = false;
        })
        loader.addEventListener(AssetLoaderEvent.COMPLETED, function (e) {
            MaterialExtra.isLoading = false;

            console.log('AssetLoaderEvent.COMPLETED')

            material.map = AssetManager.get(key);
            material.map.key = key;

            if (isFixTexture) {
                MaterialExtra.fixTexture(material.map)
            }
        })

        MaterialExtra.isLoading = true;

        console.log(key);
        loader.loadOnce(textureUrl, key);

        return material;
    }


    /**
     * 
     * @param {THREE.Material} material 
     */
    static add(material) {
        this.list.push(material);
    }


    static fixTexture(map) {
        map.offset.set(0, 1)
        map.repeat.set(1, -1)
    }


    /**
     * Add new class for pool here
     */
    static classes = {
        LineBasicMaterial,
        LineDashedMaterial,
        Material,
        MeshBasicMaterial,
        MeshDepthMaterial,
        MeshDistanceMaterial,
        MeshLambertMaterial,
        MeshMatcapMaterial,
        MeshNormalMaterial,
        MeshPhongMaterial,
        MeshPhysicalMaterial,
        MeshStandardMaterial,
        MeshToonMaterial,
        PointsMaterial,
        RawShaderMaterial,
        ShaderMaterial,
        ShadowMaterial,
        SpriteMaterial
    };

}
