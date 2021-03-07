import { useState } from "react";

import Section from "@/components/diginext/containers/Section";
import { HorizontalList } from "@/components/diginext/layout/ListLayout";
import SingleImage from "@/components/diginext/upload/singleImage";
import MasterPageExample from "@/components/website/master/MasterPageExample";

const DashkitEditPage = ({ children }) => {

  const [formInput, setFormInput] = useState({});

  // Single Upload
  const handleChangeSingleUpload = (type, data) => {
    setFormInput({
      ...formInput,
      ...data
    })
  }
  return (<MasterPageExample header={
    <div>
      <h3>Edit page example</h3>
      <span style={{ fontSize: 12 }}><small>(consider replace this <code> {"<MasterPageExample />"} to {"<LayoutPage/>"} for admin pages </code>)</small></span>
    </div>
  }>

    <Section style={{ padding: "2rem 0" }}>
      <label style={{ marginBottom: "15px" }}>Example Image </label>
      <HorizontalList style={{ width: "50%" }}>
        <SingleImage
          width="25"
          name="exampleImage"
          imageUrl={formInput.exampleImageUrl}
          handleChange={handleChangeSingleUpload}
        />

      </HorizontalList>
    </Section>

  </MasterPageExample>);
};

export default DashkitEditPage;
