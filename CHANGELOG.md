# CHANGELOG
---

### Version 1.3.7
Date: 2020-12-31
- **[IMPROVE] Bỏ `Dockerfile` -> thay bằng `Dockerfile.staging` và `Dockerfile.prod`**
- **[NEW] Cập nhật file `env.json` mặc định**

---

### Version 1.3.6
Date: 2020-12-30
- [IMPROVE] Update `TreasureScript` and `GaTrackingScript` components
- [NEW] Add some useful hooks: `useArray`, `useDimensions`, `useEventListener`, `useInterval`, `usePrevious`, `useFullscreen`
- [NEW] Add more icons (`sound`, `sound-off`, `hamburger-thin`) to `component/dashkit/icons/`
- [FIX] Admin login with spinner animation.
- [FIX] Fix some small issues of `VerticalList` and `HorizontalList`
- [FIX] Some minor issues

---

### Version 1.3.5
Date: 2020-12-10
- [EDIT] turn off ssl localhost by default
- [NEW] add private function in class in babel
- [NEW] add plugins

---

### Version 1.3.4
Date: 2020-12-09
- [FIX] pixi basic scene
- [EDIT] README config in window

---

### Version 1.3.3
Date: 2020-12-03
- [HOTFIX] Add bundle analyzer to `next.config.js`
- [FIX] Build docker logic
- [FIX] Admin: `Too many redirects`
- [FIX] Plugins: `next-auth`, `next-session`

---

### Version 1.3.2
Date: 2020-11-30
- [HOTFIX] Updated `deployment/deployment_dev.yml`

---

### Version 1.3.1
Date: 2020-11-26
- [UPDATE] Fix and add more `plugins/utils`
- [FIX] Remove demo three scene by default

---

### Version 1.3.0
Date: 2020-11-22

- [NEW] Thêm script để build **Docker Images** -> `digitop/diginext` -> `docker/release.sh`
- [NEW] Nâng cấp lên **Next.js 10.0.2+**.
- [NEW] Áp dụng tree shaking đối với các component của `Ant.Design`.
- [NEW] Áp dụng tree shaking đối với `lodash`.
- [NEW] Added `bundle-analyzer` for script optimization task.
- [NEW] Added `optimizer/resize.js` -> `yarn resize` to resize images in public folder to half or quarter.
- [NEW] Added `react-spring` and `plugins/next-gsap` for animation purposes.
- [NEW] Added more examples.

---

### Version 1.2.6
Date: 2020-11-13

- [NEW] Add `yarn pr`: Open new tab to create pull reuqest in bitbucket
- [NEW] Add more `plugins/utils`: (`ObjectExtra.js`, `ArrayExtra.js`)
- [THREE.JS] Fixed `gridEnabled` when disable `lightEnabled` in `/plugins/three/App${XX}.js`.

---

### Version 1.2.5
Date: 2020-11-11

- [NEW] Thêm `<QuillEditor>` component (Using [this package](https://github.com/gtgalone/react-quilljs))
- [NEW] Thêm code hint cho `Form` (Input, TextEditor, QuillEditor,...)
- [FIXED] Sửa 1 số lỗi của `Form`.
- [FIXED] Bỏ `diginext.json` trong `.dockerignore`.

---

### Version 1.2.4
Date: 2020-11-10

- [FIXED] Sửa lỗi layout trang admin.
- [FIXED] Sửa cấu hình IRON_SESSION trong env.example
- [FIXED] Sửa lỗi `ListLayout` - `HorizontalList`

---

### Version 1.2.3
Date: 2020-11-04

- [FIXED] Tâm fixed some minor issues and create some new bugs.

---

### Version 1.2.2
Date: 2020-11-04

- [NEW] Added `/pages/admin`: core layouts of admin panel.
- [NEW] Added `diginext.json` to `.gitignore`.
- [NEW] Added more Dashkit icons.
- [CHANGED] Updated `jsconfig.json`
- [CHANGED] Updated `/plugins/next-session/**`.
- [CHANGED] Updated `.env.local` and `.env.example` to connect API endpoints.
- [FIXED] Fixed and improve `/components/diginext/layout/**`.

---