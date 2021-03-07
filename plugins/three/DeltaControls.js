import gsap from "gsap"
// import Draggable from "gsap/Draggable"

export default function DeltaControls(target, domElement) {
  var scope = this;

  // dynamically import
  const Draggable = require("gsap/Draggable").default
  gsap.registerPlugin(Draggable)
  const Hammer = require("hammerjs")

  var _target;

  var dragger;
  var _enabled = true;
  var direction = 'all';

  var maxRotationX = 0;
  var maxRotationY = 0;
  var limit = {};
  // var maxRotationZ = 0;

  this.autoRotate = false;
  this.autoRotateSpeed = 2;
  this.enableZoom = true;
  this.maxScale = 5;
  this.minScale = 0.1;

  var element;
  var scale = 0.007;
  var lastX = 0;
  var lastY = 0;
  var meshX = 0;
  var meshY = 0;
  // var initialRotationX = 0;
  // var initialRotationY = 0;
  var shouldTurnOnAutoRotate = false;
  var draggerPosition = { x: 0, y: 0 };


  var touch, lastPinchScale = 1;
  var currentVol = 0, totalVol = 40;
  var volProgress = 1;

  var targetScl;
  var touch;
  touch = new Hammer(domElement);
  var isAllowPinch = false;

  // init
  init();

  function init() {
    _target = target;

    // initialRotationX = target.rotation.x;
    // initialRotationY = target.rotation.y;

    element = document.createElement('div');
    // console.log(element);

    createDragger();

    window.addEventListener('mousewheel', onMouseWheel);
  }

  function initPinch(target) {

    targetScl = target;

    currentVol = targetScl.scale.x / scope.maxScale;

    touch.get('pinch').set({ enable: true });
    touch.on('pinch', onPinch);
    isAllowPinch = true;
  }

  function disablePinch() {
    isAllowPinch = false;
    // touch.off('pinch');

    // touch.get('pinch').set({ enable: false });
    // touch.on('pinch', onPinch);
  }
  function enablePinch() {
    isAllowPinch = true;
    // touch.get('pinch').set({ enable: true });
    // touch.on('pinch', onPinch);
  }


  function onPinch(e) {
    if (!isAllowPinch) return;
    if (!targetScl) targetScl = target;

    console.log(e.scale);
    if (e.scale > lastPinchScale) {
      currentVol++;
    } else {
      currentVol--;
    }

    if (currentVol > totalVol) currentVol = totalVol;
    if (currentVol < 0) currentVol = 0;
    volProgress = currentVol / totalVol;

    targetScl.scale.setScalar(scope.minScale + ((scope.maxScale - scope.minScale) * volProgress));

    if (targetScl.scale.x <= scope.minScale) {
      targetScl.scale.setScalar(scope.minScale);
      return;
    }
    if (targetScl.scale.x >= scope.maxScale) {
      targetScl.scale.setScalar(scope.maxScale);
      return;
    }
  }

  function createDragger() {
    if (dragger) dragger.kill();
    dragger = new Draggable(element, {
      onDragStart: onDragStart,
      onDrag: dragAction,
      trigger: domElement,
      throwProps: true,
      throwResistance: 5000,
      edgeResistance: 0.65,
      // type: "rotation"
      inertia: true,
      onThrowUpdate: dragAction,
      bounds: limit,
      onThrowComplete: function () {
        if (shouldTurnOnAutoRotate) {
          scope.autoRotate = true;
        }
        shouldTurnOnAutoRotate = false;
      },
    });

    // window.dragger = dragger;
  }

  function onMouseWheel(e) {
    // console.log(e);
    var newScale = e.deltaY / 200;
    _target.scale.addScalar(newScale);

    if (_target.scale.x <= scope.minScale) {
      _target.scale.setScalar(scope.minScale);
      return;
    }
    if (_target.scale.x >= scope.maxScale) {
      _target.scale.setScalar(scope.maxScale);
      return;
    }
  }

  function onDragStart() {
    if (!_enabled) return;

    // reset();
    // console.log(dragger.target);

    if (scope.autoRotate) {
      scope.autoRotate = false;
      shouldTurnOnAutoRotate = true;
    }
  }

  function limitDragger(target, max) {
    var pos = 0;
    if (max == 0) {
      pos = target;
    } else {
      pos =
        target > max ? max :
          target < -max ? -max :
            target;
    }

    return pos;
  }

  function dragAction(e) {
    if (!_enabled) return;
    // console.log($(element).position())

    // dragger.x = limitDragger(dragger.x, maxRotationX);
    // dragger.y = limitDragger(dragger.y, maxRotationY);

    // dragger.endX = limitDragger(dragger.x, maxRotationX);
    // dragger.endY = limitDragger(dragger.y, maxRotationY);

    // console.log({
    //   x: dragger.x,
    //   y: dragger.y,
    //   endX: dragger.endX,
    //   endY: dragger.endY,
    // });
    // console.log(dragger);

    draggerPosition.x = dragger.x;
    draggerPosition.y = dragger.y;

    // console.log(this);
    // console.log (element.style.transform, dragger);

    var rotation = calculateRotation(dragger);

    if (direction == 'all' || direction == 'vertical')
      target.rotation.x = rotation.x;
    if (direction == 'all' || direction == 'horizontal')
      target.rotation.y = rotation.y;
    if (direction == 'yz') {
      target.rotation.z = -rotation.x;
      target.rotation.y = rotation.y;
    }

    if (scope.onUpdate) scope.onUpdate();
  }

  function calculateRotation(drag) {
    // console.log(drag);
    var x = drag.x;
    var y = drag.y;

    // var x = limitDragger(dragger.x, maxRotationX);
    // var y = limitDragger(dragger.y, maxRotationY);


    var dx = x - lastX;
    var dy = y - lastY;

    lastX = x;
    lastY = y;

    meshX += dx;
    meshY += dy;

    return { x: meshY * scale, y: meshX * scale };
  }

  function reset() {
    TweenMax.set(element, { x: 0, y: 0 });
    dragger.update();
    // console.log(element);
    lastX = 0;
    lastY = 0;
    meshX = 0;
    meshY = 0;
    // initialRotationX = target.rotation.x;
    // initialRotationY = target.rotation.y;
    // initialize dragger
    // createDragger();
    // console.log ('control reset', dragger);
    draggerPosition.x = dragger.x;
    draggerPosition.y = dragger.y;
  }

  function update() {
    if (!_enabled) return;
    // console.log("control update");
    if (scope.autoRotate) {
      // dragger.x += scope.autoRotateSpeed;
      draggerPosition.x += scope.autoRotateSpeed;

      TweenMax.set(element, { x: draggerPosition.x, y: draggerPosition.y });

      dragger.update();
      // console.log(dragger);

      var rotation = calculateRotation(dragger);
      target.rotation.y = rotation.y;

      if (scope.onUpdate) scope.onUpdate();
    }
  }

  function dispose() {
    window.removeEventListener('mousewheel', onMouseWheel);
    document.removeChild(element);
    dragger.kill();
    dragger = null;
  }

  function setLimit(options) {

    options = typeof options != "undefined" ? options : {};

    maxRotationX = options.hasOwnProperty("x") ? options['x'] : 0;
    maxRotationY = options.hasOwnProperty("y") ? options['y'] : 0;

    limit = {};
    if (maxRotationX != 0) {
      limit.minX = -maxRotationX;
      limit.maxX = maxRotationX;
    }

    if (maxRotationY != 0) {
      limit.minY = -maxRotationY;
      limit.maxY = maxRotationY;
    }

    createDragger();
  }

  function removeLimit() {
    maxRotationX = 0;
    maxRotationY = 0;
    limit = {};
    createDragger();

  }

  // export get/set variables

  Object.defineProperties(this, {
    enabled: {
      get: function () {
        return _enabled;
      },
      set: function (value) {
        _enabled = value;
        if (_enabled) {
          reset();
        }
      },
    },
    direction: {
      get: function () {
        return direction;
      },
      set: function (value) {
        direction = value;
      },
    },
    maxRotationX: {
      get: function () {
        return maxRotationX;
      },
      set: function (value) {
        maxRotationX = value;
      },
    },
    maxRotationY: {
      get: function () {
        return maxRotationY;
      },
      set: function (value) {
        maxRotationY = value;
      },
    },



  });

  // export functions
  this.initPinch = initPinch;
  this.enablePinch = enablePinch;
  this.disablePinch = disablePinch;
  this.target = _target;
  this.update = update;
  this.dispose = dispose;
  this.reset = reset;
  this.setLimit = setLimit;
  this.removeLimit = removeLimit;
  this.onUpdate = null;
}
