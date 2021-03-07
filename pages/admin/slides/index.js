import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { Popconfirm, Table } from "antd";
//
import LayoutPage from "components/admin/LayoutPage";
import { DefaultStyles } from "components/admin/layout/AdminGlobalStyle";
import AdminIcon from "@/dashkit/Icon";
import AdminBadge from "@/dashkit/Badges";
import PageHeader from "@/dashkit/PageHeader";
import AdminButton, { ButtonSize, ButtonType } from "@/dashkit/Buttons";
import BlockSplitter from "@/diginext/elements/BlockSplitter";
import Card from "@/diginext/containers/Card";
import { showSuccess, showError, checkPermission } from "@/helpers/helpers";
import ApiCall from "modules/ApiCall";
import { withAuth } from "plugins/next-auth/admin";

const AdminSlidesPage = ({ user, children }) => {
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
    const canList         = checkPermission(user, 'slide_list');
    const canCreate       = checkPermission(user, 'slide_add');
    const canEdit         = checkPermission(user, 'slide_edit');
    const canDetail       = checkPermission(user, 'slide_detail');
    const canDelete       = checkPermission(user, 'slide_delete');
    const canBannerList   = checkPermission(user, 'banner_list');

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
        let limit = pagination == null ? 10 : pagination.pageSize;
        let page = pagination == null ? 1 : pagination.current;
        let orderBy = sorter == null ? 'id' : sorter.field;
        let order = sorter == null ? -1 : (sorter.order == 'ascend' ? 1 : -1);
        let filtera = typeof filters == 'string' ? filters : filter;
        let params = {
            router,
            path: `/api/v1/admin/slides?page=${page}&limit=${limit}&orderBy=${orderBy}&order=${order}&${filtera}`,
            token: user.token
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

    const handleDeleteMany = async function(id = null) {
        let query = '';
        if(id) {
            query = `ids[]=${id}`;
        } else {
            selectedRowKeys.forEach(function(id) {
                query += `ids[]=${id}&`
            });
        }
        if(!query) return;
        let params = {
            router,
            path: `/api/v1/admin/slides?${query}`,
            method: "DELETE",
            token: user.token,
        };
        let res = await ApiCall(params);
        if(!res.status) return showError(res);
        showSuccess(res);
        fetchList(pagination, filter, sorter);
        if(!id) setSelectedRowKeys([]);
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            sorter: true,
            sortDirections: ["ascend", "descend"],
            render: (name, row, index) => {
                return name;
            }
        },
        {
            title: "Status",
            dataIndex: "active",
            sorter: true,
            sortDirections: ["ascend", "descend"],
            render: (active) => {
                return (
                    <AdminBadge size={ButtonSize.SMALL} type={active ? ButtonType.SUCCESS : ButtonType.SECONDARY}>
                        {active ? "Active" : "Disabled"}
                    </AdminBadge>
                );
            },
        },
        {
            title: "Page",
            dataIndex: "atPage",
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
                            onClick={() => router.push(`/admin/slides/edit/${row.id}`)} 
                            size={ButtonSize.SMALL}
                            style={{marginRight: '5px', display: !canDetail || !canEdit ? 'none' : ''}}
                        >
                            <AdminIcon name="edit" width={14} />
                        </AdminButton>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteMany(row.id)}>
                            <AdminButton 
                                type={ButtonType.DANGER}
                                size={ButtonSize.SMALL}
                                style={{marginRight: '5px', display: !canDelete ? 'none' : ''}}>
                                <AdminIcon name="delete" width={14} />
                            </AdminButton>
                        </Popconfirm>
                        <AdminButton 
                            onClick={() => router.push(`/admin/banners?slideId=${row.id}`)}
                            size={ButtonSize.SMALL}
                            style={{display: !canBannerList ? 'none' : ''}}
                        >
                            <AdminIcon name="arrow-right" width={12} />
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
            {canDelete ? <AdminButton onClick={() => handleDeleteMany(null)} style={{margin: '2px'}} type={ButtonType.DANGER} >Delete</AdminButton> : ''}
            {canCreate ? <AdminButton href="/admin/slides/create">Create</AdminButton> : ''}
        </React.Fragment>
    );

    const header = (
        <PageHeader pretitle="admin" title="Slides" button={createBtn} separator={true}>
            Slide
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

export default withAuth(AdminSlidesPage);