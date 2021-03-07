import * as THREE from "three"

// let scope,
//   currentClickDispatcher,
//   currentDragStartDispatcher,
//   currentDragMoveDispatcher,
//   currentDragEndDispatcher,
//   currentDragDispatcher,
//   raycaster,
//   mouse,
//   startMouse,
//   dragTime;

class HitBoxEvent {
  static get CLICK() { return "click" }
  static get DRAG() { return "drag" }
  static get DRAG_START() { return "dragstart" }
  static get DRAG_MOVE() { return "dragmove" }
  static get DRAG_END() { return "dragend" }
}

export { HitBoxEvent }

class HitBox extends THREE.Mesh {

  scope;
  currentClickDispatcher;
  currentDragStartDispatcher;
  currentDragMoveDispatcher;
  currentDragEndDispatcher;
  currentDragDispatcher;
  raycaster;
  mouse;
  startMouse;
  dragTime;

  domElement;
  camera;

  /**
   * Enable/disable interaction of this hit box.
   * @type {boolean}
   */
  enabled = true;

  /**
   * @param  {boolean} val
   */
  set debug(val) {
    this.visible = val;
    this.material.transparent = val;
  }

  /**
   * @param  {THREE.WebGLRenderer} renderer
   * @param  {THREE.Camera} camera
   * @param  {THREE.Vector3} size=new THREE.Vector3(1, 1, 1)
   * @param  {boolean} isDebug=false
   */
  constructor(renderer, camera, size = new THREE.Vector3(1, 1, 1), isDebug = false) {
    var geometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z, 2, 2, 2)
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.3,
      transparent: isDebug,
      depthTest: false,
      depthWrite: false
    });

    super(geometry, material)

    var scope = this

    this.camera = camera
    this.domElement = renderer ? renderer.domElement : window.document
    // this.domElement = window.document
    this.visible = isDebug

    scope.raycaster = new THREE.Raycaster();
    scope.mouse = new THREE.Vector2();
    scope.startMouse = new THREE.Vector2();

    // var scope = this;
  }

  on(event, dispatcher) {
    // //console.log(event, dispatcher);
    var scope = this;

    // remove old event
    this.off();

    if (event == HitBoxEvent.CLICK) {
      scope.currentClickDispatcher = dispatcher;
      // scope._onClicked = (e) => scope.onClicked(e)
      // scope.domElement.addEventListener('click', scope.onClicked.bind(scope));
      // scope._onTouchStart = (e) => scope.onTouchStart(e)
      scope.domElement.addEventListener('mousedown', scope.onMouseDown.bind(scope));

      scope.domElement.addEventListener('touchstart', scope.onTouchStart.bind(scope));
      scope.domElement.addEventListener('touchend', scope.onTouchEnd.bind(scope));
    }

    if (event == HitBoxEvent.DRAG) {
      scope.currentDragDispatcher = dispatcher;
      scope.domElement.addEventListener('mousedown', scope.onMouseDown.bind(scope));

      scope.domElement.addEventListener('touchstart', scope.onDragStart.bind(scope));
      scope.domElement.addEventListener('touchmove', scope.onDragMove.bind(scope));
      scope.domElement.addEventListener('touchend', scope.onDragEnd.bind(scope));
      scope.domElement.addEventListener('touchcancel', scope.onDragEnd.bind(scope));
    }

    if (event == HitBoxEvent.DRAG_START) {
      scope.currentDragStartDispatcher = dispatcher;
      scope.domElement.addEventListener('mousedown', scope.onDragStart.bind(scope));
      scope.domElement.addEventListener('touchstart', scope.onDragStart.bind(scope));
    }

    if (event == HitBoxEvent.DRAG_MOVE) {
      scope.currentDragMoveDispatcher = dispatcher;
      scope.domElement.addEventListener('mousemove', scope.onDragMove.bind(scope));
      scope.domElement.addEventListener('touchmove', scope.onDragMove.bind(scope));
    }

    if (event == HitBoxEvent.DRAG_END) {
      scope.currentDragEndDispatcher = dispatcher;
      scope.domElement.addEventListener('mouseup', scope.onDragEnd.bind(scope));
      scope.domElement.addEventListener('mouseleave', scope.onDragEnd.bind(scope));

      scope.domElement.addEventListener('touchend', scope.onDragEnd.bind(scope));
      scope.domElement.addEventListener('touchcancel', scope.onDragEnd.bind(scope));
    }
  }

  off() {
    var scope = this;

    scope.currentClickDispatcher = null;
    scope.currentDragStartDispatcher = null;
    scope.currentDragMoveDispatcher = null;
    scope.currentDragEndDispatcher = null;
    scope.currentDragDispatcher = null;
    // mouse events
    scope.domElement.removeEventListener('mousedown', scope.onMouseDown.bind(scope));
    scope.domElement.removeEventListener('mousemove', scope.onDragMove.bind(scope));
    scope.domElement.removeEventListener('mouseup', scope.onMouseUp.bind(scope));
    scope.domElement.removeEventListener('mouseleave', scope.onMouseUp.bind(scope));
    // touch events
    scope.domElement.removeEventListener('touchstart', scope.onTouchStart.bind(scope));
    scope.domElement.removeEventListener('touchend', scope.onTouchEnd.bind(scope));
    scope.domElement.removeEventListener('touchstart', scope.onDragStart.bind(scope));
    scope.domElement.removeEventListener('touchmove', scope.onDragMove.bind(scope));
    scope.domElement.removeEventListener('touchend', scope.onDragEnd.bind(scope));
    scope.domElement.removeEventListener('touchcancel', scope.onDragEnd.bind(scope));
  }

  onMouseDown(e) {
    var scope = this;

    if (!scope.enabled) return;
    //console.log(e);

    scope.startMouse.x = e.clientX || e.changedTouches[0].clientX;
    scope.startMouse.y = e.clientY || e.changedTouches[0].clientY;

    scope.domElement.addEventListener('mousemove', scope.onDragMove.bind(scope));
    scope.domElement.addEventListener('mouseup', scope.onMouseUp.bind(scope));
    scope.domElement.addEventListener('mouseleave', scope.onMouseUp.bind(scope));

    scope.onDragStart(e);
  }

  onMouseUp(e) {
    var scope = this;
    //console.log(e);
    if (!scope.enabled) return;

    scope.domElement.removeEventListener('mousemove', scope.onDragMove.bind(scope));
    scope.domElement.removeEventListener('mouseup', scope.onMouseUp.bind(scope));
    scope.domElement.removeEventListener('mouseleave', scope.onMouseUp.bind(scope));

    scope.onDragEnd(e);
    scope.onTouchEnd(e);
  }

  onDragStart(e) {
    var scope = this;
    if (!scope.enabled) return;

    if (typeof e.clientX == "undefined") e.clientX = e.changedTouches[0].clientX;
    if (typeof e.clientY == "undefined") e.clientY = e.changedTouches[0].clientY;

    scope.dragTime = new Date().getTime();

    scope.mouse.x = e.clientX / window.innerWidth * 2 - 1;
    scope.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    scope.raycaster.setFromCamera(scope.mouse, scope.camera);

    var intersects = scope.raycaster.intersectObjects([scope]);

    if (intersects.length > 0) {
      // //console.log(intersects[0]);
      var event = {
        target: scope,
        state: 'dragstart',
        position: scope.worldToLocal(intersects[0].point),
      };
      if (scope.currentDragStartDispatcher) scope.currentDragStartDispatcher(event);
      if (scope.currentDragDispatcher) scope.currentDragDispatcher(event);
    }
  }

  onDragMove(e) {
    var scope = this;
    if (!scope.enabled) return;

    if (typeof e.clientX == "undefined") e.clientX = e.changedTouches[0].clientX;
    if (typeof e.clientY == "undefined") e.clientY = e.changedTouches[0].clientY;

    scope.mouse.x = e.clientX / window.innerWidth * 2 - 1;
    scope.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    scope.raycaster.setFromCamera(scope.mouse, scope.camera);

    var intersects = scope.raycaster.intersectObjects([scope]);

    if (intersects.length > 0) {
      // //console.log(intersects[0]);
      var event = {
        target: scope,
        state: 'dragmove',
        position: scope.worldToLocal(intersects[0].point),
      };
      if (scope.currentDragMoveDispatcher) scope.currentDragMoveDispatcher(event);
      if (scope.currentDragDispatcher) scope.currentDragDispatcher(event);
    }
  }

  onDragEnd(e) {
    var scope = this;
    if (!scope.enabled) return;

    if (typeof e.clientX == "undefined") e.clientX = e.changedTouches[0].clientX;
    if (typeof e.clientY == "undefined") e.clientY = e.changedTouches[0].clientY;

    scope.mouse.x = e.clientX / window.innerWidth * 2 - 1;
    scope.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    scope.raycaster.setFromCamera(scope.mouse, scope.camera);

    var intersects = scope.raycaster.intersectObjects([scope]);

    if (intersects.length > 0) {
      // //console.log(intersects[0]);
      scope.dragTime = new Date().getTime() - scope.dragTime;
      var event = {
        target: scope,
        state: 'dragend',
        dragTime: scope.dragTime,
        position: scope.worldToLocal(intersects[0].point),
      };
      if (scope.currentDragEndDispatcher) scope.currentDragEndDispatcher(event);
      if (scope.currentDragDispatcher) scope.currentDragDispatcher(event);
    }
  }

  // click event
  onTouchStart(e) {
    var scope = this;
    if (!scope.enabled) return;
    if (!scope.startMouse) return;

    // console.log(e.changedTouches[0])

    scope.startMouse.x = e.changedTouches[0].clientX;
    scope.startMouse.y = e.changedTouches[0].clientY;
  }

  onTouchEnd(e) {
    var scope = this;
    if (!scope.enabled) return;

    // console.log(e.changedTouches[0])
    // console.log(JSON.stringify(e.changedTouches[0]))
    if (typeof e.clientX == "undefined") e.clientX = e.changedTouches[0].clientX;
    if (typeof e.clientY == "undefined") e.clientY = e.changedTouches[0].clientY;

    var touchPosition = new THREE.Vector2();
    touchPosition.x = e.clientX;
    touchPosition.y = e.clientY;

    if (touchPosition.distanceTo(scope.startMouse) < 5) {
      // e.clientX = touchPosition.x;
      // e.clientY = touchPosition.y;
      scope.onClicked(e);
    }
  }

  onClicked(e) {
    var scope = this;

    // console.log(scope)
    // console.log(`CLICK! ${scope.enabled} {x: ${e.clientX}, y: ${e.clientY}}`);

    if (!scope.enabled) return;

    // normalize mouse -1.0 to 1.0
    scope.mouse.x = e.clientX / window.innerWidth * 2 - 1;
    scope.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    scope.raycaster.setFromCamera(scope.mouse, scope.camera);
    // console.log(mouse)

    var intersects = scope.raycaster.intersectObjects([scope]);
    // console.log(intersects);

    if (intersects.length > 0) {
      // //console.log(intersects[0]);
      var event = {
        target: scope,
        state: 'click',
        position: scope.worldToLocal(intersects[0].point),
      };
      // //console.log(scope.width, scope.height, mesh.worldToLocal(intersects[0].point));
      if (scope.currentClickDispatcher) scope.currentClickDispatcher(event);
    }
  }
}



export default HitBox