
export const ENVIRONMENT_DATA = {
  PRODUCTION: "production",
  STAGING: "staging",
  DEVELOPMENT: "development",
}

const CONFIG = {
  environment: process.env.NEXT_PUBLIC_ENV || "development",
  site: {
    title: "Diginext Website",
    description: "Description goes here",
    type: "article",
  },
  links: {
    facebookPage: "",
  },
  dateFormat: "yyyy-MM-dd HH:mm:ss",
  // these variables can be exposed to front-end:
  NEXT_PUBLIC_FB_APP_ID: process.env.NEXT_PUBLIC_FB_APP_ID || "",  // currently using XXX
  NEXT_PUBLIC_FB_PAGE_ID: process.env.NEXT_PUBLIC_FB_PAGE_ID || "1162214040532902",  // currently using Digitop developers
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || "",
  NEXT_PUBLIC_API_BASE_PATH: process.env.NEXT_PUBLIC_API_BASE_PATH || "",
  NEXT_PUBLIC_CDN_BASE_PATH: process.env.NEXT_PUBLIC_CDN_BASE_PATH || "",
  NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN || "",
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "",
  // some secret keys which won't be exposed to front-end:
  SOME_SECRET_KEY: process.env.SOME_SECRET_KEY || "",
  IRON_SESSION_NAME: "DIGINEXTADMINCOOKIE",
  IRON_SESSION_SECRET: process.env.IRON_SESSION_SECRET || "",
  get SESSION_NAME() {
    return `DIGINEXTAPPCOOKIE`;
  },
  getBasePath: () => {
    return CONFIG.NEXT_PUBLIC_BASE_PATH ? "/" + CONFIG.NEXT_PUBLIC_BASE_PATH : "";
  },
  getBaseUrl: () => {
    return CONFIG.NEXT_PUBLIC_BASE_URL ? CONFIG.NEXT_PUBLIC_BASE_URL : "";
  },
  path: (path) => {
    return CONFIG.getBasePath() + path;
  },
};

if (typeof window != "undefined") {
  window.__config__ = CONFIG;
  // console.log(CONFIG);
} else {
  // console.log(CONFIG);
}

export default CONFIG;
