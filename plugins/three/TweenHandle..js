import App3D from '@/plugins/three/App3D';
import AppEvent from '@/plugins/three/AppEvent';
import TWEEN from '@tweenjs/tween.js';

export default class TweenHandle {

    static setup() {
        this.dispose();
        App3D.addEvent(AppEvent.BEFORE_RENDER, TweenHandle.update);
    }

    static update(e) {
        TWEEN.update(e.time);

    }

    static dispose() {
        App3D.removeEvent(AppEvent.BEFORE_RENDER, TweenHandle.update);

    }
}