import CenterContainer from "@/components/diginext/containers/CenterContainer";
import Code from "@/components/diginext/elements/Code";
import { BS } from "@/components/diginext/elements/Splitters";
import { HorizontalList, ListItem } from "@/components/diginext/layout/ListLayout";
import MasterPageExample from "@/components/website/master/MasterPageExample";
import useNextOffset from "plugins/next-offset";
import { useNextScroll } from "plugins/next-scroll";
import { NextScrollTrigger, useNextScrollTrigger } from "plugins/next-scroll-trigger";
import React, { useEffect, useRef, useState } from "react";
import { animated, Spring } from "react-spring";

const leaveStyle = { opacity: 0, y: 50 };
const enterStyle = { opacity: 1, y: 0 };

const NextScrollTriggerExample = () => {
  // relative offset with parent element (VERTICAL):
  const parentRef = useRef();

  // relative offset with window:
  const containerRef = useRef();
  const windowRelativeOffset = useNextOffset(containerRef);

  // using scroll trigger hook:
  const insideRef2 = useRef();
  const parentRef2 = useRef();
  const greenScrollTriggerStatus = useNextScrollTrigger(insideRef2, parentRef2, { offsetLeft: 50, offsetRight: 100 });
  const [animationValues, setAnimationValues] = useState(leaveStyle);

  useEffect(() => {
    if (greenScrollTriggerStatus == "enter") {
      setAnimationValues(enterStyle);
    } else {
      setAnimationValues(leaveStyle);
    }
  }, [greenScrollTriggerStatus]);

  return (
    <MasterPageExample header="Examples of using '/plugins/next-scroll-trigger'">
      <style jsx>{`
        .container {
          max-width: 400px;
          height: 300px;
          border: 1px solid black;
          overflow: scroll;
        }
        .text {
          position: relative;
          width: 100%;
          height: 200px;
          border-bottom: 1px solid gray;

          &.red {
            color: white;
            background-color: red;
          }

          &.blue {
            color: white;
            background-color: blue;
            text-align: center;
          }

          &.green {
            color: white;
            background-color: green;
          }

          &.fixed-width {
            width: 250px;
            height: 100%;
          }
        }
        .text-red {
          color: red;
        }
        .text-blue {
          color: blue;
        }
        .text-green {
          color: green;
        }
        .bottom-bar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 25px;
          background-color: white;
          box-shadow: 0px -4px 15px 0px rgba(0, 0, 0, 0.35);
          z-index: 100;
          text-align: center;
        }
      `}</style>

      <div>
        <h2>Trigger animation in & out when the element appear (Vertical scroll)</h2>
        <BS />
        <div className="container" ref={parentRef}>
          <div className="text" style={{ height: "500px" }}>
            <CenterContainer>Text 1</CenterContainer>
          </div>
          <NextScrollTrigger
            scrollTarget={parentRef}
            enterAnimation={{ opacity: 1, transform: "translate(0px, 0px)" }}
            leaveAnimation={{ opacity: 0, transform: "translate(80px, 0px)" }}
            offsetTop={100}
            offsetBottom={100}
          >
            <div className="text red">
              <CenterContainer>HELLO WORLD</CenterContainer>
            </div>
          </NextScrollTrigger>
          <div className="text">
            <CenterContainer>Text 3</CenterContainer>
          </div>
          <div className="text">
            <CenterContainer>Text 4</CenterContainer>
          </div>
        </div>

        <BS />
        <h2>Trigger animation in & out when the element appear (horizontal scroll)</h2>
        <div className="container">
          <HorizontalList scrollable style={{ height: "100%" }} align="stretch" ref={parentRef2}>
            <ListItem>
              <div className="text fixed-width" style={{ width: "500px" }}>
                <CenterContainer>Text 1</CenterContainer>
              </div>
            </ListItem>
            <ListItem>
              <Spring to={animationValues}>
                {(props) => {
                  // console.log("props", props);
                  return (
                    <animated.div
                      style={{
                        opacity: props.opacity,
                        transform: props.y.to((y) => `translate(0, ${y}px)`),
                        height: "100%",
                      }}
                    >
                      <div
                        className="text fixed-width green"
                        style={{ width: "150px", height: "100%" }}
                        ref={insideRef2}
                      >
                        <CenterContainer>
                          <p>{greenScrollTriggerStatus.toUpperCase()}</p>
                        </CenterContainer>
                      </div>
                    </animated.div>
                  );
                }}
              </Spring>
            </ListItem>
            <ListItem>
              <div className="text fixed-width">
                <CenterContainer>Text 3</CenterContainer>
              </div>
            </ListItem>
            <ListItem>
              <div className="text fixed-width">
                <CenterContainer>Text 4</CenterContainer>
              </div>
            </ListItem>
            <ListItem>
              <div className="text fixed-width">
                <CenterContainer>Text 5</CenterContainer>
              </div>
            </ListItem>
          </HorizontalList>
        </div>
      </div>

      <BS size={50} />
      <h2>Relative offset position of an container with browser Window</h2>
      <div>
        <div className="text">
          <CenterContainer>Text 1</CenterContainer>
        </div>
        <div className="text">
          <CenterContainer>Text 2</CenterContainer>
        </div>
        <NextScrollTrigger
          enterAnimation={{ opacity: 1, transform: "translate(0px, 0px)" }}
          leaveAnimation={{ opacity: 0, transform: "translate(0px, 150px)" }}
          offsetTop={150}
          offsetBottom={150}
        >
          <div className="text blue">
            <CenterContainer>
              <p>
                <strong>BLUE CONTAINER</strong>
              </p>
              <p>Relative offset position of this container & window:</p>
              <BS />
              <p>{`{X: ${windowRelativeOffset.x}, Y: ${windowRelativeOffset.y}}`}</p>
            </CenterContainer>
          </div>
        </NextScrollTrigger>
        <div className="text">
          <CenterContainer>Text 3</CenterContainer>
        </div>
        <div className="text">
          <CenterContainer>Text 4</CenterContainer>
        </div>
        <div className="text">
          <CenterContainer>Text 5</CenterContainer>
        </div>
      </div>
    </MasterPageExample>
  );
};

export default NextScrollTriggerExample;
