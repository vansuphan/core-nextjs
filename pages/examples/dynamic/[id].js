import MasterPageExample from "components/website/master/MasterPageExample";
import CONFIG from "web.config";
import BasicLayout from "components/diginext/layout/BasicLayout";

export async function getServerSideProps({ query, params }) {
  console.log(query, params);
  console.log(CONFIG.PUBLIC_APP_DOMAIN);

  return {
    props: {
      params,
      query,
    },
  };
}

export default function RequestApi({ params, query, req }) {
  return (
    <MasterPageExample>
      <h1>Dynamic params: {JSON.stringify(params)}</h1>
    </MasterPageExample>
  );
}
