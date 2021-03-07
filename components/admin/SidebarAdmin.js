import Sidebar from "components/diginext/containers/Sidebar";
import AdminLogo from "components/dashkit/Logo";
import AdminIcon from "components/dashkit/Icon";
import AppLink from "components/diginext/link/AppLink";
import { useRouter } from "next/router";
import { checkPermission } from "@/helpers/helpers";
import { Menu } from "antd";
import { routes } from "modules/mock/routes";
const { SubMenu } = Menu;

const SidebarAdmin = ({ children, width = 250, user }) => {
    const router = useRouter();

    //active submenu
    let currentSubmenu = "";
    let currentMenuItem = "";
    let routePath = router.pathname;
    for(let submenu of routes) {
        let activeRegexes = submenu.activeRegexes || [];
        // active submenu
        if(activeRegexes.length >= 1) {
            for(let activeRegex of activeRegexes) {
                let resultRegex = routePath.match(activeRegex);
                if(resultRegex) {
                    currentSubmenu = submenu.key;
                    break;
                }
            }
        }
        //
        if(submenu.children.length <= 0) continue;
        for(let children of submenu.children) {
            let activeRegexes = children.activeRegexes || [];
            if(activeRegexes.length <= 0) continue;
            for(let activeRegex of activeRegexes) {
                let resultRegex = routePath.match(activeRegex);
                if(resultRegex) {
                    currentMenuItem = children.key;
                    break;
                }
            }
        }
    }
    
    return (
        <Sidebar width={width}>
            <AdminLogo maxWidth="60%" style={{ paddingTop: "1.2rem", paddingBottom: "1.2rem" }} />
            <Menu
                style={{ width: width }}
                defaultSelectedKeys={[router.pathname, currentMenuItem]}
                defaultOpenKeys={["admin-users", currentSubmenu]}
                mode="inline"
            >
                <Menu.Item key="/admin">
                    <AppLink href="/admin">
                        <AdminIcon name="dashboard" />
                        <span>Dashboard</span>
                    </AppLink>
                </Menu.Item>

                { routes.map(route => {
                    return (
                        route.children.length <= 0 
                        ?   <Menu.Item style={{display: checkPermission(user, route.permissions) ? '' : 'none'}} key={ route.path }>
                                <AppLink href={ route.path }>
                                    { route.meta?.icon && <AdminIcon name={ route.meta.icon } /> }
                                    <span>{  route.name }</span>
                                </AppLink>
                            </Menu.Item>
                        :   <SubMenu
                                style={{display: checkPermission(user, route.permissions) ? '' : 'none'}}
                                key={ route.key }
                                title={
                                    <span>
                                        { route.meta?.icon && <AdminIcon name={ route.meta.icon } /> }
                                        <span>{  route.name }</span>
                                    </span>
                                }
                            >
                                { route.children.map(child => {
                                    return (
                                        <Menu.Item style={{marginTop: '1.2rem !important', display: checkPermission(user, child.permissions) ? '' : 'none'}} key={ child.key }>
                                            <AppLink href={ `${child.path}` }>
                                                { child.meta?.icon } <span>{  child.name }</span>
                                            </AppLink>
                                        </Menu.Item>
                                    )
                                }) }
                                
                            </SubMenu>  
                    )
                }) }
            </Menu>
        </Sidebar>
    );
};

export default SidebarAdmin;
