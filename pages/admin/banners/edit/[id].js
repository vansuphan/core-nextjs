import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Switch, Tabs } from "antd";
//
import BackButton from "components/admin/BackButton";
import LayoutPage from "components/admin/LayoutPage";
import AdminButton, { ButtonSize } from "@/dashkit/Buttons";
import PageHeader from "@/dashkit/PageHeader";
import Section from "@/diginext/containers/Section";
import { Input, ValidationType, TextArea } from "@/diginext/form/Form";
import { HorizontalList, ListItem, ListItemSize } from "@/diginext/layout/ListLayout";
import SingleImage from '@/diginext/upload/singleImage'
import { showMessages, showSuccess, showError, checkPermission, postGetForm, preSaveForm } from "@/helpers/helpers";
import { getObjectTrans } from "@/helpers/translation";
import { locales, defaultLocale } from "@/constants/locale";
import { withAuth } from "plugins/next-auth/admin";
import ApiCall from "modules/ApiCall";
const { TabPane } = Tabs;

const AdminBannersEditPage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();
    const [slideId, setSlideId] = useState(router.query['slideId'] || '');
    const { id } = router.query
    //Permissions
    const canEdit   = checkPermission(user, 'banner_edit');
    const canDetail = checkPermission(user, 'banner_detail');

    //Init load
    useEffect(function() {
        if(!canEdit || !canDetail || !slideId) {
            router.push('/admin');
        } else {
            fetchDetail();
        }
    }, []);

    // methods
    const fetchDetail = async function() {
        let params = {
            router,
            path: `/api/v1/admin/banners/${id}`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if(!res.status) return showError(res);
        let formInput = res.data;
        postGetForm(formInput, ['image', 'imageMb']);
        setFormInput(formInput);
    };

    // save
    const saveHandler = function() {
        let msgs = [];
        let currentFormInput = {
            sortOrder: formInputRef.current.sortOrder.value,
            active: formInput.active || false,
            image: {
                vi: formInput.imagevi,
                en: formInput.imageen
            },
            imageMb: {
                vi: formInput.imageMbvi,
                en: formInput.imageMben
            },
            title: {
                vi: formInputRef.current['title_vi'].value,
                en: formInputRef.current['title_en'].value
            },
            shortDescription: {
                vi: formInputRef.current['shortDescription_vi'].value,
                en: formInputRef.current['shortDescription_en'].value
            },
            link: {
                vi: formInputRef.current['link_vi'].value,
                en: formInputRef.current['link_en'].value
            }
        };

        if(msgs.length) {
            return showMessages(msgs);
        }

        preSaveForm(formInput, currentFormInput, ['image', 'imageMb']);
        //
        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function() {
            let params = {
                router,
                path: `/api/v1/admin/banners/${id}?slideId=${slideId}`,
                token: user.token,
                method: 'PUT',
                data: currentFormInput,
                contentType: 1
            };
            let res = await ApiCall(params);
            if(!res.status) return showError(res);
            showSuccess(res);
            router.push(`/admin/banners?slideId=${slideId}`);
        }, 1000);
        setMyTimeout(loginTimeout);
    }

    //Single Upload
    const handleChangeSingleUpload = function(type, data) {
        setFormInput({
            ...formInput,
            ...data
        });
    };

    const header = (
        <PageHeader pretitle="Banners" title="Update" button={<BackButton />} separator={true}>
            Cập nhật banner
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <Section borderBottom={true} style={{ padding: "2rem 0" }}>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: "1rem" }}>
                        <div className="form-group">
                            <label style={{ marginRight: "15px" }}>Status</label>
                            <Switch
                                checked={formInput.active}
                                onChange={() => {
                                    setFormInput({
                                        ...formInput,
                                        active: !formInput.active
                                    })
                                }}
                            />
                        </div>
                    </ListItem>
                </HorizontalList>

                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: "1rem" }}>
                        <Input
                            ref={el => formInputRef.current.sortOrder = el}
                            defaultValue={formInput.sortOrder}
                            label="Sort Order"
                            placeholder="0"
                            maxLength="255"
                            validateConditions={[
                                { type: ValidationType.NOT_EMPTY, errMessage: "Bắt buộc" },
                                { type: ValidationType.NUMBERS, errMessage: "Phải là số" }
                            ]}
                        />
                    </ListItem>
                </HorizontalList>

                <Tabs defaultActiveKey={defaultLocale} >
                {
                    Object.keys(locales)
                    ? Object.keys(locales).map(function(locale) {
                        return (
                            <TabPane forceRender={true} tab={locales[locale]} key={locale}>
                                <HorizontalList style={{width: '50%'}}>
                                    <SingleImage
                                        name={`image${locale}`}
                                        imageUrl={formInput[`image${locale}Url`]}
                                        handleChange={handleChangeSingleUpload}
                                    />
                                </HorizontalList>

                                <HorizontalList style={{width: '50%'}}>
                                    <SingleImage
                                        name={`imageMb${locale}`}
                                        imageUrl={formInput[`imageMb${locale}Url`]}
                                        handleChange={handleChangeSingleUpload}
                                    />
                                </HorizontalList>

                                <HorizontalList itemSize={ListItemSize.STRETCH}>
                                    <ListItem style={{ marginRight: "1rem" }}>
                                        <Input
                                            ref={el => formInputRef.current[`title_${locale}`] = el}
                                            defaultValue={getObjectTrans(formInput.title, locale)}
                                            label="Title"
                                            placeholder="Title"
                                            maxLength="255"
                                        />
                                    </ListItem>
                                </HorizontalList>

                                <HorizontalList itemSize={ListItemSize.STRETCH}>
                                    <ListItem>
                                        <TextArea
                                            ref={el => formInputRef.current[`shortDescription_${locale}`] = el}
                                            defaultValue={getObjectTrans(formInput.shortDescription, locale)}
                                            label="Short Description"
                                            placeholder="Short Description"
                                            maxLength="10000"
                                            height="100px"
                                        />
                                    </ListItem>
                                </HorizontalList>

                                <HorizontalList itemSize={ListItemSize.STRETCH}>
                                    <ListItem>
                                        <Input
                                            ref={el => formInputRef.current[`link_${locale}`] = el}
                                            defaultValue={getObjectTrans(formInput.link, locale)}
                                            label="Link"
                                            placeholder="Link"
                                            maxLength="255"
                                        />
                                    </ListItem>
                                </HorizontalList>
                            </TabPane>
                        )
                    }) : ''
                }
                </Tabs>

                <AdminButton
                    size={ButtonSize.LARGE}
                    onClick={saveHandler}
                    style={{margin: '20px'}}
                >
                    Save changes
                </AdminButton>
            </Section>
        </LayoutPage>
    )
};

export default withAuth(AdminBannersEditPage);