import * as THREE from "three"
import Object3DExtend from "./Object3DExtend";
import AssetManager from "./AssetManager";
import ThreeUtils from "./ThreeUtils";


class CanvasMesh extends THREE.Mesh {

  _distance
  _width
  _height

  /**
   * @type {number}
   */
  get width() { return this._width }

  /**
   * @type {number}
   */
  get height() { return this._height }

  /**
   * @type {number}
   */
  get distance() {
    return this._distance
  }

  /**
   * @param  {number} value
   */
  set distance(value) {
    this._distance = value;
    this.update()
  }

  /**
   * @type {THREE.Mesh}
   */
  canvas;

  /**
   * @param  {THREE.WebGLRenderer} renderer
   * @param  {THREE.Camera} camera
   * @param  {number} distanceFromCamera=100
   * @param  {boolean} gridEnabled=false
   * @param  {THREE.MeshBasicMaterialParameters} backgroundOptions={color: "#fff", transparent: true, opacity: 0}
   */
  constructor(
    renderer,
    camera,
    distanceFromCamera = 100,
    gridEnabled = false,
    backgroundOptions = { color: "#fff", transparent: true, opacity: 0 }
  ) {
    var distance = distanceFromCamera;
    // calculating canvas size
    var vFOV = THREE.Math.degToRad(camera.fov); // convert vertical fov to radians
    var height = 2 * Math.tan(vFOV / 2) * distance; // visible height
    var width = height * camera.aspect;

    var _materialOpts = backgroundOptions
    // _materialOpts.opacity = opacity
    _materialOpts.depthTest = false;

    if (gridEnabled) {
      _materialOpts.color = 0xffffff
      _materialOpts.opacity = 1
      _materialOpts.map = AssetManager.get("uv_grid")
    }

    var geometry = new THREE.PlaneBufferGeometry(width * 2, height * 2);
    var material = new THREE.MeshBasicMaterial(_materialOpts);
    material.needsUpdate = true;
    // material.depthTest = false;
    // var mesh = this.canvas = new THREE.Mesh(geometry, material);
    // mesh.position.z = -1;
    // groupZ.add(mesh);
    super(geometry, material)

    this._distance = distance;
    this._width = width;
    this._height = height;

    var scope = this;

    var visible = true;
    var domElement = renderer.domElement || window.document;
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var startMouse = new THREE.Vector2();
    var dragPrevMouse = new THREE.Vector2();
    var dragTime;

    var currentClickDispatcher,
      currentDragStartDispatcher,
      currentDragMoveDispatcher,
      currentDragEndDispatcher,
      currentDragDispatcher;



    // other 

    var group = new THREE.Object3D();
    camera.add(group)

    var groupZ = new THREE.Object3D();
    groupZ.position.z = -distance;
    group.add(groupZ)

    // add canvas to groupZ
    groupZ.add(this)

    // events

    window.addEventListener('resize', onResize);

    update();

    // methods

    function on(event, dispatcher) {
      // //console.log(event, dispatcher);

      if (event == 'click') {
        currentClickDispatcher = dispatcher;
        domElement.addEventListener('click', onClicked);
        domElement.addEventListener('touchstart', onTouchStart);
        domElement.addEventListener('touchend', onTouchEnd);
      }

      if (event == 'drag') {
        currentDragDispatcher = dispatcher;
        domElement.addEventListener('mousedown', onMouseDown);

        domElement.addEventListener('touchstart', onDragStart);
        domElement.addEventListener('touchmove', onDragMove);
        domElement.addEventListener('touchend', onDragEnd);
        domElement.addEventListener('touchcancel', onDragEnd);
      }

      if (event == 'dragstart') {
        currentDragStartDispatcher = dispatcher;
        domElement.addEventListener('mousedown', onDragStart);
        domElement.addEventListener('touchstart', onDragStart);
      }

      if (event == 'dragmove') {
        currentDragMoveDispatcher = dispatcher;
        domElement.addEventListener('mousemove', onDragMove);
        domElement.addEventListener('touchmove', onDragMove);
      }

      if (event == 'dragend') {
        currentDragEndDispatcher = dispatcher;
        domElement.addEventListener('mouseup', onDragEnd);
        domElement.addEventListener('mouseleave', onDragEnd);

        domElement.addEventListener('touchend', onDragEnd);
        domElement.addEventListener('touchcancel', onDragEnd);
      }
    }

    function off(event) {
      if(!event){
        currentClickDispatcher = null;
        currentDragDispatcher = null;
        currentDragStartDispatcher = null;
        currentDragMoveDispatcher = null;
        currentDragEndDispatcher = null;
        domElement.removeEventListener('click', onClicked);
        domElement.removeEventListener('touchstart', onTouchStart);
        domElement.removeEventListener('touchend', onTouchEnd);
        domElement.removeEventListener('touchstart', onDragStart);
        domElement.removeEventListener('touchmove', onDragMove);
        domElement.removeEventListener('touchend', onDragEnd);
        domElement.removeEventListener('touchcancel', onDragEnd);
        domElement.removeEventListener('mousedown', onDragStart);
        domElement.removeEventListener('mousemove', onDragMove);
        domElement.removeEventListener('mouseup', onDragEnd);
        domElement.removeEventListener('mouseleave', onDragEnd);
        return;
      }

      if (event == 'click') {
        currentClickDispatcher = null;
        domElement.removeEventListener('click', onClicked);
        domElement.removeEventListener('touchstart', onTouchStart);
        domElement.removeEventListener('touchend', onTouchEnd);
      }

      if (event == 'drag') {
        currentDragDispatcher = null;
        domElement.removeEventListener('touchstart', onDragStart);
        domElement.removeEventListener('touchmove', onDragMove);
        domElement.removeEventListener('touchend', onDragEnd);
        domElement.removeEventListener('touchcancel', onDragEnd);

        domElement.removeEventListener('mousedown', onDragStart);
        domElement.removeEventListener('mousemove', onDragMove);
        domElement.removeEventListener('mouseup', onDragEnd);
        domElement.removeEventListener('mouseleave', onDragEnd);
      }

      if (event == 'dragstart') {
        currentDragStartDispatcher = null;
        domElement.removeEventListener('touchstart', onDragStart);
        domElement.removeEventListener('mousedown', onDragStart);
      }

      if (event == 'dragmove') {
        currentDragMoveDispatcher = null;
        domElement.removeEventListener('touchmove', onDragMove);
        domElement.removeEventListener('mousemove', onDragMove);
      }

      if (event == 'dragend') {
        currentDragEndDispatcher = null;
        domElement.removeEventListener('touchend', onDragEnd);
        domElement.removeEventListener('touchcancel', onDragEnd);
        domElement.removeEventListener('mouseup', onDragEnd);
        domElement.removeEventListener('mouseleave', onDragEnd);
      }
    }

    function onMouseDown(e) {
      if (!scope.visible) return;
      //console.log(e);

      domElement.addEventListener('mousemove', onDragMove);
      domElement.addEventListener('mouseup', onMouseUp);
      domElement.addEventListener('mouseleave', onMouseUp);

      onDragStart(e);
    }

    function onMouseUp(e) {
      //console.log(e);
      if (!scope.visible) return;

      domElement.removeEventListener('mousemove', onDragMove);
      domElement.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('mouseleave', onMouseUp);

      onDragEnd(e);
    }

    function onDragStart(e) {
      if (!scope.visible) return;
      if (typeof e.clientX == "undefined") e.clientX = e.changedTouches[0].clientX;
      if (typeof e.clientY == "undefined") e.clientY = e.changedTouches[0].clientY;

      dragTime = new Date().getTime();

      mouse.x = e.clientX / window.innerWidth * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      startMouse.x = e.clientX;
      startMouse.y = e.clientY;

      dragPrevMouse.x = e.clientX;
      dragPrevMouse.y = e.clientY;

      var intersects = raycaster.intersectObjects([scope]);

      if (intersects.length > 0) {
        // //console.log(intersects[0]);
        var event = {
          target: scope,
          state: 'dragstart',
          position: scope.worldToLocal(intersects[0].point),
        };
        if (currentDragStartDispatcher) currentDragStartDispatcher(event);
        if (currentDragDispatcher) currentDragDispatcher(event);
      }
    }

    function onDragMove(e) {
      if (!scope.visible) return;
      if (typeof e.clientX == "undefined") e.clientX = e.changedTouches[0].clientX;
      if (typeof e.clientY == "undefined") e.clientY = e.changedTouches[0].clientY;
      
      mouse.x = e.clientX / window.innerWidth * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      var mouseDelta = {
        x: e.clientX - dragPrevMouse.x,
        y: e.clientY - dragPrevMouse.y,
      }

      dragPrevMouse.x = e.clientX;
      dragPrevMouse.y = e.clientY;

      var intersects = raycaster.intersectObjects([scope]);

      if (intersects.length > 0) {
        // //console.log(intersects[0]);
        var event = {
          target: scope,
          state: 'dragmove',
          mouseDelta: mouseDelta,
          position: scope.worldToLocal(intersects[0].point),
        };
        if (currentDragMoveDispatcher) currentDragMoveDispatcher(event);
        if (currentDragDispatcher) currentDragDispatcher(event);
      }
    }

    function onDragEnd(e) {
      if (!scope.visible) return;
      if (typeof e.clientX == "undefined") e.clientX = e.changedTouches[0].clientX;
      if (typeof e.clientY == "undefined") e.clientY = e.changedTouches[0].clientY;

      mouse.x = e.clientX / window.innerWidth * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      // to reset delta mouse
      dragPrevMouse.x = 0;
      dragPrevMouse.y = 0;

      var intersects = raycaster.intersectObjects([scope]);

      if (intersects.length > 0) {
        // //console.log(intersects[0]);
        dragTime = new Date().getTime() - dragTime;
        var event = {
          target: scope,
          state: 'dragend',
          dragTime: dragTime,
          position: scope.worldToLocal(intersects[0].point),
        };
        if (currentDragEndDispatcher) currentDragEndDispatcher(event);
        if (currentDragDispatcher) currentDragDispatcher(event);
      }
    }

    // click event
    function onTouchStart(e) {
      if (!scope.visible) return;
      if (typeof e.clientX == "undefined") e.clientX = e.changedTouches[0].clientX;
      if (typeof e.clientY == "undefined") e.clientY = e.changedTouches[0].clientY;
      
      startMouse.x = e.clientX;
      startMouse.y = e.clientY;
    }

    function onTouchEnd(e) {
      if (!scope.visible) return;
      var touchPosition = new THREE.Vector2();
      touchPosition.x = e.changedTouches[0].clientX;
      touchPosition.y = e.changedTouches[0].clientY;
      if (touchPosition.distanceTo(startMouse) < 5) {
        e.clientX = touchPosition.x;
        e.clientY = touchPosition.y;
        onClicked(e);
      }
    }

    function onClicked(e) {
      if (!scope.visible) return;
      // //console.log ('CLICK! ' + e.clientX + ', ' + e.clientY);
      // normalize mouse -1.0 to 1.0
      mouse.x = e.clientX / window.innerWidth * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      var intersects = raycaster.intersectObjects([scope]);

      if (intersects.length > 0) {
        // //console.log(intersects[0]);
        var event = {
          target: scope,
          state: 'click',
          position: scope.worldToLocal(intersects[0].point),
        };
        // //console.log(scope.width, scope.height, scope.worldToLocal(intersects[0].point));
        if (currentClickDispatcher) currentClickDispatcher(event);
      }
    }

    function onResize(e) {
      update();
    }

    function update() {
      var vFOV = THREE.MathUtils.degToRad(camera.fov); // convert vertical fov to radians
      var height = 2 * Math.tan(vFOV / 2) * scope.distance; // visible height
      var width = height * camera.aspect;

      scope._width = width;
      scope._height = height;

      if (geometry) geometry.dispose();

      geometry = new THREE.PlaneBufferGeometry(width, height);
      scope.geometry = geometry;

      groupZ.position.z = -distance;

      // group.position.copy(camera.position);
      // group.rotation.copy(camera.rotation);
    }

    // exports
    this.renderer = renderer;
    this.material = material;
    this.update = update;
    this.on = on;
    this.off = off;
  }

  dispose() {
    // remove objects
    try {
      ThreeUtils.clearThree(group);
    } catch (e) { }
    // dispose
    material.dispose();
    geometry.dispose();
    // remove events
    window.removeEventListener('resize', onResize);
    off('click');
    off('drag');
  }
}

class ImageButton extends THREE.Mesh {
  /**
   * @type {HTMLElement}
   */
  domElement;
  /**
   * @type {boolean}
   */
  enabled = true;
  /**
   * @type {number}
   */
  width = 1;
  /**
   * @type {number}
   */
  height = 1;

  /**
   * @return {number}
   */
  get opacity() {
    return this.material.opacity
  }
  /**
   * @param  {number} value
   */
  set opacity(value) {
    if (value < 1 && this.material.transparent == false) this.material.transparent = true
    this.material.opacity = value
  }

  _camera;
  faceToCamera = false;

  /**
   * @param  {string | THREE.Texture} mapOrUrl
   * @param  {Object} options = {width: 1, height: 1, faceToCamera: false}
   * @param  {THREE.WebGLRenderer} renderer
   * @param  {THREE.Camera} camera
   */
  constructor(mapOrUrl, options = { width: this.width, height: this.height, faceToCamera: false }, renderer, camera) {
    /**
     * @type {THREE.Texture}
     */
    var map;
    if (typeof mapOrUrl == 'string') {
      map = new THREE.TextureLoader().load(mapOrUrl);
    } else {
      map = mapOrUrl;
    }

    var material = new THREE.MeshBasicMaterial({
      map: map,
      // depthTest: false
    });

    var geometry = new THREE.PlaneBufferGeometry(options.width, options.height, 2, 2)

    super(geometry, material)

    var scope = this;
    this._camera = camera
    this.faceToCamera = options.faceToCamera

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var domElement = renderer ? renderer.domElement : window.document
    this.domElement = domElement

    var currentClickDispatcher;

    if (this.faceToCamera) {
      animate()
    }

    function animate() {
      if (scope.faceToCamera) {
        requestAnimationFrame(animate);
        if (camera) scope.lookAt(camera)
      }
    }

    function on(event, dispatcher) {
      if (event == 'click') {
        currentClickDispatcher = dispatcher;
        domElement.addEventListener('click', onClickHandler);
        domElement.addEventListener('touchstart', onClickHandler);
      }
    }

    function off(event) {
      if (event == 'click') {
        currentClickDispatcher = null;
        domElement.removeEventListener('click', onClickHandler);
        domElement.removeEventListener('touchstart', onClickHandler);
      }
    }

    function onClickHandler(event) {
      // //console.log ('CLICK! ' + event.clientX + ', ' + event.clientY);
      if (scope.visible == false || scope.enabled == false) return;

      if (typeof event.clientX == "undefined") event.clientX = event.changedTouches[0].clientX;
      if (typeof event.clientY == "undefined") event.clientY = event.changedTouches[0].clientY;

      var viewWidth = scope.domElement.clientWidth
      var viewHeight = scope.domElement.clientHeight

      // console.log("onClickHandler", scope.domElement.clientWidth, scope.domElement.clientHeight, event.clientX, event.clientY)

      mouse.x = event.clientX / viewWidth * 2 - 1;
      mouse.y = -(event.clientY / viewHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      var intersects = raycaster.intersectObjects([scope]);
      // console.log(intersects)

      if (intersects.length > 0) {
        var e = {
          target: scope,
          position: scope.worldToLocal(intersects[0].point),
        };
        if (currentClickDispatcher) currentClickDispatcher(e);
      }
    }

    // exports
    this.on = on;
    this.off = off;
  }
}

export {
  CanvasMesh,
  ImageButton
}