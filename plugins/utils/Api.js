
// using formdata-polyfill instead of require'form-data'
// require('formdata-polyfill');
import axios from 'axios';
import User from './User';
import Config from 'lib/config';
export const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
export const basePath = Config.api.basePath;

export const routes = {
    login: basePath + "/login/facebook?access_token=&post_id=",
    loginNoQuery: basePath + "/login/facebook",
    upload: basePath + "/api/uploads",
    getlink: basePath + "/api/posts/{post_id}"
}

export const api = axios.create({
    baseURL: PROXY_URL + basePath,
    headers: {
        'Accept': 'multipart/form-data',
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': true
    },
    withCredentials: false,

});

export const addToken = (token) => {
    api.defaults.headers.Authorization = `something ${token}`
}

export const removeToken = () => {
    delete api.defaults.headers.Authorization;
}





class UrlLoader {
    // static ApiPath = ApiPath;
    // static ObjectConverter = ObjectConverter;



    static Method = {
        POST: "POST"
        , GET: "GET"
        , PUT: "PUT"
        , DELETE: "DELETE"
        , PATCH: "PATCH"
    }

    static ErrorType = {

        networkError: "Network Error",
        backendError: "Backend issue",
        postError: "Wrong format",
        undefine: "Lỗi không xác định",

    };

    static getErrorFromMessage(messages) {

        if (messages != null) {
            let s = "";
            for (let i = 0; i < messages.length; i++) {
                let br = i < messages.length - 1 ? '\n' : "";

                s += messages[i].toString() + br;
            }
            return s;
        } else
            return UrlLoader.ErrorType.postError;
    }


    static handleError(object, options) {

        options = options || {};
        let errorType = options['errorType'] || "";
        let errorText = options['errorText'] || "";
        let data = options['data'] || {};
        let statusCode = options['statusCode'] || "";
        let responseText = options['responseText'] || "";
        let responseMessage = options['responseMessage'] || "";
        let status = options['status'] || "";

        let _errorText = typeof errorText == 'string' ? errorText : UrlLoader.getErrorFromMessage(errorText);

        if (statusCode === 400 || statusCode === 422) {

            errorType = UrlLoader.ErrorType.postError;
            _errorText = "Thiếu dữ liệu!"

        } else if (statusCode === 401) {

            console.log("Vui lòng đăng nhập!");


            // AuthActions.forceLogout();

        } else if (statusCode === 403) {

            errorType = UrlLoader.ErrorType.backendError;
            _errorText = "User chưa xác thực!"
            console.log('Người dùng chưa xác thực!')

            // AuthActions.forceLogout();
        } else {
            // check if it's not actually server error (when server returns an array of failure)
            if (!(responseMessage.length > 0 && (responseMessage[0] !== ""))) {
                // responseMessage is actually empty
                responseMessage = ["Lỗi không xác định"];
                errorType = UrlLoader.ErrorType.backendError;
                _errorText = "Kết nối đến máy chủ thất bại!";

                console.log(_errorText)
            } else {
                // if(responseMessage is empty or array of empty)
                console.log("RESPONSEMESSAGE: ", responseMessage)
            }
        }

        object.hasError = true;
        object.errorType = errorType;
        object.errorText = _errorText;
        object.data = data;
        object.statusCode = statusCode;
        object.responseText = responseText;
        object.responseMessage = responseMessage;
        object.status = status;


        return object;
    }


    static async handle(url, requestInit) {
        requestInit = requestInit || {};

        requestInit.headers = {
            'Content-Type': 'multipart/form-data'
            , 'Accept': 'multipart/form-data',
            // , "Authorization": `Bearer ${ApiPath.secretToken().hash}`
            // , "apikey": Config.apikey || 1
        }

        const authToken = User.getAuthToken();
        if (authToken !== -1) {
            requestInit.headers.Authorization = `Bearer ${authToken}`;
        }

        requestInit.withCredentials = false;
        requestInit.url = url;

        requestInit.responseType = 'string';

        let response = {
            url: url,
            method: requestInit.method,
            data: {},
            statusCode: 200,
            errorType: UrlLoader.ErrorType.undefine,
            errorText: "",
            hasError: false,
        };
        let _axios = {}
        try {
            _axios = await axios(requestInit);
            response.statusCode = _axios.status;



            const json = JSON.parse(_axios.request.responseText);
            const status = json.status || 0
                , data = json.data || {}
                ;

            if (_axios.status !== 200) {
                //  statucCode != 200
                UrlLoader.handleError(response, {
                    data: data,
                    errorType: UrlLoader.ErrorType.postError,
                    errorText: "Vui lòng kiểm tra lại dữ liệu!!",
                    statusCode: _axios.status,
                    responseText: _axios.request.responseText,
                    responseMessage: json.message || "",
                    stats: status,
                })
                return response;
            }


            if (status === 1) {
                response.errorType = "";
                response.errorText = "";
                response.hasError = false;
                response.responseText = _axios.request.responseText;
                response.responseMessage = json.message
                    ? json.message.toString()
                    : "";
            } else {
                //  status != 1

                UrlLoader.handleError(response, {
                    data: data,
                    errorType: UrlLoader.ErrorType.postError,
                    errorText: "Vui lòng kiểm tra lại dữ liệu!",
                    statusCode: _axios.status,
                    responseText: _axios.request.responseText,
                    responseMessage: json.message || "",
                    stats: status,
                })

                return response;
            }

            response.data = data;

            return response;

        } catch (error) {
            //  unknown error
            console.log("error ", error);


            UrlLoader.handleError(response, {
                data: error.response && error.response.data,
                errorType: UrlLoader.ErrorType.networkError,
                errorText: "Vui lòng kiểm tra kết nối!",
                statusCode: error.response && error.response.status,
                responseText: error.request && error.request.responseText,
                responseMessage: error.response && error.response.data && error.response.data.message,
                stats: error.response && error.response.data && error.response.data.status,
            })
            return response;
        }

        // return response;
    }


    static async get(options) {
        options = options || {};
        let url = options['url'] || ""
            , param = options['param'] || {};

        console.log("START GET -> ", url);

        const requestInit = {};
        requestInit.method = 'GET';
        requestInit.params = param;
        let response = await UrlLoader.handle(url, requestInit);

        console.groupCollapsed("RESPONSE GET -> ", url);
        console.log(response);
        console.groupEnd();

        return response;
    }


    static handleData(options) {

        options = options || {};
        let param = options['param'] || {};
        let dictionary = options['dictionary'] || [];
        // [['key1', 'value1'], ['key1', 'value2'],]
        let isConvertToString = options.hasOwnProperty("isConvertToString") ? options['isConvertToString'] : true;


        let formData;
        if (Object.keys(param).length !== 0) {
            // param.time = secretToken.time;
            // param.hash = secretToken.hash;

            // param.access_token = param.access_token || access_token;

            formData = new FormData();

            for (const key in param) {
                try {

                    if (typeof param[key] == "string" || typeof param[key] == "number" || !isConvertToString) {
                        formData.append(key.toString(), param[key]);

                    } else {
                        formData.append(key.toString(), param[key].toString());
                    }
                } catch (error) {
                    console.log(error);
                    console.log(`value of ${key.toString()} must be a number, string, array `);
                }
            }
        } else if (dictionary.length !== 0) {
            // dictionary.push(['time', secretToken.time])
            // dictionary.push(['hash', secretToken.hash])

            // const found = dictionary.find(item => item.first == "access_token")
            // if (!found) dictionary.push(['access_token', access_token])

            formData = new FormData();
            for (let i = 0; i < dictionary.length; i++) {
                let item = dictionary[i];

                const key = item.first
                    , value = item.last;

                try {
                    formData.append(key, value);

                } catch (error) {
                    console.log(error);
                    console.log(`value of ${key.toString()} must be a number, string, array `);
                }
            }
        }




        return {
            param: param
            , dictionary: dictionary
            , formData: formData
        };
    }

    static async post(options) {

        options = options || {};
        let url = options['url'] || "";
        let data = UrlLoader.handleData(options);

        console.groupCollapsed("START POST -> ", url);
        console.log("param", data.param);
        console.log("dictionary", data.dictionary);
        console.groupEnd();

        const requestInit = {
            method: 'POST',
            data: data.formData,
        };

        let response = await UrlLoader.handle(url, requestInit);

        console.groupCollapsed("RESPONSE POST -> ", url);
        console.log(response);
        console.groupEnd();

        return response;
    }


    static async put(options) {
        options = options || {};
        let url = options['url'] || "";

        let data = UrlLoader.handleData(options);

        console.groupCollapsed("START PUT -> ", url);
        console.log(data.param);
        console.groupEnd();

        const requestInit = {
            method: 'PUT',
            data: data.formData
        };

        let response = await UrlLoader.handle(url, requestInit);

        console.groupCollapsed("RESPONSE PUT -> ", url);
        console.log(response);
        console.groupEnd();

        return response;
    }

    static async patch(options) {
        options = options || {};
        let url = options['url'] || "";

        let data = UrlLoader.handleData(options);

        console.groupCollapsed("START PATCH -> ", url);
        console.log(data.param);
        console.groupEnd();

        const requestInit = {
            method: 'PATCH',
            data: data.formData
        };

        let response = await UrlLoader.handle(url, requestInit);

        console.groupCollapsed("RESPONSE PATCH -> ", url);
        console.log(response);
        console.groupEnd();

        return response;
    }


    static async delete(options) {
        options = options || {};
        let url = options['url'] || "";

        let data = UrlLoader.handleData(options);

        console.groupCollapsed("START DELETE -> ", url);
        console.log(data.param);
        console.groupEnd();

        const requestInit = {
            method: 'DELETE',
            data: data.formData
        };

        let response = await UrlLoader.handle(url, requestInit);

        console.groupCollapsed("RESPONSE DELETE -> ", url);
        console.log(response);
        console.groupEnd();

        return response;
    }

}

export default UrlLoader;


