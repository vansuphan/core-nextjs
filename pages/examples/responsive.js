import MasterPageExample from "components/website/master/MasterPageExample";
import asset from "plugins/assets/asset";
import CONFIG from "web.config";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Breakpoints, useNextOrientation, useNextResponsive } from "plugins/next-reponsive";
import { GridList, HorizontalList, ListItem, ListItemSize, VerticalList } from "components/diginext/layout/ListLayout";
import Color from "plugins/utils/Color";
import BlockSplitter from "components/diginext/elements/BlockSplitter";
import DashkitButton from "components/dashkit/Buttons";

// export { getServerSideProps } from "plugins/next-session";

const Thumb = ({ children }) => {
  // const [randColor, setRandColor] = useState(Color.random(true));
  // const randColor = useMemo(() => Color.random(true), []);
  // useEffect(() => {
  //   setRandColor(Color.random(true));
  // }, []);

  // const randColor = Color.random(true);

  return (
    <div className="thumb" style={{ height: "200px", border: "1px solid black" }}>
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "20px",
        }}
      >
        {children}
      </span>
    </div>
  );
};

export default function Home(props) {
  // console.log(props);
  // console.log(CONFIG);
  const router = useRouter();

  let responsive = useNextResponsive();
  let orientation = useNextOrientation();

  const list = useMemo(
    () => (
      <>
        <ListItem key="item-1">
          <Thumb>1</Thumb>
        </ListItem>
        <ListItem key="item-2">
          <Thumb>2</Thumb>
        </ListItem>
        <ListItem key="item-3">
          <Thumb>3</Thumb>
        </ListItem>
        <ListItem key="item-4">
          <Thumb>4</Thumb>
        </ListItem>
      </>
    ),
    []
  );

  const LayoutDesktop = (
    <HorizontalList itemSize={ListItemSize.STRETCH} style={{ width: "100%" }}>
      {list}
    </HorizontalList>
  );

  const LayoutTablet = <GridList col={2}>{list}</GridList>;

  const LayoutMobile = <VerticalList style={{ width: "100%" }}>{list}</VerticalList>;

  const [layout, setLayout] = useState(LayoutDesktop);

  useEffect(() => {
    // console.log(props.user);
    console.log(responsive);
    switch (responsive.device) {
      case "tablet":
        setLayout(LayoutTablet);
        break;
      case "mobile":
        setLayout(LayoutMobile);
        break;
      default:
        setLayout(LayoutDesktop);
        break;
    }
  }, [JSON.stringify(responsive)]);

  return (
    <MasterPageExample>
      <style jsx>{`
        .text-center {
          text-align: center;
        }
      `}</style>
      <BlockSplitter height={20} />
      <h1 className="text-center" style={{ color: responsive.device == "desktop" ? "red" : "blue" }}>
        {responsive.device}
      </h1>
      <h2 className="text-center">{orientation}</h2>
      <BlockSplitter height={20} />
      <div className="text-center">
        <DashkitButton href="/examples">GO BACK</DashkitButton>
      </div>
      <BlockSplitter height={20} />
      {layout}
    </MasterPageExample>
  );
}
