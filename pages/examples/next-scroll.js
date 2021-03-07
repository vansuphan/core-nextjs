import CenterContainer from "@/components/diginext/containers/CenterContainer";
import Code from "@/components/diginext/elements/Code";
import { BS } from "@/components/diginext/elements/Splitters";
import MasterPageExample from "@/components/website/master/MasterPageExample";
import { useNextScroll } from "plugins/next-scroll";
import React, { useRef } from "react";

const NextScrollExample = () => {
  const containerRef = useRef();
  const containerScroll = useNextScroll(containerRef);

  const windowScroll = useNextScroll();

  return (
    <MasterPageExample header="Examples of using '/plugins/next-scroll' Hook">
      <style jsx>{`
        .container {
          width: 400px;
          height: 400px;
          border: 1px solid black;
          overflow: auto;
        }
        .text {
          position: relative;
          width: 100%;
          height: 300px;
          border: 1px solid gray;
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

      <div className="bottom-bar">
        <p>window.scrollLeft: {windowScroll.x}</p>
        <p>window.scrollTop: {windowScroll.y}</p>
      </div>

      <Code>
        {`import { useNextScroll } from "plugins/next-scroll";
...
const containerRef = useRef();
const containerScroll = useNextScroll(containerRef);
// console.log(containerScroll.x, containerScroll.y);`}
      </Code>

      <div>
        <div className="container" ref={containerRef}>
          <div className="text">
            <CenterContainer>Text 1</CenterContainer>
          </div>
          <div className="text">
            <CenterContainer>Text 2</CenterContainer>
          </div>
          <div className="text">
            <CenterContainer>Text 3</CenterContainer>
          </div>
          <div className="text">
            <CenterContainer>Text 4</CenterContainer>
          </div>
        </div>
        <p>ScrollX: {containerScroll.x}</p>
        <p>ScrollY: {containerScroll.y}</p>
      </div>

      <BS size={50} />

      <Code>
        {`import { useNextScroll } from "plugins/next-scroll";
...
// automatically track "window" scroll position if not passing any target ref
const windowScroll = useNextScroll();
// console.log(windowScroll.x, windowScroll.y);`}
      </Code>

      <div>
        <div className="text">
          <CenterContainer>Text 1</CenterContainer>
        </div>
        <div className="text">
          <CenterContainer>Text 2</CenterContainer>
        </div>
        <div className="text">
          <CenterContainer>Text 3</CenterContainer>
        </div>
        <div className="text">
          <CenterContainer>Text 4</CenterContainer>
        </div>
      </div>
    </MasterPageExample>
  );
};

export default NextScrollExample;
