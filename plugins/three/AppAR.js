import {
  Scene, WebGLRenderer, CubeTextureLoader, BoxGeometry, TextureLoader,
  PerspectiveCamera, Clock, Object3D, MeshBasicMaterial, Mesh, DirectionalLight, AmbientLight,
  PointLight, GridHelper, AxesHelper, DirectionalLightHelper,
  DoubleSide, FrontSide, BackSide
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';
import MathExtra from "../utils/MathExtra"
import Device from "../utils/Device"
import gsap from "gsap"
import _ from "lodash"
import AppEvent from "./AppEvent"
import ObjectManager from "./ObjectManager";
import ThreeUtils from "./ThreeUtils";

var scope

const AppAR = function (
  {
    container,
    controlEnabled = true,
    lightEnabled = true,
    gridEnabled = true
  }
) {
  var scene, camera, renderer, root
  var cameraHolder
  var sceneOrtho, cameraOrtho
  var composer, effectPass
  var directLight, ambientLight, pointLight
  var grid, axes
  var directLightHelper, pointLightHelper
  var controls
  var lastCalledTime
  var eventListeners = []
  var clock = new Clock()
  var lights = {}

  var sw = container.clientWidth
  var sh = container.clientHeight

  scope = this

  // initial setup
  scene = new Scene()

  // root object3D
  root = new Object3D();
  root.name = "root";
  scene.add(root);

  // AR camera setup
  // camera = new PerspectiveCamera(75, sw / sh, 0.1, 10000);
  // camera.position.set(0, 300, 300)
  // camera.lookAt(scene.position)
  // scene.add(camera)

  camera = new PerspectiveCamera(36, sw / sh, 0.1, 50000);

  cameraHolder = new Object3D();
  var cameraHolder_inside = new Object3D();
  var cameraHolder_Rot = new Object3D();

  cameraHolder_inside.add(camera);
  cameraHolder.name = "cameraHolder";
  cameraHolder_inside.name = "cameraHolder_inside";
  cameraHolder_Rot.name = "cameraHolder_Rot";

  window.deg = THREE.MathUtils.degToRad
  ObjectManager.add("camRot", cameraHolder_Rot)
  ObjectManager.add("camIns", cameraHolder_inside)

  cameraHolder_Rot.add(cameraHolder_inside)
  cameraHolder.add(cameraHolder_Rot);
  scene.add(cameraHolder);

  cameraHolder_inside.position.set(0, 0, 500);
  // cameraHolder_Rot.rotation.set(MathExtra.degToRad(-45), MathExtra.degToRad(30), MathExtra.degToRad(30));
  // cameraHolder_Rot.rotation.set(0, MathExtra.degToRad(30), MathExtra.degToRad(30));

  // renderer
  renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(window ? window.devicePixelRatio : 1);
  renderer.setSize(sw, sh);
  renderer.autoClear = false; // to allow overlay

  renderer.domElement.setAttribute('id', 'canvasThree');
  container.appendChild(renderer.domElement);

  // lights
  if (lightEnabled) {
    directLight = new DirectionalLight("#fff")
    directLight.position.set(300, 800, 500)
    scene.add(directLight)
    lights.direct = directLight;

    ambientLight = new AmbientLight("#fff", 1)
    scene.add(ambientLight)
    lights.ambient = ambientLight;
  }

  // helpers
  if (gridEnabled) {
    grid = new GridHelper(2000, 200)
    grid.material.transparent = true
    grid.material.opacity = 0.8
    scene.add(grid)

    axes = new AxesHelper(1000)
    scene.add(axes)

    directLightHelper = new DirectionalLightHelper(directLight, 10)
    scene.add(directLightHelper)
  }

  if (controlEnabled) {
    console.log("Device.isDeviceOrientationSupport ->", Device.isDeviceOrientationSupport)
    if (Device.isDeviceOrientationSupport) {
      resetCamera();
      controls = new DeviceOrientationControls(cameraHolder);
      // controls.enabled = false;
    } else {
      console.warn("DeviceOrientation is not supported -> Switch to OrbitControls for temporary")

      enableOrbit();
    }
  }

  function enableOrbit() {
    // resetCamera();

    // không dùng `cameraHolder` nữa !
    scene.add(camera);
    camera.position.set(0, 0, 500)
    camera.lookAt(scene.position)

    // controls = new OrbitControls(cameraHolder, container)
    controls = new OrbitControls(camera, container)
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.minDistance = 1;
    controls.maxDistance = 2000;
  }

  function resetCamera() {
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);
    cameraHolder.position.set(0, 0, 0);
    cameraHolder.rotation.set(0, 0, 0);
    // cameraHolder_inside.position.set(0, 0, 0);
    cameraHolder_inside.rotation.set(0, 0, 0);
    cameraHolder_Rot.position.set(0, 0, 0);
    cameraHolder_Rot.rotation.set(0, 0, 0);

    cameraHolder_inside.position.set(0, 0, 500);
  }

  function setCameraForOrthoControl() {
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);

    cameraHolder.position.set(0, 0, 0);
    cameraHolder.rotation.set(0, 0, 0);

    cameraHolder_inside.rotation.set(0, 0, 0);

    cameraHolder_Rot.position.set(0, 0, 0);
    cameraHolder_Rot.rotation.set(-3.141592653589793, 1.2246467991473532, -3.141592653589793);

    cameraHolder_inside.position.set(0, 0, 500);
  }

  function enableControl() {
    if (controls) controls.enabled = true;
  }

  function disableControl() {
    if (controls) controls.enabled = false;
  }

  // resize
  if (window) {
    window.addEventListener("resize", onResize)
    onResize();
  }

  function onResize(e) {
    setTimeout(() => {
      sw = container.clientWidth
      sh = container.clientHeight

      camera.aspect = sw / sh
      camera.updateProjectionMatrix();

      renderer.setSize(sw, sh)
    }, 100);
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
      if (evt.event == AppEvent.BEFORE_RENDER) evt.listener()
    })

    renderer.render(scene, camera);

    eventListeners.forEach((evt) => {
      if (evt.event == AppEvent.AFTER_RENDER) evt.listener(deltaTime)
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

  // other methods
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


  // changesSkyBox(
  //   '../textures/skybox/roomvr/city/cube3/',
  //   ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
  //   '../textures/skybox/roomvr/city/low/',
  // )

  var _sizeSkybox = 1000;
  let cubeGeometry = new BoxGeometry(_sizeSkybox, _sizeSkybox, _sizeSkybox);
  let skybox = new Mesh(cubeGeometry);
  scene.add(skybox);
  skybox.visible = false;
  let materialArray = [];


  function initSkybox() {
    for (let index = 0; index < 6; index++) {
      materialArray.push(new MeshBasicMaterial({
        side: FrontSide,
        transparent: true,
      }));
    }
    skybox.geometry.scale(1, 1, - 1);

    skybox.material = materialArray;

  }
  initSkybox();

  function clearSkybox() {
    skybox.visible = false;

  }

  function changesSkyBox(path, urls, lowPath, urlsLow) {
    lowPath = lowPath || "";
    urlsLow = urlsLow || urls;

    if (lowPath != "") {
      _onChangeSkybox(lowPath, urlsLow, function () {
        _onChangeSkybox(path, urls);
      })
    } else {
      console.log(path, urls)
      _onChangeSkybox(path, urls);
    }
  }

  function _onChangeSkybox(path, urls, callback) {

    skybox.visible = true;

    var count = 0;
    let loader = new TextureLoader();
    var arr = [];
    for (let i = 0; i < urls.length; i++) {
      const element = urls[i];
      var mat = materialArray[i];

      onLoadSingle(mat, path + element);
    }

    function onLoadSingle(mat, url) {
      var texture = loader.load(url, function (e) {
        count++;

        mat.needsUpdate = true;
        mat.map = texture;

        if (count >= urls.length) {
          if (callback) callback();
        }
      });
    }

    return;

    // const loader = new CubeTextureLoader().setPath(path);
    // loader.load(urls,
    //   function (texture) {
    //     scene.background = texture;

    //     if (callback) callback();
    //   },
    //   function (a, b, c) {
    //     console.log(a, b, c)
    //   },
    //   function (error) {
    //     console.log(error)
    //   },
    // )
  }


  function blurOn() {
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
  this.container = container
  this.root = root
  this.lights = lights
  this.scene = scene
  this.camera = camera
  this.cameraHolder = cameraHolder
  this.renderer = renderer
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
  this.changesSkyBox = changesSkyBox
  this.clearSkybox = clearSkybox
  this.resetCamera = resetCamera
  this.setCameraForOrthoControl = setCameraForOrthoControl
  this.enableOrbit = enableOrbit
  this.skybox = skybox
  this.resize = onResize
  this.dispose = dispose

  // this.enableDeviceOrientationSupport = enableDeviceOrientationSupport
  this.sizeSkybox = _sizeSkybox


}

/**
 * @returns {AppAR}
 */
AppAR.instance = () => scope

export default AppAR
