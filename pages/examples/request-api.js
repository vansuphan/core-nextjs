import MasterPageExample from "components/website/master/MasterPageExample";
import CONFIG from "web.config";
import BasicLayout from "components/diginext/layout/BasicLayout";

export async function getServerSideProps({ query }) {
  console.log(query);
  console.log(CONFIG.PUBLIC_APP_DOMAIN);

  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = await response.json();

  // console.log(data);

  return {
    props: {
      query,
      data,
    },
  };
}

export default function RequestApi({ query, data }) {
  return (
    <MasterPageExample>
        <style jsx>{`
          .item {
            display: block;
          }
        `}</style>
        <h1>Request API to get data -> query: {JSON.stringify(query)}</h1>
        <ul>
          {data.map((item, index) => (
            <li className="item" key={index}>
              {index + 1} - {item.title}.
            </li>
          ))}
        </ul>
    </MasterPageExample>
  );
}
