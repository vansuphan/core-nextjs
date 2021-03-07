import "antd/dist/antd.min.css";
import "styles/global.scss";
import "slick-carousel/slick/slick.css";
import "quill/dist/quill.snow.css";
import { ConfigLive } from "plugins/utils/ConfigLive";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    ConfigLive.consoleHandle();
    return () => {};
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
