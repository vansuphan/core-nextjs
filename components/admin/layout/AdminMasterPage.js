import Head from "next/head";
import CONFIG from "web.config";
import { useRouter } from "next/router";
import AdminGlobalStyle from "../../dashkit/style/DashkitGlobalStyle";
import asset from "plugins/assets/asset";

const AdminMasterPage = ({ pageName, children }) => {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>
                {CONFIG.site.title} | {pageName || "Trang quản trị"}
                </title>

                <link rel="shortcut icon" href={`${CONFIG.getBasePath()}/favicon.ico`} />

                <meta name="description" content={CONFIG.site.description}></meta>
                <link href={asset("/dashkit/fonts/cerebrisans/cerebrisans.css")} rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/styles/dracula.min.css" />

                {/* <link href={asset("/admin/css/antd.css")} rel="stylesheet" /> */}
                {/* <link href={asset("/admin/css/antd.css.map")} rel="stylesheet" /> */}
                <script src="https://ckeditor.com/apps/ckfinder/3.5.0/ckfinder.js"></script>
            </Head>

            <AdminGlobalStyle/>
            <style global jsx>
                {`.ant-select.ant-pagination-options-size-changer.ant-select-single.ant-select-show-arrow {
                    margin-top: 0px;
                }`}
            </style>
            
            {children}
        </>
    );
};

export default AdminMasterPage;
