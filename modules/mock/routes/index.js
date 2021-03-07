
export const routes = [
    {
        path: "/admin/slides",
        key: "admin-slides",
        activeRegexes: [
            /^\/admin\/slides.*/,
            /^\/admin\/banners.*/,
        ],
        name: "Slide",
        meta: { icon: "sliders", title: "Tag" },
        permissions: ['tag_list', 'tag_add'],
        hidden: false,
        children: [
            {
                path: "/admin/slides",
                key: "/admin/slides",
                activeRegexes: [
                    /^\/admin\/slides\/(?!create).*/,
                    /^\/admin\/banners.*/,
                ],
                name: "List",
                permissions: ['slide_list'],
                hidden: false,
                meta: { icon: "", title: "List" },
            },
            {
                path: "/admin/slides/create",
                key: "/admin/slides/create",
                activeRegexes: [
                    /^\/admin\/slides\/create.*/,
                ],
                name: "Create",
                permissions: ['slide_add'],
                hidden: false,
                meta: { icon: "", title: "Create" },
            }
        ]
    },
    {
        path: "/admin/pages",
        key: "admin-pages",
        activeRegexes: [
            /^\/admin\/pages.*/,
        ],
        name: "Page",
        meta: { icon: "book-open", title: "Page" },
        permissions: ['page_list'],
        hidden: false,
        children: []
    },
    {
        path: "/admin/users",
        key: "admin-users",
        activeRegexes: [
            /^\/admin\/users.*/,
            /^\/admin\/roles.*/,
            /^\/admin\/setting.*/,
        ],
        name: "Admin",
        meta: { icon: "admin", title: "Admin" },
        permissions: ['user_list', 'role_list'],
        hidden: false,
        children: [
            {
                path: "/admin/users",
                key: "/admin/users",
                activeRegexes: [
                    /^\/admin\/users.*/,
                ],
                name: "Users",
                permissions: ['user_list'],
                hidden: false,
                meta: { icon: "", title: "Users" },
            },
            {
                path: "/admin/roles",
                key: "/admin/roles",
                activeRegexes: [
                    /^\/admin\/roles.*/,
                ],
                name: "Roles",
                permissions: ['role_list'],
                hidden: false,
                meta: { icon: "", title: "Roles" },
            },
            {
                path: "/admin/setting",
                key: "/admin/setting",
                activeRegexes: [
                    /^\/admin\/setting.*/,
                ],
                name: "Setting",
                permissions: ['setting_list', 'setting_edit'],
                hidden: false,
                meta: { icon: "", title: "Setting" },
            }
        ]
    },
]