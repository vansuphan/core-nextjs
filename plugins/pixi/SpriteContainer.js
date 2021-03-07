import gsap, { Linear, Sine } from 'gsap';
import MathExtra from 'plugins/utils/MathExtra';
let PIXI; if (typeof window != "undefined") {
    PIXI = require('pixi.js');
}


export default function SpriteContainer(name, option) {
    if (typeof window == "undefined") return;

    let _this = this;
    PIXI.Container.call(_this);
    _this.name = name;

    option = typeof option != "undefined" ? option : {};

    // let parent = option.hasOwnProperty("parent") ? option["parent"] : holder;
    let anchor = option.hasOwnProperty("anchor") ? option["anchor"] : { x: 0, y: 0 };
    let pivot = option.hasOwnProperty("pivot") ? option["pivot"] : { x: 0, y: 0 };
    let rotation = option.hasOwnProperty("rotation") ? option["rotation"] : 0;
    let _x = option.hasOwnProperty("x") ? option["x"] : 0;
    let _y = option.hasOwnProperty("y") ? option["y"] : 0;

    let fxloop = option.hasOwnProperty("fxloop") ? option["fxloop"] : null;
    // let rotLoop = option.hasOwnProperty("rotLoop") ? option["rotLoop"] : MathExtra.degToRad(-10);
    let duration = option.hasOwnProperty("duration") ? option["duration"] : .5;
    let delay = option.hasOwnProperty("delay") ? option["delay"] : 0;
    // let ease = option.hasOwnProperty("ease") ? option["ease"] : Sine.easeOut;
    const TextureCache = PIXI.utils.TextureCache;

    let _image = _this.sprite = new PIXI.Sprite();

    _this.changeTexture = function (_name) {

        let _texture = TextureCache[_name];
        _image.texture = _texture;
    }
    _this.changeTexture(name);

    // parent.addChild(_image);
    if (option.hasOwnProperty("anchor")) _image.anchor = anchor;
    if (option.hasOwnProperty("pivot")) _image.anchor = { x: pivot.x / _image.width, y: pivot.y / _image.height };
    // console.log(_image.anchor);
    _image.rotation = MathExtra.degToRad(rotation);
    // _image.x = 0;
    // _image.y = 0;
    _this.x = _x;
    _this.y = _y;

    _this.fxLoopMoveY = function () {
        let moveY = option.hasOwnProperty("moveY") ? option["moveY"] : 10;
        duration = option.hasOwnProperty("duration") ? option["duration"] : 1;
        gsap.to(_image, duration, {
            delay: Math.random() * duration,
            y: _image.y + moveY,
            ease: Sine.easeInOut,
            repeat: -1,
            yoyo: true
        })
    }

    _this.fxLoopMoveX = function () {
        let moveX = option.hasOwnProperty("moveX") ? option["moveX"] : 10;
        duration = option.hasOwnProperty("duration") ? option["duration"] : 1;
        delay = option.hasOwnProperty("delay") ? option["delay"] : Math.random() * duration;
        gsap.to(_image, duration, {
            delay: delay,
            x: _image.x + moveX,
            ease: Sine.easeInOut,
            repeat: -1,
            yoyo: true
        })
    }

    _this.fxLoopRotation360 = function () {
        duration = option.hasOwnProperty("duration") ? option["duration"] : 3;
        delay = option.hasOwnProperty("delay") ? option["delay"] : Math.random() * duration;
        let sign = option.hasOwnProperty("sign") ? option["sign"] : 1;

        gsap.to(_image, duration, {
            delay: delay,
            rotation: MathExtra.degToRad(360 * sign),
            ease: Linear.easeNone,
            repeat: -1,
        })
    }

    _this.fxLoopRotation = function () {
        duration = option.hasOwnProperty("duration") ? option["duration"] : 1;
        delay = option.hasOwnProperty("delay") ? option["delay"] : Math.random() * duration;
        let rotLoop = 0;
        if (option.hasOwnProperty("rotLoop")) {
            rotLoop = MathExtra.degToRad(option["rotLoop"]);
        } else {
            rotLoop = MathExtra.degToRad(-10);
            _image.rotation = -rotLoop;
        }

        gsap.to(_image, duration, {
            delay: delay,
            rotation: _image.rotation + rotLoop,
            ease: Sine.easeInOut,
            repeat: -1,
            yoyo: true
        })
    }

    _this.fxLoopScale = function () {
        duration = option.hasOwnProperty("duration") ? option["duration"] : 1;
        delay = option.hasOwnProperty("delay") ? option["delay"] : Math.random() * duration;
        let scale = option.hasOwnProperty("scale") ? option["scale"] : .9;
        gsap.to(_image.scale, duration, {
            // rotation: _image.rotation + rotLoop,
            delay: delay,
            x: scale,
            y: scale,
            ease: Sine.easeInOut,

            repeat: -1,
            yoyo: true
        })
    }

    if (fxloop != null) {
        if (fxloop == "rotation360") {
            _this.fxLoopRotation360();
        } else if (fxloop == "rotation") {
            _this.fxLoopRotation();
        } else if (fxloop == "scale") {
            _this.fxLoopScale();
        } else if (fxloop == "moveX") {
            _this.fxLoopMoveX();
        } else if (fxloop == "moveY") {
            _this.fxLoopMoveY();
        }


    }

    let onClick = option.hasOwnProperty("onClick") ? option["onClick"] : null;

    if (onClick != null || _this.onClick) {
        _this.interactive = _this.buttonMode = true;
        _this.on("pointerdown", function () {
            onClick();

            if (_this.onClick) _this.onClick();
        })
    }

    let onOver = option.hasOwnProperty("onOver") ? option["onOver"] : null;
    if (onOver != null || _this.onOver) {
        _this.interactive = _this.buttonMode = true;
        _this.on("pointerover", function () {
            onOver();
            if (_this.onOver) _this.onOver();
        })
    }

    let onOut = option.hasOwnProperty("onOut") ? option["onOut"] : null;
    if (onOut != null || _this.onOut) {
        _this.interactive = _this.buttonMode = true;
        _this.on("pointerout", function () {
            onOut();
            if (_this.onOut) _this.onOut();
        })
    }

    _this.addChild(_image);
    // _this.pivot.x = -_this.width * anchor.x;
    // _this.pivot.y = -_this.height * anchor.y;
    //  _image;
}


if (typeof window != "undefined") {
    // import * as PIXI from 'pixi.js'
    SpriteContainer.prototype = Object.assign(Object.create(PIXI.Container.prototype), {})

}

