import Axios from "axios";
import CONFIG from "web.config";
import qs from "querystring";
import { trackingFormData, trackingFormUrl } from "@/helpers/helpers";

// import FormData from "form-data";
let FormData;
if (typeof window == "undefined") {
  FormData = require("form-data");
} else {
  FormData = window.FormData;
}

const ApiCall = async ({ path, method = "GET", data = {}, token, router, contentType = null }) => {
  let api;
  let axiosOption = {
    url: CONFIG.NEXT_PUBLIC_API_BASE_PATH + path,
    method: method,
    headers: {},
  };

  //   console.log("axiosOption.url", axiosOption.url);

  if (method.toUpperCase() == "GET") {
  } else if (contentType == 1) {
    var form = new FormData();
    trackingFormData(form, data);
    axiosOption.headers = {
      "Content-Type": "multipart/form-data",
    };
    axiosOption.maxBodyLength = Infinity;
    axiosOption.maxContentLength = Infinity;
    axiosOption.data = form;
  } else {
    var form = {};
    trackingFormUrl(form, data);
    axiosOption.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    axiosOption.data = qs.stringify(form);
  }

  //   console.log("axiosOption.data", axiosOption.data);

  if (token) axiosOption.headers["Authorization"] = "Bearer " + token;

  try {
    api = await Axios(axiosOption);
  } catch (e) {
    api = e.response;
  }

  if (!api) {
    api = {
      data: {
        status: false,
        message: `[API ERROR - ${method.toUpperCase()}] Can't connect with [${path}]. Please contact your IT service for support.`,
        data: {},
      },
    };
  } else if (api && api.data && [400, 401, 403].includes(api.data.statusCode) && router) {
    router.push("/admin/logout");
  } else {
    return api.data;
  }
};

const ApiLogout = async ({ token }) => {
  let api = await ApiCall({
    path: "/api/v1/auth/users/logout",
    token: token,
  });

  return api;
};

export { ApiLogout };

export default ApiCall;
