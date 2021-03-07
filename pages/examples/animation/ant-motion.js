import Nav, { NavItem } from "components/dashkit/Nav";
import Section from "components/diginext/containers/Section";
import SectionQueue from "components/website/examples/ant-motion/SectionQueue";
import SectionScrollAnim from "components/website/examples/ant-motion/SectionScrollAnim";
import SectionTexty from "components/website/examples/ant-motion/SectionTexty";
import SectionTweenOne from "components/website/examples/ant-motion/SectionTweenOne";
import MasterPageExample from "components/website/master/MasterPageExample";
import { useState } from "react";

const sections = [<SectionTweenOne />, <SectionQueue />, <SectionTexty />, <SectionScrollAnim />];
const defaultSectionIndex = 0;

const AntMotionExamplePage = () => {
  const [section, setSection] = useState(sections[defaultSectionIndex]);

  const onSectionChange = (index) => {
    setSection(sections[index]);
  };

  return (
    <MasterPageExample header="Animation with Ant.Motion">
      <style jsx global>{`
        .red-circle {
          background-color: red;
          border-radius: 50%;
          width: 80px;
          height: 80px;
        }
      `}</style>
      
      <Nav defaultActiveIndex={defaultSectionIndex} onChange={onSectionChange}>
        <NavItem>TweenOne</NavItem>
        <NavItem>QueueAnim</NavItem>
        <NavItem>TextyAnim</NavItem>
        <NavItem>ScrollAnim</NavItem>
      </Nav>

      <Section spaceTop>{section}</Section>
    </MasterPageExample>
  );
};

export default AntMotionExamplePage;
