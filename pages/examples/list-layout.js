import MasterPageExample from "components/website/master/MasterPageExample";
import {
  HorizontalList,
  ListItem,
  ListItemSize,
  VerticalList,
  GridList,
  ListType,
  HorizontalListAlign,
  VerticalListAlign,
} from "components/diginext/layout/ListLayout";
import BasicLayout from "components/diginext/layout/BasicLayout";
import Header from "components/website/elements/Header";
import ScrollToTop from "@/components/website/buttons/ButtonScrollToTop";

const DemoListLayout = () => {
  return (
    <MasterPageExample header="Examples of HorizontalList, VerticalList & GridList">
      <BasicLayout>
        <style jsx>{`
          h3 {
            padding: 20px;
            border: 1px solid rgba(0, 0, 0, 0.3);
            margin: 0;
            text-align: center;
          }
          .space5px {
            margin-right: 5px;
            margin-bottom: 5px;
          }
        `}</style>

        <p>
          Using: <strong>ListType.SPACE_BETWEEN</strong>
        </p>
        <HorizontalList type={ListType.SPACE_BETWEEN} align={HorizontalListAlign.MIDDLE}>
          <h3>Item 1</h3>
          <h3>Item 2</h3>
          <h3>Item 3</h3>
          <h3>Item 4</h3>
          <h3>Item 5</h3>
          <h3>Item 6</h3>
        </HorizontalList>

        <hr />
        <p>
          Using: <strong>ListType.SPACE_AROUND</strong>
        </p>
        <HorizontalList type={ListType.SPACE_AROUND} align={HorizontalListAlign.MIDDLE}>
          <h3>Item 1</h3>
          <h3>Item 2</h3>
          <h3>Item 3</h3>
          <h3>Item 4</h3>
        </HorizontalList>

        <hr />
        <p>
          Using: <strong>ListType.START</strong>
        </p>
        <HorizontalList type={ListType.START} align={HorizontalListAlign.MIDDLE}>
          <h3 className="space5px">Item 1</h3>
          <h3 className="space5px">Item 2</h3>
          <h3 className="space5px">Item 3</h3>
          <h3 className="space5px">Item 4</h3>
        </HorizontalList>

        <hr />
        <p>
          Using: <strong>ListType.CENTER</strong>
        </p>
        <HorizontalList type={ListType.CENTER} align={HorizontalListAlign.MIDDLE}>
          <h3 className="space5px">Item 1</h3>
          <h3 className="space5px">Item 2</h3>
          <h3 className="space5px">Item 3</h3>
          <h3 className="space5px">Item 4</h3>
        </HorizontalList>

        <hr />
        <p>
          Using: <strong>ListType.END</strong>
        </p>
        <HorizontalList type={ListType.END} align={HorizontalListAlign.MIDDLE}>
          <h3 className="space5px">Item 1</h3>
          <h3 className="space5px">Item 2</h3>
          <h3 className="space5px">Item 3</h3>
          <h3 className="space5px">Item 4</h3>
        </HorizontalList>

        <hr />
        <p>
          <strong>Expand item 2 & item 3</strong>
        </p>
        <HorizontalList type={ListType.START}>
          <h3 className="space5px">Item 1</h3>
          <ListItem size={ListItemSize.STRETCH}>
            <h3 className="space5px">Item 2</h3>
          </ListItem>
          <ListItem size={ListItemSize.STRETCH}>
            <h3 className="space5px">Item 3</h3>
          </ListItem>
          <h3 className="space5px">Item 4</h3>
        </HorizontalList>

        <hr />
        <p>
          <strong>Add expanded spacing after item 1</strong>
        </p>
        <HorizontalList type={ListType.START}>
          <h3 className="space5px" style={{ marginRight: "auto" }}>
            Item 1
          </h3>
          <h3 className="space5px">Item 2</h3>
          <h3 className="space5px">Item 3</h3>
          <h3 className="space5px">Item 4</h3>
        </HorizontalList>

        <hr />
        <p>
          <strong>wrap = TRUE</strong>
        </p>
        <HorizontalList type={ListType.START} wrap={true}>
          <h3 className="space5px" style={{ width: "300px" }}>
            Item 1
          </h3>
          <h3 className="space5px" style={{ width: "150px" }}>
            Item 2
          </h3>
          <h3 className="space5px" style={{ width: "200px" }}>
            Item 3
          </h3>
          <h3 className="space5px" style={{ width: "350px" }}>
            Item 4
          </h3>
          <h3 className="space5px" style={{ width: "250px" }}>
            Item 4
          </h3>
          <h3 className="space5px" style={{ width: "300px" }}>
            Item 4
          </h3>
        </HorizontalList>
      </BasicLayout>

      <hr />

      <BasicLayout padding="50px">
        <style jsx>{`
          h3 {
            width: 350px;
            padding: 20px;
            border: 1px solid rgba(0, 0, 0, 0.3);
            margin: 0;
            text-align: center;
          }
        `}</style>
        <h2>Example of HorizontalList (scrollable)</h2>
        <HorizontalList type={ListType.SPACE_BETWEEN} align={HorizontalListAlign.MIDDLE}>
          <ListItem>
            <h3>Item 1</h3>
          </ListItem>
          <ListItem>
            <h3 style={{ height: "100px" }}>Item 2</h3>
          </ListItem>
          <ListItem>
            <h3 style={{ height: "150px" }}>Item 3</h3>
          </ListItem>
          <ListItem>
            <h3>Item 4</h3>
          </ListItem>
          <ListItem>
            <h3>Item 5</h3>
          </ListItem>
          <ListItem>
            <h3>Item 6</h3>
          </ListItem>
        </HorizontalList>
      </BasicLayout>

      <hr />

      <BasicLayout padding="50px">
        <style jsx>{`
          h3 {
            width: 300px;
            height: 150px;
            padding: 20px;
            border: 1px solid rgba(0, 0, 0, 0.3);
            margin: 0;
            text-align: center;
          }
          .nosize {
            width: auto;
            height: auto;
          }
        `}</style>
        <h2>Example of VerticalList</h2>

        <p>
          type = <strong>ListType.STRETCH</strong>
        </p>
        <VerticalList>
          <h3 className="nosize">Item 1</h3>
          <h3 className="nosize">Item 2</h3>
          <h3 className="nosize">Item 3</h3>
          <h3 className="nosize">Item 4</h3>
        </VerticalList>

        <p>
          scrollable = <strong>TRUE</strong>
        </p>
        <VerticalList align={VerticalListAlign.CENTER} style={{ height: "200px" }}>
          <ListItem>
            <h3>Item 1</h3>
          </ListItem>
          <ListItem>
            <h3 style={{ width: "500px" }}>Item 2</h3>
          </ListItem>
          <ListItem>
            <h3>Item 3</h3>
          </ListItem>
        </VerticalList>
      </BasicLayout>

      <hr />

      <BasicLayout padding="50px">
        <style jsx>{`
          h3 {
            padding: 40px 20px;
            border: 1px solid rgba(0, 0, 0, 0.3);
            margin: 0;
            text-align: center;
            width: 100%;
            height: 100%;
          }
        `}</style>
        <h2>Example of GridList</h2>
        <GridList col={3}>
          <ListItem>
            <h3>Item 1</h3>
          </ListItem>
          <ListItem>
            <h3>Item 2</h3>
          </ListItem>
          <ListItem>
            <h3>Item 3</h3>
          </ListItem>
          <ListItem>
            <h3>Item 4</h3>
          </ListItem>
          <ListItem>
            <h3>Item 5</h3>
          </ListItem>
        </GridList>
      </BasicLayout>
      <ScrollToTop />
    </MasterPageExample>
  );
};

export default DemoListLayout;
