import { useEffect, useRef, useState } from "react";
import { Switch, Select } from "antd";
import { useRouter } from "next/router";
//
import BackButton from "components/admin/BackButton";
import LayoutPage from "components/admin/LayoutPage";
import Section from "@/diginext/containers/Section";
import PageHeader from "@/dashkit/PageHeader";
import AdminButton, { ButtonSize } from "@/dashkit/Buttons";
import { Input, ValidationType, InputSelect } from "@/diginext/form/Form";
import { HorizontalList, ListItem, ListItemSize } from "@/diginext/layout/ListLayout";
import { showMessages, showSuccess, showError, checkPermission } from "@/helpers/helpers";
import * as slideContant from '@/constants/slide';
import ApiCall from "modules/ApiCall";
import { withAuth } from "plugins/next-auth/admin";

const AdminSlidesCreatePage = ({ user }) => {
    const router = useRouter();
    const formInputRef = useRef({});
    const [formInput, setFormInput] = useState({});
    const [myTimeout, setMyTimeout] = useState();
    //Const
    const pageCodes = slideContant.pageCodes;
    //Permissions
    const canCreate = checkPermission(user, 'slide_add');
    
    //Init load
    useEffect(function() {
        if(!canCreate) {
            router.push('/admin');
        }
    }, []);

    // methods
   
    // save
    const saveHandler = function() {
        let msgs = [];
        let currentFormInput = {
            atPage: formInputRef.current.atPage.value.value,
            name: formInputRef.current.name.value,
            active: formInput.active || false
        };

        if(msgs.length) {
            return showMessages(msgs);
        }

        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function() {
            let params = {
                router,
                path: `/api/v1/admin/slides`,
                token: user.token,
                method: 'POST',
                data: currentFormInput
            };
            let res = await ApiCall(params);
            if(!res.status) return showError(res);
            showSuccess(res);
            router.push('/admin/slides');
        }, 1000);
        setMyTimeout(loginTimeout);
    }

    const header = (
        <PageHeader pretitle="Slides" title="Create" button={<BackButton />} separator={true}>
            Tạo slide
        </PageHeader>
    );
    
    return (
        <LayoutPage header={header} user={user}>
            <Section borderBottom={true} style={{ padding: "2rem 0" }}>
                <HorizontalList itemSize={ListItemSize.STRETCH}>
                    <ListItem style={{ marginRight: "1rem" }}>
                        <Input
                            ref={el => formInputRef.current.name = el}
                            defaultValue={formInput.name}
                            label="Name"
                            placeholder="Name"
                            maxLength="255"
                            validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: "Bắt buộc" }]}
                        />
                    </ListItem>
                    <ListItem style={{ marginRight: "1rem" }}>
                        <InputSelect
                            ref={el => formInputRef.current.atPage = el}
                            label={<label style={{ display: "inline-block" }}>Page <span style={{color: "red"}}>*</span></label>}
                            labelInValue
                            style={{ width: '50%'}}
                            defaultValue={{ label: pageCodes[Object.keys(pageCodes)[0]], value: Object.keys(pageCodes)[0]}}
                            required
                        >
                            {Object.keys(pageCodes).map(function(key) {
                                return(
                                    <Select.Option key={key} value={key}>{pageCodes[key]}</Select.Option>
                                )
                            })}                            
                        </InputSelect>
                    </ListItem>
                </HorizontalList>
                
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

export default withAuth(AdminSlidesCreatePage);