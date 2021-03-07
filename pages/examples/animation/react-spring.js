import DashkitButton from "@/components/dashkit/Buttons";
import ReactSpringBasic from "@/components/website/examples/react-spring/ReactSpringBasic";
import ReactSpringConfig from "@/components/website/examples/react-spring/ReactSpringConfig";
import ReactSpringHook from "@/components/website/examples/react-spring/ReactSpringHook";
import Nav, { NavItem } from "components/dashkit/Nav";
import Section from "components/diginext/containers/Section";
import MasterPageExample from "components/website/master/MasterPageExample";
import { useState } from "react";

const sections = [<ReactSpringBasic />, <ReactSpringHook />, <ReactSpringConfig />];
const defaultSectionIndex = 0;

const ReactSpringExample = () => {
  const [section, setSection] = useState(sections[defaultSectionIndex]);

  const onSectionChange = (index) => {
    setSection(sections[index]);
  };

  return (
    <MasterPageExample header="Animation with React Spring">
      <Nav gutter={10} defaultActiveIndex={defaultSectionIndex} onChange={onSectionChange}>
        <DashkitButton>Spring Component</DashkitButton>
        <DashkitButton>Hooks</DashkitButton>
        <DashkitButton>Configuration</DashkitButton>
      </Nav>

      <Section spaceTop>{section}</Section>
    </MasterPageExample>
  );
};

export default ReactSpringExample;
