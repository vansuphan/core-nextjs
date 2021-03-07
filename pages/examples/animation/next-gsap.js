// import { useCounter } from "ahooks";
// import DashkitButton, { ButtonType } from "components/dashkit/Buttons";
import Nav, { NavItem } from "components/dashkit/Nav";
import Section from "components/diginext/containers/Section";
// import { BS, LS } from "components/diginext/elements/Splitters";
// import SectionGsapExampleBasic from "components/website/examples/next-gsap/SectionGsapExampleBasic";
import SectionGsapExampleControllerHook from "components/website/examples/next-gsap/SectionGsapExampleControllerHook";
// import SectionGsapExampleStagger from "components/website/examples/next-gsap/SectionGsapExampleStagger";
// import SectionGsapExampleTargetHook from "components/website/examples/next-gsap/SectionGsapExampleTargetHook";
// import SectionGsapExampleTweenComponent from "components/website/examples/next-gsap/SectionGsapExampleTweenComponent";
import SectionTimelineExampleBasic from "components/website/examples/next-gsap/SectionTimelineExampleBasic";
import MasterPageExample from "components/website/master/MasterPageExample";
import { useState } from "react";

const TabGsap = () => {
  return (
    <>
      {/* <SectionGsapExampleTargetHook /> */}
      {/* <SectionGsapExampleTweenComponent /> */}
      {/* <SectionGsapExampleStagger /> */}
      <SectionGsapExampleControllerHook />
    </>
  );
};

const TabTimeline = () => {
  return (
    <>
      <SectionTimelineExampleBasic />
    </>
  );
};

const sections = [<TabGsap />, <TabTimeline />];
const defaultSectionIndex = 0;

const AntMotionExamplePage = () => {
  const [section, setSection] = useState(sections[defaultSectionIndex]);

  const onSectionChange = (index) => {
    setSection(sections[index]);
  };

  return (
    <MasterPageExample header="Animation with Next GSAP plugin">
      <style jsx global>{`
        .red-circle {
          background-color: red;
          border-radius: 50%;
          width: 50px;
          height: 50px;
        }
      `}</style>

      <Nav defaultActiveIndex={defaultSectionIndex} onChange={onSectionChange}>
        <NavItem>Gsap</NavItem>
        <NavItem>Timeline</NavItem>
      </Nav>

      <Section spaceTop>{section}</Section>
    </MasterPageExample>
  );
};

export default AntMotionExamplePage;
