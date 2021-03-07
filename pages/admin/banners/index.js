import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { Popconfirm, Table, Divider, Select, Image  } from "antd";
//
import PageHeader from "components/dashkit/PageHeader";
import LayoutPage from "components/admin/LayoutPage";
import AdminBadge from "components/dashkit/Badges";
import AdminIcon from "components/dashkit/Icon";
import { DefaultStyles } from "components/admin/layout/AdminGlobalStyle";
import AdminButton, { ButtonSize, ButtonType } from "components/dashkit/Buttons";
import BlockSplitter from "@/diginext/elements/BlockSplitter";
import { Input, InputSelect } from "@/diginext/form/Form";
import { HorizontalList, ListItem, ListItemSize } from "@/diginext/layout/ListLayout";
import Card from "@/diginext/containers/Card";
import AppLink from "@/diginext/link/AppLink";
import { showSuccess, showError, checkPermission, showNotifications } from "@/helpers/helpers";
import { getObjectTrans } from "@/helpers/translation";
import ApiCall from "modules/ApiCall";
import { withAuth } from "plugins/next-auth/admin";

const AdminBannersPage = ({ user, children }) => {
    const router = useRouter();
    const formSearchRef = useRef({});
    const [myTimeout, setMyTimeout] = useState();
    const [tableData, setTableData] = useState([]);
    const [pagination, setPagination] = useState({});
    const [sorter, setSorter] = useState({});
    const [filter, setFilter] = useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectionType, setSelectionType] = useState("checkbox");
    const [slideId, setSlideId] = useState(router.query['slideId'] || '');
    //Permissions
    const canList   = checkPermission(user, 'banner_list');
    const canCreate = checkPermission(user, 'banner_add');
    const canEdit   = checkPermission(user, 'banner_edit');
    const canDetail = checkPermission(user, 'banner_detail');
    const canDelete = checkPermission(user, 'banner_delete');

    //Init load
    useEffect(function() {
        if(!canList || !slideId) {
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
        filtera += `&slideId=${slideId}`;
        let params = {
            router,
            path: `/api/v1/admin/banners?page=${page}&limit=${limit}&orderBy=${orderBy}&order=${order}&${filtera}`,
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
            path: `/api/v1/admin/banners?${query}`,
            method: "DELETE",
            token: user.token,
        };
        let res = await ApiCall(params);
        if(!res.status) return showError(res);
        showSuccess(res);
        fetchList(pagination, filter, sorter);
        if(!id) setSelectedRowKeys([]);
    };

    const handleSearch = function(isRest = false) {
        if(isRest) {
            formSearchRef.current.title.value = '';
            formSearchRef.current.active.value = '';
        }

        let currentFilter = '';
        let currentFormSearch = {
            title:  formSearchRef.current.title.value,  
            active:  formSearchRef.current.active.value.value,
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
            title: "Image",
            dataIndex: "image",
            render: (image) => {
                return (
                    <Image
                        src={getObjectTrans(image)}
                        width={50}
                    />
                );
            },
        },
        {
            title: "Title",
            dataIndex: "title",
            sorter: true,
            sortDirections: ["ascend", "descend"],
            render: (title, row, index) => {
                return getObjectTrans(title);
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
                            onClick={() => router.push(`/admin/banners/edit/${row.id}?slideId=${slideId}`)} 
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
            {canCreate ? <AdminButton href={`/admin/banners/create?slideId=${slideId}`}>Create</AdminButton> : ''}
        </React.Fragment>
    );

    const header = (
        <PageHeader pretitle="admin" title="Banners" button={createBtn} separator={true}>
            Banner
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <BlockSplitter height={25} />
                <Divider orientation="left">Filter</Divider>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: "1rem" }}>
                        <Input
                            ref={el => formSearchRef.current.title = el}
                            label="Title"
                            placeholder="Title"
                            maxLength="255"
                        />
                    </ListItem>
                    <ListItem style={{ marginRight: "1rem" }}>
                        <InputSelect
                            ref={el => formSearchRef.current.active = el}
                            label={<label style={{ display: "inline-block" }}>Status</label>}
                            labelInValue
                            defaultValue={{ value: "", label: "None" }}
                        >
                            <Select.Option value="">None</Select.Option>
                            <Select.Option value={true}>Active</Select.Option>
                            <Select.Option value={false}>Disabled</Select.Option>
                        </InputSelect>
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

export default withAuth(AdminBannersPage);