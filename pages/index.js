// import CONFIG from "web.config";
import MasterPageExample from "components/website/master/MasterPageExample";
// import BasicLayout from "components/diginext/layout/BasicLayout";
// import { useRouter } from "next/router";
// import Header from "components/website/elements/Header";
import DashkitButton from "components/dashkit/Buttons";
import { BS } from "components/diginext/elements/Splitters";

export default function Home(props) {
  // const router = useRouter();

  return (
    <MasterPageExample hidePrevButton header="Diginext - Home Page">
      {/* <h2>Hello world!</h2> */}
      <DashkitButton href="/examples">VIEW EXAMPLES</DashkitButton>
      <BS />
      <DashkitButton href="/dashkit">DASHKIT COMPONENTS</DashkitButton>
      <BS />
    </MasterPageExample>
  );
}
