import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import ObjectManager from 'plugins/three/ObjectManager'
import asset from 'plugins/assets/asset'
import * as THREE from 'three';
import Bassic3DScene from '@/plugins/three/components/Bassic3DScene'
import AssetLoader, { AssetLoaderEvent } from '@/plugins/three/AssetLoader'
import { ConfigLive, IsProd } from '@/plugins/utils/ConfigLive'
import Pool from '@/plugins/three/Pool';
import MathExtra from '@/plugins/utils/MathExtra';
import AnotherCube from 'modules/test/AnotherCube';
import ThreeUtils from '@/plugins/three/ThreeUtils';
import OverlayScene from '@/plugins/three/OverlayScene';
import AppEvent from '@/plugins/three/AppEvent';
import DashkitButton from '@/components/dashkit/Buttons';
import { useRouter } from 'next/router';
import StatDebug from '@/plugins/three/components/StatDebug';
import { useEventEmitter } from '@umijs/hooks';
import { EventEmitter } from '@umijs/hooks/lib/useEventEmitter'


const DemoScene = props => {

    const router = useRouter();

    const rootRef = useRef()

    //Khai báo thẻ cần listen bên trên Bassic3DScene
    const initListener = useEventEmitter();
    const loadedListener = useEventEmitter();

    useEffect(() => {

        if (typeof window !== "undefined") {

        } else {
            console.log("window is not ready!!");
        }
        // cleanup
        return () => {

        }
    }, []);


    const onInit = (params) => {
        console.log("onInit")

        var list = [
            {
                url: asset("/images/textures/circle32x32.png"),
                key: "circle32x32.png"
            }
        ];

        var loader = new AssetLoader();

        loader.addEventListener(AssetLoaderEvent.START, function (e) {
            console.log("AssetLoaderEvent.START")
        })
        loader.addEventListener(AssetLoaderEvent.PROGRESS, function (e) {
            console.log("AssetLoaderEvent.PROGRESS");
            onLoading(e.percent);
        })
        loader.addEventListener(AssetLoaderEvent.ERROR, function (e) {
            console.log("AssetLoaderEvent.ERROR");
            onLoadError(e.url);
        })
        loader.addEventListener(AssetLoaderEvent.COMPLETED, function (e) {
            console.log("AssetLoaderEvent.COMPLETED")
            onLoaded();
        })

        loader.loadList(list);

    }


    const onLoaded = (params) => {

        awake();

        loadedListener.emit();
    }

    const onLoading = (params) => {
        console.log("onLoading", params)
    }

    const onLoadError = (params) => {
        console.log("onLoadError", params)
    }


    const awake = (params) => {

        console.log('awake');

        const app = Bassic3DScene.app;
        console.log("IsProd", IsProd())
        if (!IsProd()) {
            window.OB = ObjectManager;
        }

        if (app.controls) {
            app.controls.enableRotate = true;
            app.controls.minDistance = 0.0001;
            app.controls.maxDistance = 100;
        }

        start();
    }



    const start = (params) => {
        const app = Bassic3DScene.app;

        const scene = ObjectManager.get("scene");
        var holder = new THREE.Object3D();
        scene.add(holder);

        var MAX = 100;
        var holder = new THREE.Object3D();
        scene.add(holder);

        for (let i = 0; i < MAX; i++) {
            var cube = new AnotherCube();
            // var cube = Pool.get("AnotherCube");

            cube.position.set(MathExtra.randFloat(-MAX, MAX),
                MathExtra.randFloat(-MAX, MAX),
                MathExtra.randFloat(-MAX, MAX))

            holder.add(cube);
        }

        // console.log(Pool.list.length);

        setTimeout(() => {
            setInterval(() => {
                // holder.children[0].dispose();
                ThreeUtils.clearThree(holder.children[0]);
                var cube = new AnotherCube();
                // var cube = Pool.get("AnotherCube");
                cube.position.set(MathExtra.randFloat(-MAX, MAX),
                    MathExtra.randFloat(-MAX, MAX),
                    MathExtra.randFloat(-MAX, MAX))

                holder.add(cube);

                // console.log(Pool.list.length);
            }, 10);
        }, 1000);
    }


    return (
        <>

            <style jsx>{`
                .buttonHolder{
                    position: absolute;
                    top: 0px;
                }            
                .root{

                }
            `}</style>

            <StatDebug
                initListener={initListener}
            />

            <div className="root" ref={rootRef}>
                <Bassic3DScene
                    initListener={initListener}
                    onInit={onInit}

                    transparent={false}
                    lightEnabled={true}
                    controlEnabled={true}
                    gridEnabled={true}
                />
            </div>

            <div className="buttonHolder">
                <DashkitButton onClick={() => router.push("/examples")}>VIEW EXAMPLES</DashkitButton>
            </div>


        </>

    )
}


DemoScene.propTypes = {

}

export default DemoScene
