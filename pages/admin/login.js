import { notification, Spin } from "antd";
import CenterContainer from "@/diginext/containers/CenterContainer";
import BlockSplitter from "@/diginext/elements/BlockSplitter";
import InlineSplitter from "@/diginext/elements/InlineSplitter";
import { Input, InputType, ValidationType } from "@/diginext/form/Form";
import BasicLayout from "@/diginext/layout/BasicLayout";
import FullscreenLayout from "@/diginext/layout/FullscreenLayout";
import {
    HorizontalList,
    HorizontalListAlign,
    VerticalList,
    VerticalListAlign,
} from "@/diginext/layout/ListLayout";
import AdminButton, { ButtonSize } from "components/dashkit/Buttons";
import { useRouter } from "next/router";
import asset from "plugins/assets/asset";
import CONFIG from "web.config";
import { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { useMediaQuery } from "react-responsive";
import { DefaultStyles } from "components/admin/layout/AdminGlobalStyle";
import AdminMasterPage from "components/admin/layout/AdminMasterPage";

const AdminLogin = () => {
    const router = useRouter();
    const emailRef = useRef();
    const passRef = useRef();

    const isDesktop = useMediaQuery({ minWidth: 1025 });
    const [shouldLayoutDesktop, setShouldLayoutDesktop] = useState(true);
    const [myTimeout, setMyTimeout] = useState();


    useEffect(() => {
        if (isDesktop) {
            setShouldLayoutDesktop(true);
        } else {
            setShouldLayoutDesktop(false);
        }
    });

    const loginHandler = async () => {
        clearTimeout(myTimeout);
        let loginTimeout = setTimeout(async function() {
            if (emailRef.current.isValid && passRef.current.isValid) {
                let body = {
                    email: emailRef.current.value,
                    password: passRef.current.value,
                };
                let res;
                try {
                    res = await Axios({
                        url: `${CONFIG.getBasePath()}/api/login`,
                        method: "POST",
                        data: JSON.stringify(body),
                        headers: {
                        "Content-Type": "application/json",
                        },
                    });
                } catch (e) {
                    res = e.response;
                }
        
                if (res.data.status) {
                    router.push("/admin");
                } else {
                    if (res.data.message) {
                        if (typeof res.data.message == "string") res.data.message = [res.data.message];
                            res.data.message.map((msg) => {
                            notification.error({
                                message: msg,
                            });
                        });
                    } else {
                        notification.error({
                            message: "Something wrong, please try again later.",
                        });
                    }
                }
            }
            setMyTimeout();
        }, 1000);
        setMyTimeout(loginTimeout);
    };

    const SignInContainer = (
        <BasicLayout className="login-container" minWidth="360px">
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h1>Sign in</h1>
                <p style={{ color: DefaultStyles.colors.secondary }}>Đăng nhập vào trang quản trị.</p>
            </div>
            <Input
                ref={emailRef}
                label="Email Address"
                placeholder="name@address.com"
                validateConditions={[{ type: ValidationType.EMAIL, errMessage: "Không đúng định dạng email." }]}
                onKeyPress={(event) => {
                if(event.key === 'Enter') {
                    loginHandler()
                }
                }} 
            />
            <Input
                ref={passRef}
                label="Password"
                type={InputType.PASSWORD}
                placeholder="Nhập mật khẩu của bạn"
                validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: "Vui lòng nhập mật khẩu." }]}
                onKeyPress={(event) => {
                if(event.key === 'Enter') {
                    loginHandler()
                }
                }} 
            />
            <AdminButton 
                size={ButtonSize.LARGE} 
                onClick={loginHandler} 
                style={{ width: "100%", textAlign: "center" }}
                disabled={myTimeout ? true : false}
            >
                Sign in
            </AdminButton>

            <div style={{ textAlign: "center", marginTop: "20px", display: myTimeout ? '' : 'none' }}>
                <Spin tip="Sign in..."></Spin>
            </div>
            <BlockSplitter height={20} />
        </BasicLayout>
    );

    const SignInVisual = (
        <BasicLayout width={shouldLayoutDesktop ? "500px" : "60%"}>
            <img alt="login" src={asset("/admin/images/login_visual.png")} />
        </BasicLayout>
    );

    const DesktopLayout = (
        <FullscreenLayout backgroundColor="#E5E5E5">
            <CenterContainer>
                <HorizontalList align={HorizontalListAlign.MIDDLE}>
                    {SignInContainer}
                    <InlineSplitter width={60} />
                    {SignInVisual}
                </HorizontalList>
            </CenterContainer>
        </FullscreenLayout>
    );

    const MobileLayout = (
        <VerticalList align={VerticalListAlign.CENTER}>
            <BlockSplitter height={50} />
            {SignInVisual}
            <BlockSplitter height={50} />
            {SignInContainer}
        </VerticalList>
    );

    return <AdminMasterPage>{shouldLayoutDesktop ? DesktopLayout : MobileLayout}</AdminMasterPage>;
};

export default AdminLogin;
