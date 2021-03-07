import AdminMasterPage from "components/admin/layout/AdminMasterPage";

import { DefaultStyles } from "components/dashkit/style/DashkitGlobalStyle";

import {
  HorizontalList,
  // VerticalList,
  // GridList,
  ListItem,
  ListItemSize,
  ListType,
  // VerticalListAlign,
  // HorizontalListAlign,
} from "components/diginext/layout/ListLayout";

import Section from "components/diginext/containers/Section";
import ExpandContainer from "components/diginext/containers/ExpandContainer";
import SidebarComponentList from "components/dashkit/SidebarComponentList";
import SectionHeader from "components/dashkit/PageHeader";
import SectionBadges from "components/dashkit/sections/SectionBadges";
import SectionButtons from "components/dashkit/sections/SectionButtons";
import SectionForms from "components/dashkit/sections/SectionForms";
import SectionEditors from "components/dashkit/sections/SectionEditors";
import SectionDropdowns from "components/dashkit/sections/SectionDropdowns";
import SectionButtonGroups from "components/dashkit/sections/SectionButtonGroups";
import SectionBreadcrumbs from "components/dashkit/sections/SectionBreadcrumbs";
import SectionCards from "components/dashkit/sections/SectionCards";
import SectionTooltips from "components/dashkit/sections/SectionTooltips";
import SectionPaginations from "components/dashkit/sections/SectionPaginations";
import SectionPageHeaders from "components/dashkit/sections/SectionPageHeaders";
import SectionTables from "components/dashkit/sections/SectionTables";
import SectionNavs from "components/dashkit/sections/SectionNavs";
import SectionNotifications from "components/dashkit/sections/SectionNotifications";
import SectionModals from "components/dashkit/sections/SectionModals";
import { useState } from "react";

import _startCase from "lodash/startCase";

const sections = {
  default: (section) => (
    <Section id={section} padding="30px">
      <SectionHeader title={_startCase(section)} separator={true}></SectionHeader>
      <p>Coming soon.</p>
    </Section>
  ),
  alerts: (
    <Section id="alerts" padding="30px">
      <SectionHeader title="Alerts" separator={true}></SectionHeader>
    </Section>
  ),
  badges: <SectionBadges />,
  breadcrumbs: <SectionBreadcrumbs />,
  buttons: <SectionButtons />,
  "button-groups": <SectionButtonGroups />,
  cards: <SectionCards />,
  dropdowns: <SectionDropdowns />,
  forms: <SectionForms />,
  "text-editors": <SectionEditors />,
  navs: <SectionNavs />,
  notifications: <SectionNotifications />,
  modals: <SectionModals />,
  "page-headers": <SectionPageHeaders />,
  paginations: <SectionPaginations />,
  tables: <SectionTables />,
  tooltips: <SectionTooltips />,
};

const ComponentList = ({ section = "alerts" }) => {
  return (
    <div style={{ maxWidth: DefaultStyles.container.maxWidthLG, margin: "auto" }}>
      <Section padding="0px 30px">
        <SectionHeader title="Component List" separator={false} spaceBottom={false}>
          List of all available components.
        </SectionHeader>
      </Section>

      {sections[section] || sections["default"](section)}
    </div>
  );
};

const ComponentListPage = () => {
  const [currentSection, setCurrentSection] = useState("alerts");

  return (
    <AdminMasterPage>
      <HorizontalList
        type={ListType.START}
        align="stretch"
        style={{ position: "fixed", width: "100%", height: "100%" }}
      >
        {/* Sidebar */}

        <ListItem style={{ overflow: "auto", width: "250px" }}>
          <SidebarComponentList onChange={(section) => setCurrentSection(section)} />
        </ListItem>

        {/* Page Content */}
        <ListItem size={ListItemSize.STRETCH} style={{ overflow: "auto" }}>
          <ComponentList section={currentSection} />
        </ListItem>
      </HorizontalList>
    </AdminMasterPage>
  );
};

export default ComponentListPage;
