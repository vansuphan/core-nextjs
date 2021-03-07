import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Bassic3DScene from './Bassic3DScene';
import AppEvent from '../AppEvent';
import ObjectManager from '../ObjectManager';
import ArrayExtra from '@/plugins/utils/ArrayExtra';
import App3D from 'plugins/three/App3D'

const StatDebug = ({ renderer, ...props }) => {

    const [fps, setfps] = useState(0);
    const [fpsArr, setfpsArr] = useState([]);
    const [info, setinfo] = useState({ memory: {}, render: {} })

    if (props.initListener)
        props.initListener.useSubscription(() => {
            console.log("StatDebug");
            init();
        });


    useEffect(() => {
        // effect
        // init();
        return () => {
            console.log('cleaning...');
            // const app = Bassic3DScene.app;
            App3D.removeEvent(AppEvent.BEFORE_RENDER, beforeRenderUpdate)
            App3D.removeEvent(AppEvent.AFTER_RENDER, afterRenderUpdate)
        }
    }, [])

    const init = () => {
        const app = Bassic3DScene.app;

        renderer = ObjectManager.get("renderer");

        App3D.addEvent(AppEvent.BEFORE_RENDER, beforeRenderUpdate);
        App3D.addEvent(AppEvent.AFTER_RENDER, afterRenderUpdate);
    }


    const beforeRenderUpdate = (e) => {
        const list = fpsArr;
        list.push(e.fps);
        if (list.length > 20) list.shift();
        setfpsArr(list);
        const _fps = ArrayExtra.average(list).toFixed(0);
        setfps(_fps);
    }


    const afterRenderUpdate = (e) => {
        setinfo(renderer.info);
    }


    return (
        <>
            <style jsx>{`
                .holderStats{
                    bottom: 0px;
                    color:white;
                    padding: 15px;
                    user-select: none;
                    pointer-events: none;
                    flex: 1;
                    display: inline-table;
                    background: #00000066;

                    p{
                        white-space:nowrap;
                    }
                }
            `}</style>

            <div className='holderStats'>
                <p>{`fps: ${fps}`}</p>
                <p>{`drawCalls: ${info.render.calls}`}</p>
                <p>{`triangles: ${info.render.triangles}`}</p>
                <p>{`geometries: ${info.memory.geometries}`}</p>
                <p>{`textures: ${info.memory.textures}`}</p>
            </div>
        </>
    )
}

StatDebug.propTypes = {

}

export default StatDebug
