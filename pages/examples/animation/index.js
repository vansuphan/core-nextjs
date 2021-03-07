import DashkitButton from "components/dashkit/Buttons";
// import Nav, { NavItem } from "components/dashkit/Nav";
// import Section from "components/diginext/containers/Section";
import { BS } from "components/diginext/elements/Splitters";
import SectionQueue from "components/website/examples/ant-motion/SectionQueue";
import SectionScrollAnim from "components/website/examples/ant-motion/SectionScrollAnim";
import SectionTexty from "components/website/examples/ant-motion/SectionTexty";
import SectionTweenOne from "components/website/examples/ant-motion/SectionTweenOne";
import MasterPageExample from "components/website/master/MasterPageExample";
import { useState } from "react";

const sections = [<SectionTweenOne />, <SectionQueue />, <SectionTexty />, <SectionScrollAnim />];
const defaultSectionIndex = 0;

const AnimationExamplePage = () => {
  const [section, setSection] = useState(sections[defaultSectionIndex]);

  const onSectionChange = (index) => {
    setSection(sections[index]);
  };

  return (
    <MasterPageExample header="Animations">
      <DashkitButton href="/examples/animation/react-spring">Examples of using React Spring</DashkitButton>
      <BS />
      {/* <DashkitButton href="/examples/animation/next-gsap">Examples of using Next.js GSAP plugin (của nhà trồng)</DashkitButton>
      <BS /> */}
      <DashkitButton href="/examples/animation/ant-motion">Examples of using Ant.Motion</DashkitButton>
      <BS />
    </MasterPageExample>
  );
};

export default AnimationExamplePage;
