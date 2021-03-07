import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { Table } from "antd";
//
import LayoutPage from "components/admin/LayoutPage";
import { DefaultStyles } from "components/admin/layout/AdminGlobalStyle";
import PageHeader from "@/dashkit/PageHeader";
import AdminButton, { ButtonSize } from "@/dashkit/Buttons";
import AdminIcon from "@/dashkit/Icon";
import BlockSplitter from "@/diginext/elements/BlockSplitter";
import Card from "@/diginext/containers/Card";
import { showError, checkPermission } from "@/helpers/helpers";
import { getObjectTrans } from "@/helpers/translation";
import { withAuth } from "plugins/next-auth/admin";
import ApiCall from "modules/ApiCall";

const AdminPagesPage = ({ user, children }) => {
    const router = useRouter();
    const formSearchRef = useRef({});
    const [myTimeout, setMyTimeout] = useState();
    const [tableData, setTableData] = useState([]);
    const [pagination, setPagination] = useState({});
    const [sorter, setSorter] = useState({});
    const [filter, setFilter] = useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectionType, setSelectionType] = useState("checkbox");

    //Permissions
    const canList   = checkPermission(user, 'page_list');
    const canEdit   = checkPermission(user, 'page_edit');
    const canDetail = checkPermission(user, 'page_detail');


    //Init load
    useEffect(function() {
        if(!canList) {
            router.push('/admin');
        } else {
            fetchList();
        }
    }, []);

    //Methods
    const fetchList = async function(pagination = null, filters = null, sorter = null) {
        let limit = pagination == null ? 100 : pagination.pageSize;
        let page = pagination == null ? 1 : pagination.current;
        let orderBy = sorter == null ? 'id' : sorter.field;
        let order = sorter == null ? -1 : (sorter.order == 'ascend' ? 1 : -1);
        let filtera = typeof filters == 'string' ? filters : filter;
        let params = {
            router,
            path: `/api/v1/admin/pages?page=${page}&limit=${limit}&orderBy=${orderBy}&order=${order}&${filtera}`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if(!res.status) return showError(res);
        let list = res.data.list;
        let paginator = res.data.paginator;
        setTableData(list);
        setPagination({
            current: paginator.currentPage,
            pageSize: paginator.limit,
            pageSizeOptions: [10, 20, 50],
            showSizeChanger: true,
            showTitle: true,
            total: paginator.total
        });
        setSorter({
            field: orderBy,
            order: order
        });
        setFilter(filtera);
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            sorter: true,
            sortDirections: ["ascend", "descend"],
            render: (name, row, index) => {
                return getObjectTrans(name);
            }
        },
        {
            title: "Created date",
            dataIndex: "createdAt",
            sorter: true,
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, row) => {
                return (
                    <>
                        <AdminButton
                            onClick={() => router.push(`/admin/pages/edit/${row.id}`)} 
                            size={ButtonSize.SMALL}
                            style={{marginRight: '5px', display: !canDetail || !canEdit ? 'none' : ''}}
                        >
                            <AdminIcon name="edit" width={14} />
                        </AdminButton>
                    </>
                );
            },
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };

    const createBtn = (
        <React.Fragment>

        </React.Fragment>
    );

    const header = (
        <PageHeader pretitle="admin" title="Page" button={createBtn} separator={true}>
            Trang
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <BlockSplitter height={25} />
                <Card>
                    <Table
                        rowKey={item => item.id}
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={tableData}
                        scroll={{ x: DefaultStyles.container.maxWidthMD }}
                        pagination={pagination}
                        onChange={fetchList}
                    />
                </Card>
            <BlockSplitter />
        </LayoutPage>
    );
};

export default withAuth(AdminPagesPage);