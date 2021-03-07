import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { getFontDefinitionFromManifest } from 'next/dist/next-server/server/font-utils';

let PIXI; if (typeof window != "undefined") {
  PIXI = require('pixi.js');
}



const BasicApp2D = React.forwardRef((props, ref) => {
  const holderRef = useRef()

  const [isInit, setisInit] = useState(false)

  useEffect(() => {
    init();
    return () => {
      // cleanup
    }
  }, [])

  const init = () => {
    if (isInit) return;
    setisInit(true);

    setupPixi();
  }

  const setupPixi = () => {
    if (typeof window == "undefined") return;
    if (typeof PIXI == "undefined") return;

    let params = {};
    params.width = props.width || 512;
    params.height = props.height || 512;
    params.backgroundColor = props.hasOwnProperty("backgroundColor") ? props.backgroundColor : 0x1099bb;

    let app = new PIXI.Application({

      ...params,

      autoDensity: false,
      autoResize: false,

      transparent: true,
      antialias: true,
      sharedTicker: true,
      sharedLoader: true,
      resolution: 1,
    });
    if (holderRef.current) holderRef.current.appendChild(app.view);

    PIXI.settings.RESOLUTION = 1;
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

    app.view.className += " " + "canvasPixi";
    app.view.style.width = "100%";
    app.view.style.height = "auto";

    app.view.width = params.width;
    app.view.height = params.height;


    onInit(app);

    window.app = app;

    // app.stage.scale = { x: 2, y: 2 };

    // onAnimate();
    app.ticker.add((delta) => {
      app.renderer.plugins.interaction.resolution = 1;
      app.renderer.resolution = 1;
      app.render();
    });

  }

  // const onAnimate = (params) => {
  //   // Listen for animate update
  //   app.ticker.add((delta) => {
  //     // rotate the container!
  //     // use delta to create frame-independent transform
  //     container.rotation -= 0.01 * delta;
  //   });

  // }


  useImperativeHandle(ref, () => ({

    test(name) {
      console.log("test")
    },

    loadPacker(list) {
      _load(list);
    }

  }));


  const _load = (list) => {
    const loader = new PIXI.Loader();
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      loader.add(item);
    }
    // throughout the process multiple signals can be dispatched.
    loader.onProgress.add((e) => {
      onLoading(e)
    }); // called once per loaded/errored file
    loader.onError.add((e) => {
      onLoadError(e)
    }); // called once per errored file
    loader.onLoad.add((e) => {
      // console.log("onLoad", e)
    }); // called once per loaded file
    loader.onComplete.add((e) => {
      onLoaded(e)
    }); // called once when the queued resources all load.

    loader.load();
  }


  const onInit = (app) => {
    const param = {
      app: app,
      renderer: app.renderer,
      stage: app.stage,
    }
    if (props.onInit) props.onInit(param);
  }


  const onLoaded = (e) => {
    if (props.onLoaded) props.onLoaded(e);
  }

  const onLoading = (e) => {
    if (props.onLoading) props.onLoading(e);
  }

  const onLoadError = (e) => {
    if (props.onLoadError) props.onLoadError(e);
  }



  return (
    <>
      <style jsx>{`
                .holder{
                    width: 100%; 
                }

            `}</style>

      <div ref={holderRef} className='holder'>

      </div>
    </>
  )
});




BasicApp2D.propTypes = {

}

export default BasicApp2D
