import LayoutPage from "components/admin/LayoutPage";
import PageHeader from "components/dashkit/PageHeader";

import { withAuth } from "plugins/next-auth/admin";

const AdminIndex = ({ user }) => {

    const header = (
        <PageHeader pretitle="admin" title="Dashboard" separator={true}>
            Thông số tổng quát.
        </PageHeader>
    );

    return <LayoutPage header={header} user={user}></LayoutPage>;
};

export default withAuth(AdminIndex);