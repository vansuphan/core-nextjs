import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import DashkitButton, { ButtonType } from '@/components/dashkit/Buttons';
import { MathUtils } from 'three';
import { Slider, InputNumber, Row, Col } from 'antd';


const ButtonDebug = forwardRef(({ renderer, list = [], ...props }, ref) => {

    const [listAction, setlistAction] = useState(list)

    if (props.initListener)
        props.initListener.useSubscription(() => {
            init();
        });


    useEffect(() => {
        return () => {
            ButtonDebug.list = [];
        }
    }, [])

    const addAction = (item) => {

        item.uuid = MathUtils.generateUUID();
        if (!item.hasOwnProperty("isButton")) item.isButton = true;
        ButtonDebug.list.push(item);

        setlistAction([...ButtonDebug.list])

    }

    const addActions = (items) => {
        items.forEach(item => {
            addAction(item);
        })
    }

    const removeActionByType = (type) => {
        removeActionByKey("type", type);
    }

    const removeActionByKey = (key, value) => {
        ButtonDebug.list = ButtonDebug.list.filter((item) => {
            return item[key] != value;
        });
        setlistAction([...ButtonDebug.list])
    }


    const getActionsByKey = (key, value) => {
        return ButtonDebug.list.filter((item) => {
            return item[key] == value;
        });
    }
    const changeItemByUuid = (uuid, item) => {
        ButtonDebug.list.forEach((found) => {
            if (found.uuid == uuid)
                found = item;
        })
        setlistAction([...ButtonDebug.list])

    }

    /**
     * 
     * @param {string} TYPE 
     * @param {Function} fnAdd 
     */
    const addButtonToggleListByType = (TYPE, fnAdd) => {

        const TITLE_BUTTON = () => {
            const list = getActionsByKey("type", TYPE);
            return list.length == 0 ? `Add ${TYPE}` : `Remove ${TYPE}`;
        }

        const COLOR_BUTTON = () => {
            const list = getActionsByKey("type", TYPE);
            return list.length == 0 ?
                {
                    bgColor: "#1e6fde",
                    bgColorActive: "#174c94",
                } : {
                    bgColor: "#e85151",
                    bgColorActive: '#ab1b1b',
                };
        }

        addAction({
            props: {
                bgColor: COLOR_BUTTON().bgColor,
                bgColorActive: COLOR_BUTTON().bgColorActive,
                textColor: "white",
            },
            title: TITLE_BUTTON(),
            type: `TEST ${TYPE}`,
            fn: (key, index) => {
                const list = getActionsByKey("type", TYPE);

                const _scope = getActionsByKey("type", `TEST ${TYPE}`).first;
                // addAnimationTest();

                if (list.length == 0) {

                    // addList();
                    if (fnAdd) fnAdd();

                    if (_scope) {
                        _scope.props = {
                            bgColor: COLOR_BUTTON().bgColor,
                            bgColorActive: COLOR_BUTTON().bgColorActive,
                            textColor: "white",
                        };
                        _scope.title = TITLE_BUTTON();
                        changeItemByUuid(_scope.uuid, _scope);
                    }

                } else {
                    // removeList();
                    removeActionByType(TYPE);

                    if (_scope) {
                        _scope.title = TITLE_BUTTON();
                        _scope.props = {
                            bgColor: COLOR_BUTTON().bgColor,
                            bgColorActive: COLOR_BUTTON().bgColorActive,
                            textColor: "white",
                        };
                        changeItemByUuid(_scope.uuid, _scope);
                    }

                }
            }
        })
    }



    ButtonDebug.addAction = addAction;
    ButtonDebug.addActions = addActions
    ButtonDebug.removeActionByType = removeActionByType
    ButtonDebug.removeActionByKey = removeActionByKey
    ButtonDebug.getActionsByKey = getActionsByKey;
    ButtonDebug.changeItemByUuid = changeItemByUuid
    ButtonDebug.addButtonToggleListByType = addButtonToggleListByType



    return (
        <>
            <style jsx>{`
                .holderButton{
                    bottom: 0px;
                    color: white;
                    padding: 0 5px 0 5px;
                    background: #00000066
                }
                
            `}</style>

            <div className='holderButton'>
                {/* {btns} */}
                {listAction.map((item, index) => {
                    if (item.isButton) {
                        return <DashkitButton {...item.props} outline={true} key={index} onClick={item.fn} type={ButtonType.PRIMARY} style={{ margin: "5px" }}>
                            {item.title}
                        </DashkitButton>
                    } else if (item.isSlider) {
                        return <Row key={index} style={{ alignItems: "center" }}>
                            <span style={{ paddingRight: "10px" }}>{item.title}</span>
                            <Col span={12}>
                                <Slider
                                    min={item.min ? item.min : -1}
                                    max={item.max ? item.max : 1}
                                    onChange={(value) => {
                                        if (item.fn) item.fn(value);
                                    }}
                                    step={item.step ? item.step : 0.01}
                                />
                            </Col>
                        </Row>
                    }
                })}

            </div>
        </>
    )
})


ButtonDebug.list = [];


ButtonDebug.propTypes = {}

export default ButtonDebug
