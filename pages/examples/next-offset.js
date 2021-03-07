import CenterContainer from "@/components/diginext/containers/CenterContainer";
import Code from "@/components/diginext/elements/Code";
import { BS } from "@/components/diginext/elements/Splitters";
import { HorizontalList, ListItem } from "@/components/diginext/layout/ListLayout";
import MasterPageExample from "@/components/website/master/MasterPageExample";
import useNextOffset from "plugins/next-offset";
import { useNextScroll } from "plugins/next-scroll";
import React, { useRef } from "react";

const NextOffsetExample = () => {
  // relative offset with parent element (VERTICAL):
  const insideRef = useRef();
  const parentRef = useRef();
  const parentRelativeOffset = useNextOffset(insideRef, parentRef);

  // relative offset with parent element (HORIZONTAL):
  const insideRef2 = useRef();
  const parentRef2 = useRef();
  const parentRelativeOffset2 = useNextOffset(insideRef2, parentRef2);

  // relative offset with window:
  const containerRef = useRef();
  const windowRelativeOffset = useNextOffset(containerRef);

  return (
    <MasterPageExample header="Examples of using '/plugins/next-offset'">
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
          border: 1px solid gray;

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

      {/* <div className="bottom-bar">
        <p>
          Relative offsetX of <strong className="text-blue">BLUE</strong> container & window: {windowRelativeOffset.x}
        </p>
        <p>
          Relative offsetY of <strong className="text-blue">BLUE</strong> container & window: {windowRelativeOffset.y}
        </p>
      </div> */}

      <div>
        <h2>Vertical scroll container</h2>
        <p>Track relative offset positions of an element with its parent element</p>
        <BS />
        <div className="container" ref={parentRef}>
          <div className="text">
            <CenterContainer>Text 1</CenterContainer>
          </div>
          <div className="text red" ref={insideRef}>
            <CenterContainer>
              <p>Offset X: {parentRelativeOffset.x}</p>
              <p>Offset Y: {parentRelativeOffset.y}</p>
            </CenterContainer>
          </div>
          <div className="text">
            <CenterContainer>Text 3</CenterContainer>
          </div>
          <div className="text">
            <CenterContainer>Text 4</CenterContainer>
          </div>
        </div>

        <BS />
        <h2>Horizontal scroll container</h2>
        <div className="container">
          <HorizontalList scrollable style={{ height: "100%" }} align="stretch" ref={parentRef2}>
            <ListItem>
              <div className="text fixed-width">
                <CenterContainer>Text 1</CenterContainer>
              </div>
            </ListItem>
            <ListItem>
              <div className="text fixed-width green" ref={insideRef2}>
                <CenterContainer>
                  <p>Offset X: {parentRelativeOffset2.x}</p>
                  <p>Offset Y: {parentRelativeOffset2.y}</p>
                </CenterContainer>
              </div>
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
        <div className="text blue" ref={containerRef}>
          <CenterContainer>
            <p>
              <strong>BLUE CONTAINER</strong>
            </p>
            <p>Relative offset position of this container & window:</p>
            <BS />
            <p>{`{X: ${windowRelativeOffset.x}, Y: ${windowRelativeOffset.y}}`}</p>
          </CenterContainer>
        </div>
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

export default NextOffsetExample;
