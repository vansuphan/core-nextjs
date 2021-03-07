import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { Popconfirm, Table, Divider } from "antd";
//
import LayoutPage from "components/admin/LayoutPage";
import { DefaultStyles } from "components/admin/layout/AdminGlobalStyle";
import PageHeader from "@/dashkit/PageHeader";
import AdminButton, { ButtonSize, ButtonType } from "@/dashkit/Buttons";
import AdminIcon from "@/dashkit/Icon";
import AdminBadge from "@/dashkit/Badges";
import { HorizontalList, ListItem, ListItemSize } from "@/diginext/layout/ListLayout";
import BlockSplitter from "@/diginext/elements/BlockSplitter";
import { Input } from "@/diginext/form/Form";
import Card from "@/diginext/containers/Card";
import { showSuccess, showError, checkPermission } from "@/helpers/helpers";
import { withAuth } from "plugins/next-auth/admin";
import ApiCall from "modules/ApiCall";

const AdminRolesPage = ({ user, children }) => {
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
    const canList   = checkPermission(user, 'role_list');
    const canCreate = checkPermission(user, 'role_add');
    const canEdit   = checkPermission(user, 'role_edit');
    const canDetail = checkPermission(user, 'role_detail');
    const canDelete = checkPermission(user, 'role_delete');

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
        let orderBy = sorter == null ? 'isAdmin' : sorter.field;
        let order = sorter == null ? -1 : (sorter.order == 'ascend' ? 1 : -1);
        let filtera = typeof filters == 'string' ? filters : filter;
        let params = {
            router,
            path: `/api/v1/admin/roles?page=${page}&limit=${limit}&orderBy=${orderBy}&order=${order}&${filtera}`,
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

    const handleDeleteOne = async function(id) {
        let params = {
            router,
            path: `/api/v1/admin/roles/${id}`,
            method: "DELETE",
            token: user.token,
        };
        let res = await ApiCall(params);
        if(!res.status) return showError(res);
        showSuccess(res);
        fetchList(pagination, filter, sorter);
    };

    const handleDeleteMany = async function() {
        await selectedRowKeys.forEach(async function(id) {
            await handleDeleteOne(id);
        });
    };

    const handleSearch = function(isRest = false) {
        if(isRest) {
            formSearchRef.current.name.value = '';
        }

        let currentFilter = '';
        let currentFormSearch = {
            name:  formSearchRef.current.name.value,  
        };

        Object.keys(currentFormSearch).forEach(function(index) {
            currentFilter += `${index}=${currentFormSearch[index]}&`;
        });

        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function() {
            fetchList(pagination, currentFilter, sorter);
        }, 1000);
        setMyTimeout(loginTimeout);
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
            title: "isAdmin",
            dataIndex: "isAdmin",
            sorter: true,
            sortDirections: ["ascend", "descend"],
            render: (isAdmin) => {
                return (
                <AdminBadge size={ButtonSize.SMALL} type={isAdmin ? ButtonType.SUCCESS : ButtonType.SECONDARY}>
                    {isAdmin ? "Active" : "Disabled"}
                </AdminBadge>
                );
            },
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
                            onClick={() => router.push(`/admin/roles/edit/${row.id}`)} 
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
                    </>
                );
            }
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };

    const createBtn = (
        <React.Fragment>
            {canDelete ? <AdminButton onClick={handleDeleteMany} style={{margin: '2px'}} type={ButtonType.DANGER} >Delete</AdminButton> : ''}
            {canCreate ? <AdminButton href="/admin/roles/create">Create</AdminButton> : ''}
        </React.Fragment>
    );

    const header = (
        <PageHeader pretitle="admin" title="Roles" button={createBtn} separator={true}>
            Vai trò
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <BlockSplitter height={25} />
                
                    <Divider orientation="left">Filter</Divider>
                    <HorizontalList itemSize={ListItemSize.STRETCH}>
                        <ListItem style={{ marginRight: "1rem" }}>
                            <Input
                                ref={el => formSearchRef.current.name = el}
                                label="Name"
                                placeholder="Name"
                                maxLength="255"
                                style={{ width: '50%' }}
                            />
                        </ListItem>
                    </HorizontalList>
                    <AdminButton onClick={e => handleSearch(false)} style={{margin: '2px'}} type={ButtonType.INFO} >Search</AdminButton>
                    <AdminButton onClick={e => handleSearch(true)} style={{margin: '2px'}} type={ButtonType.SECONDARY} >Reset</AdminButton>
                    
               
            <BlockSplitter />
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

export default withAuth(AdminRolesPage);