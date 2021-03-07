// import { merge } from "lodash"
import * as THREE from "three"
import MathExtra from "plugins/utils/MathExtra";

/**
 * @type {ConfettiExplosion}
 */
var scope;
var _isPlaying = true;

const getRandom = (arr) => {
  const r = Math.floor(arr.length * Math.random())
  return arr[r]
}

/**
 * @param  {any} item
 * @param  {Array} arr
 */
const removeItemFromArray = (item, arr) => {
  const i = arr.indexOf(item)
  arr.splice(i, 1)
  return arr
}

var geometry = new THREE.PlaneBufferGeometry(1, 1);

export default class ConfettiExplosion extends THREE.Object3D {
  /**
   * @returns {boolean}
   */
  get isPlaying() {
    return _isPlaying
  }

  particles = [];
  booms = [];

  constructor(options = {
    amount: 10,
    rate: 2,
    radius: 600,
    areaWidth: 500,
    areaHeight: 500,
    fallingHeight: 500,
    fallingSpeed: 1,
    colors: [0xffffff, 0xff0000, 0xffff00]
  }) {
    super()

    // console.log(options)

    scope = this;

    scope.options = options;
    scope.particles = [];
    scope.booms = [];
    scope.options.rate = scope.options.rate / 100;
    if (scope.options.rate > 0.2) scope.options.rate = 0.2;

  }

  pause = () => {
    _isPlaying = false
  }

  play = () => {
    _isPlaying = true
  }

  toggle = () => _isPlaying = !_isPlaying;

  explode() {
    if (!_isPlaying) return;

    // console.log("explode");
    var boom = new THREE.Object3D();
    boom.life = MathExtra.randFloat(500, 500);
    boom.position.x = -(scope.options.areaWidth / 2) + scope.options.areaWidth * Math.random();
    boom.position.y = scope.options.fallingHeight + MathExtra.randFloatSpread(100);
    boom.position.z = -(scope.options.areaWidth / 2) + scope.options.areaWidth * Math.random();
    scope.add(boom);

    scope.booms.push(boom);

    for (var i = 0; i < scope.options.amount; i++) {
      var material = new THREE.MeshBasicMaterial({ color: getRandom(scope.options.colors), transparent: true, side: THREE.DoubleSide });
      var particle = new THREE.Mesh(geometry, material);
      boom.add(particle);

      particle.life = 1;

      particle.destination = {};
      particle.destination.x = (Math.random() - 0.5) * (scope.options.radius * 2) * Math.random();
      particle.destination.y = (Math.random() - 0.5) * (scope.options.radius * 2) * Math.random();
      particle.destination.z = (Math.random() - 0.5) * (scope.options.radius * 2) * Math.random();

      particle.rotation.x = MathExtra.rand(THREE.MathUtils.degToRad(360));
      particle.rotation.y = MathExtra.rand(THREE.MathUtils.degToRad(360));
      particle.rotation.z = MathExtra.rand(THREE.MathUtils.degToRad(360));

      var size = MathExtra.randFloat(2, 5);
      particle.scale.x = size;
      particle.scale.y = size;

      particle.rotateSpeedX = MathExtra.randFloatSpread(0.4);
      particle.rotateSpeedY = MathExtra.randFloatSpread(0.4);
      particle.rotateSpeedZ = MathExtra.randFloatSpread(0.4);
    }

    boom.dispose = function () {
      for (var i = 0; i < boom.children.length; i++) {
        var particle = boom.children[i];
        particle.material.dispose();
        particle.geometry.dispose();
        boom.remove(particle);
        particle = null;
      }
      boom.parent.remove(boom);
      boom = null;
    };
  };

  render() {
    if (!_isPlaying) return;
    // console.log("render confetti")
    if (Math.random() < scope.options.rate) scope.explode();

    var particleAmount = 0;
    for (var i = 0; i < scope.booms.length; i++) {
      var boom = scope.booms[i];

      for (var k = 0; k < boom.children.length; k++) {
        var particle = boom.children[k];


        particle.destination.y -= MathExtra.randFloat(3, 6)
        particle.life -= MathExtra.randFloat(0.005, 0.01)

        var speedX = (particle.destination.x - particle.position.x) / 80;
        var speedY = (particle.destination.y - particle.position.y) / 80;
        var speedZ = (particle.destination.z - particle.position.z) / 80;

        particle.position.x += speedX;
        particle.position.y += speedY;
        particle.position.z += speedZ;

        particle.rotation.y += particle.rotateSpeedY;
        particle.rotation.x += particle.rotateSpeedX;
        particle.rotation.z += particle.rotateSpeedZ;

        if (particle.position.y < -scope.options.fallingHeight) {
          particle.material.dispose();
          particle.geometry.dispose();
          boom.remove(particle);
          particle = null;
        }
      }

      if (boom.children.length <= 10) {
        removeItemFromArray(boom, scope.booms);
        boom.dispose();
      }

      particleAmount += boom.children.length;
    }

    // document.getElementById("particleCount").innerHTML = particleAmount;
  };

  reset() {
    if (scope.particles && scope.particles.length > 0) {
      scope.particles.forEach(particle => {
        var particle = scope.particles[i];
        particle.material.dispose();
        particle.geometry.dispose();
        particle.parent.remove(particle);
        particle = null;
      })
    }
    if (scope.booms && scope.booms.length > 0) scope.booms.forEach(boom => boom.dispose());
    scope.particles = []
    scope.booms = []
    _isPlaying = false;
  }

  /**
   * @type {function}
   */
  dispose() {
    if (typeof scope == "null" || typeof scope == "undefined") return;

    scope.reset();
    
    scope.parent.remove(scope);
    scope = null;
  };
}