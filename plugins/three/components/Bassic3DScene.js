import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import App3D from '../App3D';
import Pool from '../Pool';


const Bassic3DScene = props => {
    const appRef = useRef();

    useEffect(() => {
        // effect
        return () => {
            // cleanup
            App3D.dispose();
            Pool.dispose();
        }
    }, [])

    const init = (params) => {

        if (props.initListener) props.initListener.emit();
        if (props.onInit) props.onInit();
    }

    return (
        <App3D
            ref={appRef}

            appInit={init}

            {...props}
        />
    )
}

Bassic3DScene.propTypes = {

}

export default Bassic3DScene
