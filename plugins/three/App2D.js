import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

import AppEvent from "./AppEvent"
import ThreeUtils from "./ThreeUtils";

/**
 * App2D but in 3D :| base on App3D with OrthographicCamera
 */
export default function App2D(
    {
        container,
        controlEnabled = true,
        lightEnabled = true,
        gridEnabled = true,
        transparent = true
    }
) {
    var scene, camera, renderer
    var directLight, ambientLight, pointLight
    var grid, axes
    var directLightHelper, pointLightHelper
    var controls
    var lastCalledTime
    var eventListeners = []
    var clock = new THREE.Clock();

    var scope = this;

    var sw = container.clientWidth;
    var sh = container.clientHeight;

    // initial setup
    scene = new THREE.Scene()
    scene.background = new THREE.Color(1, 1, 1, 1);

    // camera = new THREE.PerspectiveCamera(75, sw / sh, 0.1, 10000);
    camera = new THREE.OrthographicCamera(sw / -2, sw / 2, sh / 2, sh / -2, 0.1, 10000);
    camera.position.set(0, 200, 1750);
    scene.add(camera)

    // camera.lookAt(0,0,0)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, });
    renderer.setPixelRatio(window ? window.devicePixelRatio : 1);
    renderer.setSize(sw, sh);

    container.appendChild(renderer.domElement);

    // lights
    if (lightEnabled) {
        directLight = new THREE.DirectionalLight("#fff", .5)
        directLight.position.set(0, 0, 500)
        scene.add(directLight)

        ambientLight = new THREE.AmbientLight("#fff", 0.4)
        scene.add(ambientLight)
    }

    // helpers
    if (gridEnabled) {
        directLightHelper = new THREE.DirectionalLightHelper(directLight, 10)
        scene.add(directLightHelper)

        grid = new THREE.GridHelper(20000, 2000)
        grid.material.transparent = true
        grid.material.opacity = 0.8
        scene.add(grid)

        axes = new THREE.AxesHelper(1000)
        scene.add(axes)
    }

    if (controlEnabled) {
        controls = new OrbitControls(camera, container)
        controls.minDistance = 10;
        controls.maxDistance = 990;
    }

    // resize
    setTimeout(() => {
        if (window) {
            // console.log("init resize!")
            onResize()
            window.addEventListener("resize", onResize)
        }
    }, 1000);
    onResize()


    function onResize(e) {
        console.log("resize!",)
        sw = container.clientWidth
        sh = container.clientHeight
        console.log(sw, sh)

        camera.aspect = sw / sh;
        camera.left = sw / -2
        camera.right = sw / 2
        camera.top = sh / 2
        camera.bottom = sh / -2
        camera.updateProjectionMatrix();

        eventListeners.forEach((evt) => {
            if (evt.event == AppEvent.RESIZE) evt.listener({ sw, sh })
        })


        renderer.setSize(sw, sh);
        renderer.render(scene, camera);



    }


    // render
    let req;
    animate()
    function animate() {
        req = requestAnimationFrame(animate);
        var deltaTime = clock.getDelta();
        var delta = (new Date() - lastCalledTime) / 1000;
        var fps = 1 / delta;
        lastCalledTime = new Date()

        if (controls && controls.enabled) controls.update();

        // console.log(mesh)
        // mesh.rotation.y += 0.01
        if (scope.onAnimate) scope.onAnimate({ deltaTime, fps })

        eventListeners.forEach((evt) => {
            if (evt.event == AppEvent.BEFORE_RENDER) evt.listener({ delta, fps })
        })

        renderer.render(scene, camera);

        // inset scene
        renderer.clearDepth(); // important!

        eventListeners.forEach((evt) => {
            if (evt.event == AppEvent.AFTER_RENDER) evt.listener({ delta, fps })
        })
    }

    function addEvent(event, listener) {
        if (Object.values(AppEvent).indexOf(event) > -1) {
            eventListeners.push({ event: event, listener: listener })
        } else {
            console.warn(`Event [${event}] not found.`)
        }
    }

    function removeEvent(event, listener) {
        if (Object.values(AppEvent).indexOf(event) > -1) {
            eventListeners.forEach((dispatcher, index) => {
                if (dispatcher.listener == listener) {
                    eventListeners.splice(index, 1)
                }
            })
        } else {
            console.warn(`Event [${event}] not found.`)
        }
    }

    function hideImmediately() {
        renderer.domElement.style.display = "none"
    }

    function showImmediately() {
        renderer.domElement.style.display = "block"
    }

    /**
     * @param  {number} duration
     */
    function hide(duration) {
        gsap.to(renderer.domElement, { duration: duration || 0.5, autoAlpha: 0, ease: "sine.in" })
    }
    /**
     * @param  {number} duration
     */
    function show(duration) {
        gsap.to(renderer.domElement, { duration: duration || 0.5, autoAlpha: 1, ease: "sine.out" })
    }

    function hideGrid() {
        if (grid) grid.visible = false
        if (axes) axes.visible = false
    }

    function showGrid() {
        if (grid) grid.visible = true
        if (axes) axes.visible = true
    }

    function toggleGrid() {
        if (grid) grid.visible = !grid.visible
        if (axes) axes.visible = !axes.visible
    }

    function enableControl() {
        if (controls) controls.enabled = true;
    }

    function disableControl() {
        if (controls) controls.enabled = false;
    }

    function dispose() {
        window.cancelAnimationFrame(req);

        ThreeUtils.clearThree(scene)

        try {
            renderer.forceContextLoss();
            renderer.context = null;
            renderer.domElement = null;
          } catch (error) {
      
          }
      

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        Object.keys(this).forEach((key) => {
            // Recursively call dispose() if possible.
            if (this[key])
                if (typeof this[key].dispose === 'function') {
                    this[key].dispose();
                }
            // Remove any reference.
            this[key] = null;
        });
    }

    // exports
    this.onAnimate = null
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.container = container
    this.controls = controls
    this.addEvent = addEvent
    this.removeEvent = removeEvent
    this.enableControl = enableControl
    this.disableControl = disableControl
    this.showGrid = showGrid
    this.hideGrid = hideGrid
    this.toggleGrid = toggleGrid
    this.hideImmediately = hideImmediately
    this.showImmediately = showImmediately
    this.show = show
    this.hide = hide
    this.dispose = dispose;
}