import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import gsap from 'gsap';
import ObjectManager from './ObjectManager';
import ThreeUtils from './ThreeUtils';
import AppEvent from './AppEvent';


const App3D = forwardRef(({
    scene, camera, renderer,
    directLight, ambientLight,
    grid, axes,
    directLightHelper,
    controls,
    lastCalledTime,
    eventListeners = [],
    clock = new THREE.Clock(),
    req,
    ...props }, ref) => {

    const [isInit, setisInit] = useState(false)

    const holderRef = useRef(null)

    useEffect(() => {
        // effect
        init()
        return () => {
            // cleanup
            _dispose();
        }
    }, [])


    App3D.scene = scene;
    App3D.camera = camera;
    App3D.renderer = renderer;
    App3D.controls = controls;

    App3D.addEvent = _addEvent;
    App3D.removeEvent = _removeEvent;
    App3D.hideImmediately = _hideImmediately;
    App3D.showImmediately = _showImmediately;
    App3D.hide = _hide;
    App3D.show = _show;
    App3D.hideGrid = _hideGrid;
    App3D.showGrid = _showGrid;
    App3D.toggleGrid = _toggleGrid;
    App3D.enableControl = _enableControl;
    App3D.disableControl = _disableControl;
    App3D.dispose = _dispose;


    const init = (params) => {

        if (typeof window == "undefined") return;

        if (isInit) return;
        setisInit(true);

        props = props || {};
        let transparent = props.hasOwnProperty("transparent") ? props["transparent"] : false;
        let controlEnabled = props.hasOwnProperty("controlEnabled") ? props["controlEnabled"] : true;
        let lightEnabled = props.hasOwnProperty("lightEnabled") ? props["lightEnabled"] : true;
        let gridEnabled = props.hasOwnProperty("gridEnabled") ? props["gridEnabled"] : true;

        let sw = window.innerWidth
        let sh = window.innerHeight;

        // initial setup
        scene = new THREE.Scene();
        scene.background = null;
        
        camera = new THREE.PerspectiveCamera(75, sw / sh, 0.1, 10000);
        camera.position.set(0, 200, 500);
        scene.add(camera)

        // camera.lookAt(scene.position)

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: transparent });
        renderer.setPixelRatio(window ? window.devicePixelRatio : 1);
        renderer.setSize(sw, sh);

        if (holderRef.current) holderRef.current.appendChild(renderer.domElement);
        renderer.domElement.style.outline = "none"
        renderer.domElement.style.position = "absolute"
        renderer.domElement.style.top = "0px"
        renderer.domElement.style.left = "0px"

        renderer.domElement.oncontextmenu = function (e) {
            e.preventDefault();
        };


        // lights
        if (lightEnabled) {
            directLight = new THREE.DirectionalLight("#fff")
            directLight.position.set(500, 1000, 500)
            scene.add(directLight)

            ambientLight = new THREE.AmbientLight("#fff", 0.4)
            scene.add(ambientLight)
        }

        // helpers
        if (gridEnabled) {
            directLightHelper = new THREE.DirectionalLightHelper(directLight, 10)
            scene.add(directLightHelper)

            grid = new THREE.GridHelper(200, 20)
            grid.material.transparent = true
            grid.material.opacity = 0.8
            scene.add(grid)

            axes = new THREE.AxesHelper(1000)
            scene.add(axes)
        }

        if (controlEnabled) {
            controls = new OrbitControls(camera, renderer.domElement)
            controls.minDistance = 10;
            controls.maxDistance = 990;
        }

        // resize
        if (window) {
            // console.log("init resize!")
            onResize()
            window.addEventListener("resize", onResize)
        }

        function onResize(e) {
            // console.log("resize!")
            sw = window.innerWidth;
            sh = window.innerHeight;

            scene.dispatchEvent({ type: AppEvent.RESIZE, sw, sh });

            camera.aspect = sw / sh
            camera.updateProjectionMatrix();

            renderer.setSize(sw, sh)
        }

        // render
        animate()
        function animate(time) {
            req = requestAnimationFrame(animate);
            let deltaTime = clock.getDelta();
            let delta = (new Date() - lastCalledTime) / 1000;
            let fps = 1 / delta;
            lastCalledTime = new Date()

            if (controls && controls.enabled) controls.update();

            scene.dispatchEvent({ type: AppEvent.BEFORE_RENDER, delta, fps, time });

            renderer.render(scene, camera);

            scene.dispatchEvent({ type: AppEvent.AFTER_RENDER, delta, fps, time });

        }

        // let list = [];
        // setapp([renderer.domElement])
        // container.appendChild(renderer.domElement);

        ObjectManager.add("scene", scene);
        ObjectManager.add("camera", camera);
        ObjectManager.add("renderer", renderer);
        ObjectManager.add("controls", controls);

        if (props.appInit) props.appInit();

    }


    function _addEvent(event, listener) {
        if (!scene) scene = ObjectManager.get("scene");
        scene.addEventListener(event, listener);
    }

    function _removeEvent(event, listener) {
        if (!scene) scene = ObjectManager.get("scene")
        scene.removeEventListener(event, listener);
    }


    function _hideImmediately() {
        renderer.domElement.style.display = "none"
    }

    function _showImmediately() {
        renderer.domElement.style.display = "block"
    }

    /**
     * @param  {number} duration
     */
    function _hide(duration) {
        gsap.to(renderer.domElement, { duration: duration || 0.5, autoAlpha: 0, ease: "sine.in" })
    }
    /**
     * @param  {number} duration
     */
    function _show(duration) {
        gsap.to(renderer.domElement, { duration: duration || 0.5, autoAlpha: 1, ease: "sine.out" })
    }

    function _hideGrid() {
        if (grid) grid.visible = false
        if (axes) axes.visible = false
    }

    function _showGrid() {
        if (grid) grid.visible = true
        if (axes) axes.visible = true
    }

    function _toggleGrid() {
        if (grid) grid.visible = !grid.visible
        if (axes) axes.visible = !axes.visible
    }

    function _enableControl() {
        if (controls) controls.enabled = true;
    }

    function _disableControl() {
        if (controls) controls.enabled = false;
    }

    function _dispose() {
        console.log("dispose...");

        window.cancelAnimationFrame(req);

        ThreeUtils.clearThree(scene)

        try {
            renderer.forceContextLoss();
            renderer.context = null;
            renderer.domElement = null;
        } catch (error) {

        }

        if (holderRef.current) while (holderRef.current.firstChild) {
            holderRef.current.removeChild(holderRef.current.firstChild);
        }

        ObjectManager.dispose();
    }


    return (

        <>
            <style jsx>{`
                .holderRef{
                
                }
            `}</style>
            <div ref={holderRef}>

            </div>

        </>
    )
})

App3D.propTypes = {
    appInit: PropTypes.func,

}

export default App3D
